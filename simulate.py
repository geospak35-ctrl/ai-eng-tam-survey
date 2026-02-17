#!/usr/bin/env python3
"""
AI-Eng-TAM Survey Simulation — 100 Respondents
================================================
Generates realistic survey responses from 40 students, 30 faculty,
and 30 practitioners, each with a detailed persona that drives
internally-consistent Likert ratings and tool selections.

Submits directly to the live Supabase database via REST API.
"""

import json, random, uuid, time, sys
from urllib.request import Request, urlopen
from urllib.error import HTTPError

# ── Supabase credentials (anon key — same as the real survey app) ──
SUPABASE_URL = "https://vpvzhmbairmslozrneyu.supabase.co"
ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwdnpobWJhaXJtc2xvenJuZXl1Iiwi"
    "cm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMDc1MDUsImV4cCI6MjA4Njc4MzUwNX0."
    "SjwlTW9kPbPoGS8TrfzrvaUl_j-AXdSAxCsEHsAQ560"
)

# ── Item codes per section (same for all stakeholders) ──
SECTION_A_ITEMS = [
    'PU-L1','PU-L2','PU-L3','PU-L4',
    'PU-E1','PU-E2',
    'PEU1','PEU2','PEU3',
    'EJ1','EJ2','EJ3',
    'BI1','BI2','BI3',
]
SECTION_B_ITEMS = [
    'MU1','MU2','MU3','MU4',
    'LP1','LP2','LP3',
    'GB1','GB2','GB3','GB4',
    'OA1','OA2','OA3','OA4',
    'EV1','EV2','EV3',
    'ET1','ET2','ET3','ET4',
]
# Faculty has 13 items in C (AR1-8, CR1-5); Student has 9 (AR1-4, CR1-5);
# Practitioner has 13 (AR1-8, CR1-5)
SECTION_C_ITEMS_FACULTY = [
    'AR1','AR2','AR3','AR4','AR5','AR6','AR7','AR8',
    'CR1','CR2','CR3','CR4','CR5',
]
SECTION_C_ITEMS_STUDENT = [
    'AR1','AR2','AR3','AR4',
    'CR1','CR2','CR3','CR4','CR5',
]
SECTION_C_ITEMS_PRACTITIONER = [
    'AR1','AR2','AR3','AR4','AR5','AR6','AR7','AR8',
    'CR1','CR2','CR3','CR4','CR5',
]

# Note: Student Section B has fewer items (GB has 3 not 4, no GB4)
SECTION_B_ITEMS_STUDENT = [
    'MU1','MU2','MU3','MU4',
    'LP1','LP2','LP3',
    'GB1','GB2','GB3',
    'OA1','OA2','OA3','OA4',
    'EV1','EV2','EV3',
    'ET1','ET2','ET3','ET4',
]

# Practitioner Section B also has fewer (GB has 3 not 4)
SECTION_B_ITEMS_PRACTITIONER = [
    'MU1','MU2','MU3','MU4',
    'LP1','LP2','LP3',
    'GB1','GB2','GB3',
    'OA1','OA2','OA3','OA4',
    'EV1','EV2','EV3',
    'ET1','ET2','ET3','ET4',
]

# ── Tool categories and tools per stakeholder ──
CATEGORIES = ['ML','DL','NLP','CV','GenAI','Recommender','EngDesign','Robotics','Expert']

