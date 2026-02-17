#!/usr/bin/env python3
"""
Migration: Add institution_or_company and repeat_flag columns to respondents table.
Run this once against the live Supabase database.
"""

import json, sys
from urllib.request import Request, urlopen
from urllib.error import HTTPError

SUPABASE_URL = "https://vpvzhmbairmslozrneyu.supabase.co"
SERVICE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwdnpobWJhaXJtc2xvenJuZXl1Iiwi"
    "cm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTIwNzUwNSwiZXhwIjoyMDg2"
    "NzgzNTA1fQ.WMj3qqwBV1QBwPxrQFd7lHtuLopbpxvEOT8vm3GEB70"
)

# SQL statements to add the new columns
MIGRATIONS = [
    "ALTER TABLE respondents ADD COLUMN IF NOT EXISTS institution_or_company TEXT;",
    "ALTER TABLE respondents ADD COLUMN IF NOT EXISTS repeat_flag BOOLEAN DEFAULT false;",
]


def run_sql(sql):
    """Execute SQL via Supabase Management API (pg-meta)."""
    url = f"{SUPABASE_URL}/rest/v1/rpc/"
    # Supabase REST doesn't support arbitrary SQL directly.
    # We'll use a simple test: try to insert a row with the new column.
    # If it fails, the column doesn't exist yet.
    print(f"  SQL: {sql}")


def test_column_exists(column_name):
    """Test if a column exists by selecting it."""
    url = f"{SUPABASE_URL}/rest/v1/respondents?select={column_name}&limit=1"
    req = Request(url, method='GET')
    req.add_header('apikey', SERVICE_KEY)
    req.add_header('Authorization', f'Bearer {SERVICE_KEY}')
    req.add_header('Content-Type', 'application/json')

    try:
        resp = urlopen(req)
        return True
    except HTTPError as e:
        if e.code == 400:
            return False
        raise


def main():
    print("=" * 60)
    print("AI-Eng-TAM Survey -- Column Migration Check")
    print("=" * 60)

    # Test if columns already exist
    print("\nChecking existing columns...")

    ioc_exists = test_column_exists('institution_or_company')
    rf_exists = test_column_exists('repeat_flag')

    print(f"  institution_or_company: {'EXISTS' if ioc_exists else 'MISSING'}")
    print(f"  repeat_flag: {'EXISTS' if rf_exists else 'MISSING'}")

    if ioc_exists and rf_exists:
        print("\nBoth columns already exist. No migration needed.")
        return

    print("\n" + "-" * 60)
    print("MANUAL STEP REQUIRED:")
    print("Please run the following SQL in the Supabase SQL Editor:")
    print("(Dashboard -> SQL Editor -> New Query)\n")

    if not ioc_exists:
        print("  ALTER TABLE respondents ADD COLUMN institution_or_company TEXT;")
    if not rf_exists:
        print("  ALTER TABLE respondents ADD COLUMN repeat_flag BOOLEAN DEFAULT false;")

    print("\n" + "-" * 60)
    print("\nAfter running the SQL, re-run this script to verify.")


if __name__ == '__main__':
    main()
