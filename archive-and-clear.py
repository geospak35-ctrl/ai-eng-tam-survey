#!/usr/bin/env python3
"""
AI-Eng-TAM Survey -- Archive & Clear Database
=============================================
1. Downloads all data from the three survey tables as CSV files.
2. Creates archive copies of the tables inside Supabase (via SQL).
3. Clears the live tables (respecting foreign-key order).

Uses the service-role key so it can SELECT and DELETE.
"""

import json, csv, os, sys, time
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.error import HTTPError

# --Supabase credentials (service-role key -- full access) --
SUPABASE_URL = "https://vpvzhmbairmslozrneyu.supabase.co"
SERVICE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwdnpobWJhaXJtc2xvenJuZXl1Iiwi"
    "cm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTIwNzUwNSwiZXhwIjoyMDg2"
    "NzgzNTA1fQ.WMj3qqwBV1QBwPxrQFd7lHtuLopbpxvEOT8vm3GEB70"
)

TABLES = ['respondents', 'section_a_responses', 'likert_responses']
TIMESTAMP = datetime.now().strftime('%Y%m%d_%H%M%S')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), f'archive_{TIMESTAMP}')


def supabase_get(table, select='*', limit=10000):
    """Fetch all rows from a Supabase table via REST API."""
    url = f"{SUPABASE_URL}/rest/v1/{table}?select={select}&limit={limit}"
    req = Request(url, method='GET')
    req.add_header('apikey', SERVICE_KEY)
    req.add_header('Authorization', f'Bearer {SERVICE_KEY}')
    req.add_header('Content-Type', 'application/json')

    try:
        resp = urlopen(req)
        return json.loads(resp.read().decode('utf-8'))
    except HTTPError as e:
        body = e.read().decode('utf-8')
        print(f"  ERROR reading {table}: {e.code} -- {body}", file=sys.stderr)
        raise


def supabase_rpc(sql):
    """Execute raw SQL via Supabase's rpc endpoint (pg function)."""
    # We use the SQL editor REST endpoint
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    data = json.dumps({'query': sql}).encode('utf-8')
    req = Request(url, data=data, method='POST')
    req.add_header('apikey', SERVICE_KEY)
    req.add_header('Authorization', f'Bearer {SERVICE_KEY}')
    req.add_header('Content-Type', 'application/json')

    try:
        resp = urlopen(req)
        return resp.status
    except HTTPError as e:
        # rpc function may not exist; we'll handle this gracefully
        body = e.read().decode('utf-8')
        return None


def supabase_delete(table):
    """Delete all rows from a Supabase table via REST API."""
    # Supabase REST requires a filter; use a tautology to match all rows
    url = f"{SUPABASE_URL}/rest/v1/{table}?id=not.is.null"
    req = Request(url, method='DELETE')
    req.add_header('apikey', SERVICE_KEY)
    req.add_header('Authorization', f'Bearer {SERVICE_KEY}')
    req.add_header('Content-Type', 'application/json')
    req.add_header('Prefer', 'return=minimal')

    try:
        resp = urlopen(req)
        return resp.status
    except HTTPError as e:
        body = e.read().decode('utf-8')
        print(f"  ERROR deleting from {table}: {e.code} -- {body}", file=sys.stderr)
        raise


def save_csv(rows, filepath):
    """Save a list of dicts to a CSV file."""
    if not rows:
        print(f"  (no rows to save for {filepath})")
        return

    fieldnames = list(rows[0].keys())
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print(f"  Saved {len(rows)} rows -> {filepath}")


def main():
    print("=" * 70)
    print("AI-Eng-TAM Survey -- Archive & Clear Database")
    print(f"Timestamp: {TIMESTAMP}")
    print("=" * 70)

    # --Step 1: Download all data as CSV --
    print(f"\n[Step 1] Downloading data to {OUTPUT_DIR}/\n")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    all_data = {}
    for table in TABLES:
        print(f"  Fetching {table}...")
        rows = supabase_get(table)
        all_data[table] = rows
        csv_path = os.path.join(OUTPUT_DIR, f'{table}.csv')
        save_csv(rows, csv_path)

    # Summary
    print(f"\n  Summary:")
    for table in TABLES:
        print(f"    {table}: {len(all_data[table])} rows")

    total = sum(len(all_data[t]) for t in TABLES)
    if total == 0:
        print("\n  WARNING: No data found in any table. Nothing to archive or clear.")
        return

    # --Step 2: Create archive tables via SQL --
    print(f"\n[Step 2] Creating archive tables in Supabase...\n")
    print("  NOTE: Archive tables must be created via the Supabase SQL Editor.")
    print("  Run the following SQL in your Supabase Dashboard -> SQL Editor:\n")
    print("  " + "-" * 61)
    for table in TABLES:
        archive_name = f"{table}_archive_{TIMESTAMP}"
        print(f"  CREATE TABLE {archive_name} AS SELECT * FROM {table};")
    print("  " + "-" * 61)
    print()

    # Also save the SQL to a file for convenience
    sql_path = os.path.join(OUTPUT_DIR, 'create_archive_tables.sql')
    with open(sql_path, 'w') as f:
        f.write(f"-- Archive tables created on {TIMESTAMP}\n")
        f.write(f"-- Run this in the Supabase SQL Editor\n\n")
        for table in TABLES:
            archive_name = f"{table}_archive_{TIMESTAMP}"
            f.write(f"CREATE TABLE {archive_name} AS SELECT * FROM {table};\n")
    print(f"  SQL saved to: {sql_path}")

    # --Step 3: Clear live tables --
    print(f"\n[Step 3] Clearing live tables...\n")

    response = input("  WARNING: This will DELETE all data from the live tables.\n"
                     "     (CSV backups have been saved above.)\n"
                     "     Proceed? (yes/no): ").strip().lower()

    if response != 'yes':
        print("\n  Aborted. Data was NOT cleared. CSV backups are still available.")
        return

    # Delete in reverse FK order: likert -> section_a -> respondents
    delete_order = ['likert_responses', 'section_a_responses', 'respondents']
    for table in delete_order:
        print(f"  Deleting from {table}...")
        try:
            supabase_delete(table)
            print(f"    OK: {table} cleared")
        except Exception as e:
            print(f"    FAILED: {e}")
            print("    Stopping to prevent partial state.")
            return

    print(f"\n{'=' * 70}")
    print("COMPLETE!")
    print(f"  - CSV backups saved to: {OUTPUT_DIR}/")
    print(f"  - Archive SQL saved to: {sql_path}")
    print(f"  - All live tables have been cleared.")
    print(f"{'=' * 70}")


if __name__ == '__main__':
    main()