TOOLS = {
    'faculty': {
        'ML': ['Scikit-learn','TensorFlow / PyTorch','MATLAB Machine Learning Toolbox','R (caret / tidymodels)','Google Colab / Jupyter (for ML)','Azure Machine Learning','Orange Data Mining'],
        'DL': ['TensorFlow / Keras','PyTorch','ONNX','MATLAB Deep Learning Toolbox'],
        'NLP': ['ChatGPT','Claude','Google Gemini','Google Vertex AI (LLMs)','Azure OpenAI Service','spaCy / NLTK','BERT-based tools','Grammarly'],
        'CV': ['OpenCV','YOLO','TensorFlow Vision Models','MATLAB Computer Vision Toolbox','ImageJ / Fiji'],
        'GenAI': ['ChatGPT','Claude','Google Gemini','GitHub Copilot','DALL·E / Stable Diffusion / Midjourney'],
        'Recommender': ['IBM Watson','Azure AI Services','Google Recommendation AI','Learning analytics platforms (e.g., LMS-embedded)','Adaptive learning systems'],
        'EngDesign': ['ANSYS (AI/ML features)','Autodesk Fusion (AI features)','Siemens NX (AI features)','MATLAB/Simulink AI tools','Digital twin platforms'],
        'Robotics': ['ROS / ROS2','Gazebo','NVIDIA Isaac','TurtleBot','PX4 Autopilot','Educational platforms (e.g., LEGO, VEX, Arduino AI kits)'],
        'Expert': ['Drools','CLIPS','Prolog-based systems','Rules engines used in coursework'],
    },
    'student': {
        'ML': ['Scikit-learn','TensorFlow / PyTorch','MATLAB Machine Learning Toolbox','Google Colab / Jupyter (for ML)','Orange Data Mining','Weka / RapidMiner'],
        'DL': ['TensorFlow / Keras','PyTorch','MATLAB Deep Learning Toolbox','Google Colab / Jupyter (for DL)'],
        'NLP': ['ChatGPT','Claude','Google Gemini','Google Vertex AI (LLMs)','Grammarly','spaCy / NLTK','BERT-based tools'],
        'CV': ['OpenCV','YOLO','TensorFlow Vision Models','MATLAB Computer Vision Toolbox','ImageJ / Fiji'],
        'GenAI': ['ChatGPT','Claude','Google Gemini','GitHub Copilot','DALL·E / Stable Diffusion / Midjourney'],
        'Recommender': ['IBM Watson','Azure AI Services','Google Recommendation AI'],
        'EngDesign': ['ANSYS (AI/ML features)','Autodesk Fusion (AI features)','Siemens NX (AI features)','MATLAB/Simulink AI tools','Digital twin platforms'],
        'Robotics': ['ROS / ROS2','Gazebo','NVIDIA Isaac','TurtleBot','PX4 Autopilot','Educational platforms (e.g., LEGO, VEX, Arduino AI kits)'],
        'Expert': ['CLIPS','Prolog-based systems','Rules engines used in coursework'],
    },
    'practitioner': {
        'ML': ['Scikit-learn','TensorFlow / PyTorch','MATLAB Machine Learning Toolbox','SAS','Azure Machine Learning','DataRobot / H2O.ai'],
        'DL': ['TensorFlow / Keras','PyTorch','ONNX','MATLAB Deep Learning Toolbox'],
        'NLP': ['ChatGPT (Enterprise)','Claude (Enterprise)','Google Gemini (Enterprise)','Azure OpenAI Service','Amazon Bedrock','Google Vertex AI (LLMs)','spaCy','BERT-based systems'],
        'CV': ['OpenCV','YOLO','TensorFlow Vision Models','MATLAB Computer Vision Toolbox','ImageJ / Fiji','Cognex Vision','NVIDIA Metropolis'],
        'GenAI': ['ChatGPT (Enterprise)','Claude (Enterprise)','Google Gemini (Enterprise)','GitHub Copilot (Enterprise)','DALL·E / Stable Diffusion / Midjourney (Enterprise)'],
        'Recommender': ['IBM Watson','Azure AI Services','Salesforce Einstein','SAP AI','ServiceNow AI'],
        'EngDesign': ['ANSYS (AI/ML features)','Autodesk Fusion (AI features)','Siemens NX / Teamcenter (AI features)','Dassault Systèmes (AI features)','MATLAB/Simulink AI tools','Digital twin platforms (e.g., Azure Digital Twins)'],
        'Robotics': ['ROS / ROS2','Gazebo','NVIDIA Isaac','PX4 Autopilot','Industrial robot AI controllers','Autonomous inspection platforms'],
        'Expert': ['Drools','CLIPS','Prolog-based systems','Rules engines embedded in PLM/ERP'],
    },
}

# ── Experience-level encoding ──
EXP_LEVELS = {'None': 0, 'Limited': 1, 'Moderate': 2, 'Extensive': 3}

# ================================================================
# HELPER: generate a Likert value with construct-level anchoring
# ================================================================
def likert(anchor, sd=1.0):
    """Sample a 1-7 integer centered on anchor with given sd."""
    v = random.gauss(anchor, sd)
    return max(1, min(7, round(v)))

def likert_set(codes, anchor, sd=1.0):
    """Generate {code: value} for a list of codes, with per-item jitter."""
    return {c: likert(anchor, sd) for c in codes}

# ================================================================
# PERSONA DEFINITIONS
# ================================================================

def build_students():
    """40 student personas grounded in Purdue/MSU enrollment data."""
    personas = []

    # Major distribution (Purdue-calibrated): ME 30%, CompE/EE 20%, Aero 10%,
    # Civil 8%, Industrial 8%, Chemical 5%, BME 7%, Materials 5%, Other 7%
    majors_pool = (
        ['Mechanical Engineering']*12 +
        ['Electrical & Computer Engineering']*8 +
        ['Aerospace Engineering']*4 +
        ['Civil Engineering']*3 +
        ['Industrial Engineering']*3 +
        ['Chemical Engineering']*2 +
        ['Biomedical Engineering']*3 +
        ['Materials Science & Engineering']*2 +
        ['Environmental Engineering']*1 +
        ['Computer Science (Engineering track)']*2
    )
    random.shuffle(majors_pool)

    years_pool = (
        ['Freshman']*4 + ['Sophomore']*8 + ['Junior']*12 +
        ['Senior']*12 + ['Graduate']*4
    )
    random.shuffle(years_pool)

    schools = [
        'Purdue University','Purdue University','Purdue University','Purdue University','Purdue University',
        'Purdue University','Purdue University','Purdue University',
        'Ohio State University','Ohio State University','Ohio State University','Ohio State University',
        'Ohio State University','Ohio State University',
        'University of Michigan','University of Michigan','University of Michigan','University of Michigan',
        'University of Illinois','University of Illinois','University of Illinois','University of Illinois',
        'Iowa State University','Iowa State University','Iowa State University',
        'University of Minnesota','University of Minnesota',
        'University of Wisconsin-Madison','University of Wisconsin-Madison',
        'Missouri S&T','Missouri S&T',
        'Rose-Hulman Institute','Rose-Hulman Institute',
        'Milwaukee School of Engineering','Milwaukee School of Engineering',
        'University of Cincinnati','University of Cincinnati',
        'University of Iowa','Michigan State University','Michigan State University',
    ]
    random.shuffle(schools)

    exp_pool = (
        ['None']*6 + ['Limited']*14 + ['Moderate']*14 + ['Extensive']*6
    )
    random.shuffle(exp_pool)

    context_options = ['Coursework','Labs','Projects','Internships','Personal learning']

    for i in range(40):
        year = years_pool[i]
        exp = exp_pool[i]
        major = majors_pool[i]

        # AI context depends on year
        if year in ('Freshman','Sophomore'):
            ctx = random.choice(['Coursework','Labs','Personal learning'])
        elif year == 'Graduate':
            ctx = random.choice(['Projects','Internships','Personal learning'])
        else:
            ctx = random.choice(context_options)

        # Anchor scores based on experience and year
        exp_val = EXP_LEVELS[exp]
        year_val = {'Freshman':0,'Sophomore':1,'Junior':2,'Senior':3,'Graduate':4}[year]

        # Section A (Perceived Value): higher for experienced students
        anchor_A = 4.2 + 0.4 * exp_val + 0.15 * year_val + random.gauss(0, 0.3)
        # Section B (Practices/Guardrails): moderate, slightly lower
        anchor_B = 4.0 + 0.3 * exp_val + 0.1 * year_val + random.gauss(0, 0.3)
        # Section C (Readiness): students rate themselves moderately
        anchor_C_AR = 3.8 + 0.5 * exp_val + 0.15 * year_val + random.gauss(0, 0.4)
        anchor_C_CR = 4.5 + 0.3 * exp_val + 0.1 * year_val + random.gauss(0, 0.3)

        # Tool usage probability per category
        # CS/EE students use more ML/DL/NLP; ME students more EngDesign
        is_cs_ee = 'Computer' in major or 'Electrical' in major
        is_me = 'Mechanical' in major
        is_aero = 'Aerospace' in major

        cat_prob = {
            'ML':    0.15 + 0.2 * exp_val + (0.2 if is_cs_ee else 0),
            'DL':    0.05 + 0.15 * exp_val + (0.2 if is_cs_ee else 0),
            'NLP':   0.3 + 0.15 * exp_val,  # ChatGPT usage is widespread
            'CV':    0.05 + 0.1 * exp_val + (0.15 if is_cs_ee else 0),
            'GenAI': 0.5 + 0.12 * exp_val,  # Very common
            'Recommender': 0.02 + 0.05 * exp_val,
            'EngDesign': 0.1 + 0.1 * exp_val + (0.25 if is_me or is_aero else 0),
            'Robotics': 0.05 + 0.08 * exp_val + (0.15 if is_me or is_aero else 0),
            'Expert': 0.02 + 0.03 * exp_val,
        }

        personas.append({
            'type': 'student',
            'demographics': {
                'institution_or_company': schools[i],
                'major_program': major,
                'year_in_program': year,
                'prior_ai_experience': exp,
                'primary_ai_context': ctx,
            },
            'anchors': {
                'A': anchor_A,
                'B': anchor_B,
                'C_AR': anchor_C_AR,
                'C_CR': anchor_C_CR,
            },
            'cat_prob': cat_prob,
            'sd': 0.9 + random.uniform(-0.2, 0.2),
        })

    return personas


def build_faculty():
    """30 faculty personas."""
    personas = []

    disciplines = (
        ['Mechanical Engineering']*7 +
        ['Electrical & Computer Engineering']*6 +
        ['Civil Engineering']*4 +
        ['Industrial Engineering']*4 +
        ['Chemical Engineering']*3 +
        ['Biomedical Engineering']*3 +
        ['General Engineering / Engineering Education']*3
    )
    random.shuffle(disciplines)

    years_pool = ['0–5']*8 + ['6–10']*8 + ['11–20']*8 + ['21+']*6
    random.shuffle(years_pool)

    roles_pool = (
        ['Teaching']*10 + ['Research']*8 + ['Combination']*10 + ['Administration']*2
    )
    random.shuffle(roles_pool)

    inst_pool = ['R1']*15 + ['R2']*8 + ['Teaching-focused']*7
    random.shuffle(inst_pool)

    faculty_schools = (
        ['Purdue University']*6 +
        ['Ohio State University']*4 +
        ['University of Michigan']*3 +
        ['University of Illinois']*3 +
        ['Iowa State University']*3 +
        ['University of Minnesota']*2 +
        ['University of Wisconsin-Madison']*2 +
        ['Rose-Hulman Institute']*2 +
        ['Missouri S&T']*2 +
        ['Milwaukee School of Engineering']*1 +
        ['University of Cincinnati']*1 +
        ['Michigan State University']*1
    )
    random.shuffle(faculty_schools)

    exp_pool = ['None']*3 + ['Limited']*9 + ['Moderate']*12 + ['Extensive']*6
    random.shuffle(exp_pool)

    context_options = ['Teaching','Research','Assessment','Administration','Personal productivity']

    for i in range(30):
        exp = exp_pool[i]
        years = years_pool[i]
        role = roles_pool[i]
        inst = inst_pool[i]
        disc = disciplines[i]

        exp_val = EXP_LEVELS[exp]
        years_val = {'0–5':0,'6–10':1,'11–20':2,'21+':3}[years]

        # Context: researchers lean toward Research, teachers toward Teaching
        if role == 'Research':
            ctx = random.choice(['Research','Personal productivity'])
        elif role == 'Teaching':
            ctx = random.choice(['Teaching','Assessment'])
        else:
            ctx = random.choice(context_options)

        # Section A: faculty generally see value (5-6 range), experienced more
        anchor_A = 4.8 + 0.3 * exp_val + 0.1 * years_val + random.gauss(0, 0.3)
        # Section B: faculty with more experience have stronger guardrails
        anchor_B = 4.5 + 0.2 * exp_val + 0.15 * years_val + random.gauss(0, 0.3)
        # Section C AR: readiness varies — new faculty lower, experienced higher
        anchor_C_AR = 4.0 + 0.4 * exp_val + 0.1 * years_val + random.gauss(0, 0.4)
        # Section C CR: preparing career-ready engineers
        anchor_C_CR = 4.3 + 0.3 * exp_val + 0.05 * years_val + random.gauss(0, 0.35)

        is_cs_ee = 'Computer' in disc or 'Electrical' in disc
        is_eng_ed = 'General' in disc or 'Education' in disc

        cat_prob = {
            'ML':    0.2 + 0.2 * exp_val + (0.2 if is_cs_ee else 0),
            'DL':    0.1 + 0.15 * exp_val + (0.2 if is_cs_ee else 0),
            'NLP':   0.4 + 0.15 * exp_val,
            'CV':    0.1 + 0.1 * exp_val + (0.2 if is_cs_ee else 0),
            'GenAI': 0.6 + 0.1 * exp_val,
            'Recommender': 0.05 + 0.08 * exp_val + (0.15 if is_eng_ed else 0),
            'EngDesign': 0.15 + 0.12 * exp_val,
            'Robotics': 0.08 + 0.1 * exp_val,
            'Expert': 0.05 + 0.05 * exp_val,
        }

        personas.append({
            'type': 'faculty',
            'demographics': {
                'institution_or_company': faculty_schools[i],
                'engineering_discipline': disc,
                'years_in_academia': years,
                'primary_role': role,
                'institution_type': inst,
                'prior_ai_experience': exp,
                'primary_ai_context': ctx,
            },
            'anchors': {
                'A': anchor_A,
                'B': anchor_B,
                'C_AR': anchor_C_AR,
                'C_CR': anchor_C_CR,
            },
            'cat_prob': cat_prob,
            'sd': 0.85 + random.uniform(-0.15, 0.2),
        })

    return personas


def build_practitioners():
    """30 practitioner personas."""
    personas = []

    disciplines = (
        ['Mechanical Engineering']*7 +
        ['Electrical & Computer Engineering']*6 +
        ['Civil Engineering']*5 +
        ['Industrial & Systems Engineering']*4 +
        ['Chemical Engineering']*3 +
        ['Software / Systems Engineering']*3 +
        ['Aerospace Engineering']*2
    )
    random.shuffle(disciplines)

    years_pool = ['0–5']*8 + ['6–10']*8 + ['11–20']*8 + ['21+']*6
    random.shuffle(years_pool)

    roles_pool = (
        ['Engineer']*12 + ['Technical Lead']*7 +
        ['Manager']*6 + ['Hiring Manager']*5
    )
    random.shuffle(roles_pool)

    industries = [
        'Automotive','Automotive','Automotive','Automotive',
        'Aerospace & Defense','Aerospace & Defense','Aerospace & Defense',
        'Manufacturing','Manufacturing','Manufacturing','Manufacturing',
        'Energy & Utilities','Energy & Utilities',
        'Technology / Software','Technology / Software','Technology / Software',
        'Construction & Infrastructure','Construction & Infrastructure',
        'Biotechnology / Medical Devices','Biotechnology / Medical Devices',
        'Engineering Consulting','Engineering Consulting',
        'Semiconductor / Electronics','Semiconductor / Electronics',
        'Consumer Products','Consumer Products',
        'Telecommunications','Oil & Gas','Robotics / Automation','Chemical Processing',
    ]
    random.shuffle(industries)

    org_sizes = ['<100']*5 + ['100–999']*8 + ['1,000–9,999']*9 + ['10,000+']*8
    random.shuffle(org_sizes)

    companies = [
        'Caterpillar','Caterpillar','Caterpillar',
        'John Deere','John Deere','John Deere',
        'Raytheon','Raytheon',
        'Lockheed Martin','Lockheed Martin',
        'General Motors','General Motors',
        'Ford Motor Company','Ford Motor Company',
        'Tesla','Tesla',
        'Intel','Intel',
        'Texas Instruments',
        'Procter & Gamble',
        'Dow Chemical',
        'Rolls-Royce',
        'Honeywell','Honeywell',
        'Cummins','Cummins',
        'Amazon Robotics',
        'Boston Scientific',
        'Medtronic',
        'AECOM',
    ]
    random.shuffle(companies)

    exp_pool = ['None']*2 + ['Limited']*7 + ['Moderate']*13 + ['Extensive']*8
    random.shuffle(exp_pool)

    context_options = ['Engineering design','Analysis/simulation','Project management','Decision support']

    for i in range(30):
        exp = exp_pool[i]
        years = years_pool[i]
        role = roles_pool[i]
        industry = industries[i]
        org_size = org_sizes[i]
        disc = disciplines[i]

        exp_val = EXP_LEVELS[exp]
        years_val = {'0–5':0,'6–10':1,'11–20':2,'21+':3}[years]

        ctx = random.choice(context_options)

        # Section A: practitioners see high value in AI (industry perspective)
        anchor_A = 5.0 + 0.25 * exp_val + 0.1 * years_val + random.gauss(0, 0.3)
        # Section B: workplace practices — experienced practitioners rate higher
        anchor_B = 4.3 + 0.2 * exp_val + 0.1 * years_val + random.gauss(0, 0.35)
        # Section C AR: practitioners rate GRADUATE readiness LOWER than students
        # rate their own (documented pattern in workforce readiness literature)
        anchor_C_AR = 3.5 + 0.15 * exp_val + 0.05 * years_val + random.gauss(0, 0.4)
        # Section C CR: workforce preparedness
        anchor_C_CR = 3.8 + 0.2 * exp_val + 0.1 * years_val + random.gauss(0, 0.35)

        is_tech = 'Software' in disc or 'Computer' in disc or 'Technology' in industry
        is_large_org = org_size in ('1,000–9,999', '10,000+')

        cat_prob = {
            'ML':    0.3 + 0.15 * exp_val + (0.15 if is_tech else 0),
            'DL':    0.15 + 0.15 * exp_val + (0.2 if is_tech else 0),
            'NLP':   0.5 + 0.12 * exp_val,
            'CV':    0.15 + 0.1 * exp_val,
            'GenAI': 0.7 + 0.08 * exp_val,
            'Recommender': 0.15 + 0.1 * exp_val + (0.1 if is_large_org else 0),
            'EngDesign': 0.35 + 0.12 * exp_val,
            'Robotics': 0.1 + 0.1 * exp_val,
            'Expert': 0.1 + 0.08 * exp_val + (0.1 if is_large_org else 0),
        }

        personas.append({
            'type': 'practitioner',
            'demographics': {
                'institution_or_company': companies[i],
                'engineering_discipline': disc,
                'years_professional_experience': years,
                'practitioner_role': role,
                'industry_sector': industry,
                'organization_size': org_size,
                'prior_ai_experience': exp,
                'primary_ai_context': ctx,
            },
            'anchors': {
                'A': anchor_A,
                'B': anchor_B,
                'C_AR': anchor_C_AR,
                'C_CR': anchor_C_CR,
            },
            'cat_prob': cat_prob,
            'sd': 0.9 + random.uniform(-0.15, 0.2),
        })

    return personas


# ================================================================
# GENERATE RESPONSES FROM PERSONA
# ================================================================

def generate_likert_responses(persona):
    """Produce list of {section, item_code, value} dicts."""
    a = persona['anchors']
    sd = persona['sd']
    rows = []

    # Section A (all 15 items same for all stakeholders)
    for code in SECTION_A_ITEMS:
        rows.append({'section': 'A', 'item_code': code, 'value': likert(a['A'], sd)})

    # Section B (student has fewer GB items)
    if persona['type'] == 'student':
        b_items = SECTION_B_ITEMS_STUDENT
    elif persona['type'] == 'practitioner':
        b_items = SECTION_B_ITEMS_PRACTITIONER
    else:
        b_items = SECTION_B_ITEMS
    for code in b_items:
        rows.append({'section': 'B', 'item_code': code, 'value': likert(a['B'], sd)})

    # Section C — AR and CR have different anchors
    if persona['type'] == 'student':
        c_items = SECTION_C_ITEMS_STUDENT
    elif persona['type'] == 'practitioner':
        c_items = SECTION_C_ITEMS_PRACTITIONER
    else:
        c_items = SECTION_C_ITEMS_FACULTY

    for code in c_items:
        anchor = a['C_AR'] if code.startswith('AR') else a['C_CR']
        rows.append({'section': 'C', 'item_code': code, 'value': likert(anchor, sd)})

    return rows


def generate_tool_responses(persona):
    """Produce list of {category, uses_category, selected_tools, other_tool} dicts."""
    stype = persona['type']
    cat_prob = persona['cat_prob']
    rows = []

    for cat_id in CATEGORIES:
        prob = min(0.95, max(0.02, cat_prob.get(cat_id, 0.1)))
        uses = random.random() < prob

        selected = []
        if uses:
            tools_list = TOOLS[stype][cat_id]
            # Select 1-4 tools, weighted toward fewer
            n_tools = min(len(tools_list), max(1, int(random.gauss(2.5, 1.2))))
            selected = random.sample(tools_list, min(n_tools, len(tools_list)))

        rows.append({
            'category': cat_id,
            'uses_category': uses,
            'selected_tools': selected,
            'other_tool': None,
        })

    return rows


# ================================================================
# SUPABASE REST API SUBMISSION
# ================================================================

def supabase_insert(table, rows):
    """Insert rows into a Supabase table via REST API."""
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    data = json.dumps(rows).encode('utf-8')
    req = Request(url, data=data, method='POST')
    req.add_header('apikey', ANON_KEY)
    req.add_header('Authorization', f'Bearer {ANON_KEY}')
    req.add_header('Content-Type', 'application/json')
    req.add_header('Prefer', 'return=minimal')

    try:
        resp = urlopen(req)
        return resp.status
    except HTTPError as e:
        body = e.read().decode('utf-8')
        print(f"  ERROR inserting into {table}: {e.code} — {body}", file=sys.stderr)
        raise


def submit_persona(persona, index):
    """Submit a single persona's complete survey response."""
    respondent_id = str(uuid.uuid4())
    stype = persona['type']

    access_codes = {
        'faculty': 'FACULTY7389',
        'student': 'STUDENT2025',
        'practitioner': 'PRACTITIONER1023',
    }

    # Build respondent record
    respondent = {
        'id': respondent_id,
        'stakeholder_type': stype,
        'access_code': access_codes[stype],
    }
    respondent.update(persona['demographics'])

    # Insert respondent
    supabase_insert('respondents', [respondent])

    # Generate and insert tool responses (section_a_responses table)
    tool_rows = generate_tool_responses(persona)
    sa_rows = []
    for tr in tool_rows:
        sa_rows.append({
            'respondent_id': respondent_id,
            'category': tr['category'],
            'uses_category': tr['uses_category'],
            'selected_tools': json.dumps(tr['selected_tools']),
            'other_tool': tr['other_tool'],
        })
    supabase_insert('section_a_responses', sa_rows)

    # Generate and insert Likert responses
    likert_rows = generate_likert_responses(persona)
    lr_rows = []
    for lr in likert_rows:
        lr_rows.append({
            'respondent_id': respondent_id,
            'section': lr['section'],
            'item_code': lr['item_code'],
            'value': lr['value'],
        })
    supabase_insert('likert_responses', lr_rows)

    # Brief description for logging
    demo = persona['demographics']
    if stype == 'student':
        desc = f"{demo.get('year_in_program','?')} {demo.get('major_program','?')}, {demo.get('prior_ai_experience','?')} AI exp"
    elif stype == 'faculty':
        desc = f"{demo.get('years_in_academia','?')}yr {demo.get('primary_role','?')}, {demo.get('engineering_discipline','?')}"
    else:
        desc = f"{demo.get('practitioner_role','?')} @ {demo.get('industry_sector','?')}, {demo.get('years_professional_experience','?')}yr"

    print(f"  [{index+1:3d}] {stype:13s} | {desc}")


# ================================================================
# MAIN
# ================================================================

if __name__ == '__main__':
    random.seed(42)  # Reproducible results

    print("=" * 70)
    print("AI-Eng-TAM Survey Simulation")
    print("=" * 70)

    # Build all personas
    print("\nBuilding 40 student personas...")
    students = build_students()
    print("Building 30 faculty personas...")
    faculty = build_faculty()
    print("Building 30 practitioner personas...")
    practitioners = build_practitioners()

    all_personas = students + faculty + practitioners
    random.shuffle(all_personas)  # Mix submission order

    print(f"\nSubmitting {len(all_personas)} responses to Supabase...\n")

    success = 0
    errors = 0
    t0 = time.time()

    for i, persona in enumerate(all_personas):
        try:
            submit_persona(persona, i)
            success += 1
        except Exception as e:
            errors += 1
            print(f"  FAILED [{i+1}]: {e}", file=sys.stderr)

        # Small delay to avoid rate limiting
        if (i + 1) % 10 == 0:
            time.sleep(0.5)

    elapsed = time.time() - t0

    print(f"\n{'=' * 70}")
    print(f"COMPLETE: {success} submitted, {errors} errors, {elapsed:.1f}s elapsed")
    print(f"{'=' * 70}")
    print(f"\nView results at: https://ai-eng-tam-survey.vercel.app/admin")
    print(f"Admin password: admin2025")
