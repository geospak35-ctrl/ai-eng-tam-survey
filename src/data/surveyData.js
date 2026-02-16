// ============================================================
// AI-Eng-TAM Survey Data Definitions
// Complete item codes, text, and Section D tool categories
// for all three stakeholder types.
// ============================================================

export const LIKERT_LABELS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Slightly Disagree' },
  { value: 4, label: 'Neutral' },
  { value: 5, label: 'Slightly Agree' },
  { value: 6, label: 'Agree' },
  { value: 7, label: 'Strongly Agree' },
];

// ============================================================
// Section D: AI Tool Categories & Tools per Stakeholder
// ============================================================

const SECTION_D_COMMON_CATEGORIES = [
  {
    id: 'ML',
    name: 'Machine Learning (ML)',
    definition: 'AI systems that learn patterns from data to make predictions or classifications.',
  },
  {
    id: 'DL',
    name: 'Deep Learning (DL)',
    definition: 'A subset of machine learning using multi-layer neural networks to model complex relationships.',
  },
  {
    id: 'NLP',
    name: 'Natural Language Processing (NLP)',
    definition: 'AI systems that analyze, understand, or generate human language.',
  },
  {
    id: 'CV',
    name: 'Computer Vision (CV)',
    definition: 'AI systems that interpret and analyze visual information from images or video.',
  },
  {
    id: 'GenAI',
    name: 'Generative AI Models',
    definition: 'AI systems that generate new content such as text, code, images, audio, or video.',
  },
  {
    id: 'Recommender',
    name: 'Recommender and Decision Support Systems',
    definition: 'AI systems that suggest options or support decisions based on data analysis.',
  },
  {
    id: 'EngDesign',
    name: 'Engineering Design, Simulation, and Digital Twins (AI-enabled)',
    definition: 'AI embedded in CAD/CAE, digital twins, and simulation workflows.',
  },
  {
    id: 'Robotics',
    name: 'Robotics and Autonomous Systems',
    definition: 'AI integrated with physical systems to perceive, plan, and act in the real world.',
  },
  {
    id: 'Expert',
    name: 'Expert / Rule-Based Systems',
    definition: 'AI systems that apply predefined rules or logic rather than learning from data.',
  },
];

// Tools differ slightly per stakeholder
const TOOLS_BY_CATEGORY = {
  faculty: {
    ML: ['Scikit-learn', 'TensorFlow / PyTorch', 'MATLAB Machine Learning Toolbox', 'R (caret / tidymodels)', 'Google Colab / Jupyter (for ML)', 'Azure Machine Learning', 'Orange Data Mining'],
    DL: ['TensorFlow / Keras', 'PyTorch', 'ONNX', 'MATLAB Deep Learning Toolbox'],
    NLP: ['ChatGPT', 'Claude', 'Google Gemini', 'Google Vertex AI (LLMs)', 'Azure OpenAI Service', 'spaCy / NLTK', 'BERT-based tools', 'Grammarly'],
    CV: ['OpenCV', 'YOLO', 'TensorFlow Vision Models', 'MATLAB Computer Vision Toolbox', 'ImageJ / Fiji'],
    GenAI: ['ChatGPT', 'Claude', 'Google Gemini', 'GitHub Copilot', 'DALL\u00B7E / Stable Diffusion / Midjourney'],
    Recommender: ['IBM Watson', 'Azure AI Services', 'Google Recommendation AI', 'Learning analytics platforms (e.g., LMS-embedded)', 'Adaptive learning systems'],
    EngDesign: ['ANSYS (AI/ML features)', 'Autodesk Fusion (AI features)', 'Siemens NX (AI features)', 'MATLAB/Simulink AI tools', 'Digital twin platforms'],
    Robotics: ['ROS / ROS2', 'Gazebo', 'NVIDIA Isaac', 'TurtleBot', 'PX4 Autopilot', 'Educational platforms (e.g., LEGO, VEX, Arduino AI kits)'],
    Expert: ['Drools', 'CLIPS', 'Prolog-based systems', 'Rules engines used in coursework'],
  },
  student: {
    ML: ['Scikit-learn', 'TensorFlow / PyTorch', 'MATLAB Machine Learning Toolbox', 'Google Colab / Jupyter (for ML)', 'Orange Data Mining', 'Weka / RapidMiner'],
    DL: ['TensorFlow / Keras', 'PyTorch', 'MATLAB Deep Learning Toolbox', 'Google Colab / Jupyter (for DL)'],
    NLP: ['ChatGPT', 'Claude', 'Google Gemini', 'Google Vertex AI (LLMs)', 'Grammarly', 'spaCy / NLTK', 'BERT-based tools'],
    CV: ['OpenCV', 'YOLO', 'TensorFlow Vision Models', 'MATLAB Computer Vision Toolbox', 'ImageJ / Fiji'],
    GenAI: ['ChatGPT', 'Claude', 'Google Gemini', 'GitHub Copilot', 'DALL\u00B7E / Stable Diffusion / Midjourney'],
    Recommender: ['IBM Watson', 'Azure AI Services', 'Google Recommendation AI'],
    EngDesign: ['ANSYS (AI/ML features)', 'Autodesk Fusion (AI features)', 'Siemens NX (AI features)', 'MATLAB/Simulink AI tools', 'Digital twin platforms'],
    Robotics: ['ROS / ROS2', 'Gazebo', 'NVIDIA Isaac', 'TurtleBot', 'PX4 Autopilot', 'Educational platforms (e.g., LEGO, VEX, Arduino AI kits)'],
    Expert: ['CLIPS', 'Prolog-based systems', 'Rules engines used in coursework'],
  },
  practitioner: {
    ML: ['Scikit-learn', 'TensorFlow / PyTorch', 'MATLAB Machine Learning Toolbox', 'SAS', 'Azure Machine Learning', 'DataRobot / H2O.ai'],
    DL: ['TensorFlow / Keras', 'PyTorch', 'ONNX', 'MATLAB Deep Learning Toolbox'],
    NLP: ['ChatGPT (Enterprise)', 'Claude (Enterprise)', 'Google Gemini (Enterprise)', 'Azure OpenAI Service', 'Amazon Bedrock', 'Google Vertex AI (LLMs)', 'spaCy', 'BERT-based systems'],
    CV: ['OpenCV', 'YOLO', 'TensorFlow Vision Models', 'MATLAB Computer Vision Toolbox', 'ImageJ / Fiji', 'Cognex Vision', 'NVIDIA Metropolis'],
    GenAI: ['ChatGPT (Enterprise)', 'Claude (Enterprise)', 'Google Gemini (Enterprise)', 'GitHub Copilot (Enterprise)', 'DALL\u00B7E / Stable Diffusion / Midjourney (Enterprise)'],
    Recommender: ['IBM Watson', 'Azure AI Services', 'Salesforce Einstein', 'SAP AI', 'ServiceNow AI'],
    EngDesign: ['ANSYS (AI/ML features)', 'Autodesk Fusion (AI features)', 'Siemens NX / Teamcenter (AI features)', 'Dassault Syst\u00E8mes (AI features)', 'MATLAB/Simulink AI tools', 'Digital twin platforms (e.g., Azure Digital Twins)'],
    Robotics: ['ROS / ROS2', 'Gazebo', 'NVIDIA Isaac', 'PX4 Autopilot', 'Industrial robot AI controllers', 'Autonomous inspection platforms'],
    Expert: ['Drools', 'CLIPS', 'Prolog-based systems', 'Rules engines embedded in PLM/ERP'],
  },
};

// Section D question phrasing per stakeholder
const SECTION_D_QUESTION = {
  faculty: 'Have you used or incorporated tools in this category?',
  student: 'Have you used tools in this category in your engineering learning activities?',
  practitioner: 'Are new graduates or early-career engineers expected to use tools in this category?',
};

// Section D instruction text per stakeholder (displayed under heading)
const SECTION_D_INSTRUCTION = {
  faculty: 'For each AI category below, indicate whether you have used or incorporated tools in this category in your teaching, research, or assessment activities. If yes, select which tools apply.',
  student: 'For each AI category below, indicate whether you have used tools in this category in your engineering coursework, labs, or projects. If yes, select which tools apply.',
  practitioner: 'For each AI category below, indicate whether new graduates or early-career engineers are expected to use tools in this category in your professional context. If yes, select commonly expected tools.',
};

export function getSectionDData(stakeholderType) {
  return {
    question: SECTION_D_QUESTION[stakeholderType],
    instruction: SECTION_D_INSTRUCTION[stakeholderType],
    categories: SECTION_D_COMMON_CATEGORIES.map((cat) => ({
      ...cat,
      tools: TOOLS_BY_CATEGORY[stakeholderType][cat.id],
    })),
  };
}

// Keep backward-compatible alias
export const getSectionAData = getSectionDData;

// ============================================================
// Sections A, B, C: Likert Items per Stakeholder
// (formerly B, C, D — renumbered after moving tool usage to Section D)
// ============================================================

const FACULTY_LIKERT = {
  A: {
    title: 'Section A: Perceived Value and Usability of AI for Teaching and Learning',
    instruction: 'Please indicate your level of agreement with each statement using the scale below.',
    constructs: [
      {
        id: 'PU-L',
        name: 'A1. Perceived Usefulness\u2014Learning (PU-L)',
        items: [
          { code: 'PU-L1', text: 'Using AI tools in my courses can improve students\u2019 conceptual understanding of engineering topics when appropriately designed.' },
          { code: 'PU-L2', text: 'AI tools enable learning activities that would be difficult or impractical to implement without AI (e.g., rapid iteration, simulation, critique).' },
          { code: 'PU-L3', text: 'AI tools can support deeper learning when used to prompt explanation, justification, or reflection rather than to provide final answers.' },
          { code: 'PU-L4', text: 'AI tool use in my courses can help students engage with authentic engineering practices (e.g., modeling, design tradeoffs, testing assumptions).' },
        ],
      },
      {
        id: 'PU-E',
        name: 'A2. Perceived Usefulness\u2014Faculty Efficiency (PU-E)',
        items: [
          { code: 'PU-E1', text: 'AI tools improve my efficiency in preparing instructional materials, assessments, or feedback.' },
          { code: 'PU-E2', text: 'AI tools help me redesign courses or assignments in ways that better align with learning goals.' },
        ],
      },
      {
        id: 'PEU',
        name: 'A3. Perceived Ease of Pedagogical Integration (PEU)',
        items: [
          { code: 'PEU1', text: 'I find it manageable to design assignments where AI tool use is scaffolded rather than unrestricted.' },
          { code: 'PEU2', text: 'I can clearly explain to students when, how, and why AI tools may be used in my course.' },
          { code: 'PEU3', text: 'Designing AI-mediated learning activities does not require excessive additional time or effort.' },
        ],
      },
      {
        id: 'EJ',
        name: 'A4. Epistemic Trust and Judgment (EJ)',
        items: [
          { code: 'EJ1', text: 'I am confident in recognizing when AI outputs conflict with fundamental engineering principles.' },
          { code: 'EJ2', text: 'I design learning activities so that AI outputs must be evaluated, tested, or defended, not accepted at face value.' },
          { code: 'EJ3', text: 'I am cautious about relying on AI outputs unless they are validated through disciplinary methods.' },
        ],
      },
      {
        id: 'BI',
        name: 'A5. Behavioral Intention for Instructional Use (BI)',
        items: [
          { code: 'BI1', text: 'I intend to integrate AI tools into my courses in ways that directly support student learning, not just task completion.' },
          { code: 'BI2', text: 'I expect my use of AI-mediated learning activities to increase over time.' },
          { code: 'BI3', text: 'I would recommend AI tool integration to colleagues when paired with appropriate instructional guardrails.' },
        ],
      },
    ],
  },
  B: {
    title: 'Section B: Instructional Design, Guardrails, and Student Ownership in AI-Mediated Learning',
    instruction: 'Please indicate your level of agreement with each statement using the scale below.',
    constructs: [
      {
        id: 'MU',
        name: 'B1. Modes of AI Use in Teaching (MU)',
        items: [
          { code: 'MU1', text: 'I use AI tools as a learning tutor or coach (e.g., prompting explanation, asking follow-up questions) rather than as an answer provider.' },
          { code: 'MU2', text: 'I use AI tools to support design exploration or \u201cwhat-if\u201d analysis, not just solution generation.' },
          { code: 'MU3', text: 'I use AI tools to help students critique, compare, or improve their own work.' },
          { code: 'MU4', text: 'I avoid designing assignments where AI tools can complete the task without meaningful student reasoning.' },
        ],
      },
      {
        id: 'LP',
        name: 'B2. Placement of AI in the Learning Process (LP)',
        items: [
          { code: 'LP1', text: 'I require students to attempt problem solving or design before using AI tools.' },
          { code: 'LP2', text: 'I design activities where AI tools are used after initial work to refine, test, or challenge student ideas.' },
          { code: 'LP3', text: 'I intentionally decide when AI tool use is not appropriate in the learning process.' },
        ],
      },
      {
        id: 'GB',
        name: 'B3. Guardrails and Constraints (GB)',
        items: [
          { code: 'GB1', text: 'I explicitly define what types of AI use are allowed, limited, or prohibited for each assignment.' },
          { code: 'GB2', text: 'I design assignments so that AI tools cannot replace core cognitive work (e.g., reasoning, modeling, justification).' },
          { code: 'GB3', text: 'I include process requirements (e.g., drafts, reasoning steps, reflections) that make student thinking visible even when AI tools are used.' },
          { code: 'GB4', text: 'I assess student learning in ways that discourage over-reliance on AI-generated outputs.' },
        ],
      },
      {
        id: 'OA',
        name: 'B4. Student Ownership and Accountability (OA)',
        items: [
          { code: 'OA1', text: 'I require students to explain their own contribution versus AI assistance in submitted work.' },
          { code: 'OA2', text: 'I require students to defend or justify AI-assisted decisions using engineering principles.' },
          { code: 'OA3', text: 'Students in my courses remain clearly accountable for the quality and correctness of AI-assisted work.' },
          { code: 'OA4', text: 'I use AI disclosure as a learning artifact (reflection, explanation), not just a compliance statement.' },
        ],
      },
      {
        id: 'EV',
        name: 'B5. Evaluation and Verification (EV)',
        items: [
          { code: 'EV1', text: 'I require testing, validation, or verification of AI-assisted code, models, or analyses.' },
          { code: 'EV2', text: 'I model how engineers should question, test, and refine AI outputs.' },
          { code: 'EV3', text: 'I design assessments that reward sound reasoning and validation, not just correct final answers.' },
        ],
      },
      {
        id: 'ET',
        name: 'B6. Ethics and Responsible Use (ET)',
        items: [
          { code: 'ET1', text: 'I address potential bias, limitations, or uncertainty in AI outputs relevant to engineering contexts.' },
          { code: 'ET2', text: 'I clearly communicate what data or information should not be entered into AI tools.' },
          { code: 'ET3', text: 'I clarify expectations for transparent disclosure of AI use in academic work.' },
          { code: 'ET4', text: 'I discuss ethical implications of AI-assisted engineering decisions, not just tool usage.' },
        ],
      },
    ],
  },
  C: {
    title: 'Section C: AI Readiness for Educating AI-Ready Engineers (AR / CR)',
    instruction: 'Please indicate your level of agreement with each statement using the scale below.',
    constructs: [
      {
        id: 'AR',
        name: 'C1. Faculty AI Readiness (AR)',
        items: [
          { code: 'AR1', text: 'I feel prepared to integrate AI tools appropriately in my teaching, research, or assessment activities.' },
          { code: 'AR2', text: 'I feel confident determining when AI tools are appropriate versus when traditional approaches are preferable.' },
          { code: 'AR3', text: 'I feel prepared to verify and validate AI-assisted outputs using engineering or disciplinary standards.' },
          { code: 'AR4', text: 'I feel prepared to integrate AI tools in ways that align with academic integrity, professional ethics, and institutional policy.' },
          { code: 'AR5', text: 'I feel prepared to explain and justify AI-assisted work to students, peers, or reviewers.' },
          { code: 'AR6', text: 'If required today, I feel prepared to guide students in responsible AI use for engineering contexts.' },
          { code: 'AR7', text: 'I know what professional development I need to improve my readiness to work with AI tools.' },
          { code: 'AR8', text: 'I feel clear about institutional expectations and policies governing AI use.' },
        ],
      },
      {
        id: 'CR',
        name: 'C2. Preparing Career-Ready Engineers (CR)',
        items: [
          { code: 'CR1', text: 'I design AI-related activities that connect to how AI is used in professional engineering practice.' },
          { code: 'CR2', text: 'I help students develop portable AI competencies that will remain relevant as specific tools change.' },
          { code: 'CR3', text: 'I prepare students to articulate and present their AI-assisted work to potential employers or supervisors.' },
          { code: 'CR4', text: 'I am aware of what industry expects regarding AI competency in new engineering graduates.' },
          { code: 'CR5', text: 'I help students develop evidence of AI-augmented engineering skills (e.g., project artifacts, portfolios, documented processes).' },
        ],
      },
    ],
  },
};

const STUDENT_LIKERT = {
  A: {
    title: 'Section A: Perceived Value and Use of AI for Learning and Engineering Practice',
    instruction: 'Please indicate your level of agreement with each statement using the scale below.',
    constructs: [
      {
        id: 'PU-L',
        name: 'A1. Perceived Usefulness\u2014Learning (PU-L)',
        items: [
          { code: 'PU-L1', text: 'When used appropriately, AI tools help me understand engineering concepts more deeply, not just complete assignments.' },
          { code: 'PU-L2', text: 'AI tools enable learning activities (e.g., rapid iteration, design exploration, critique) that would be difficult to do otherwise.' },
          { code: 'PU-L3', text: 'AI tools help me explore multiple solution paths or design alternatives rather than converging too quickly on one answer.' },
          { code: 'PU-L4', text: 'Using AI tools has helped me engage more realistically with how engineers work in practice.' },
        ],
      },
      {
        id: 'PU-E',
        name: 'A2. Perceived Usefulness\u2014Efficiency (PU-E)',
        items: [
          { code: 'PU-E1', text: 'AI tools help me work more efficiently on engineering tasks.' },
          { code: 'PU-E2', text: 'AI tools save time that I can reinvest in understanding, testing, or improving my work.' },
        ],
      },
      {
        id: 'PEU',
        name: 'A3. Perceived Ease of Responsible Use (PEU)',
        items: [
          { code: 'PEU1', text: 'I understand how to use AI tools in ways that support my learning rather than replace it.' },
          { code: 'PEU2', text: 'I find it manageable to follow course rules or expectations about AI use.' },
          { code: 'PEU3', text: 'I can explain why I used AI tools in an assignment, not just that I used them.' },
        ],
      },
      {
        id: 'EJ',
        name: 'A4. Epistemic Judgment (EJ)',
        items: [
          { code: 'EJ1', text: 'I can recognize when AI outputs conflict with engineering principles (e.g., units, assumptions, constraints).' },
          { code: 'EJ2', text: 'I do not rely on AI outputs without checking, testing, or justifying them.' },
          { code: 'EJ3', text: 'I treat AI outputs as suggestions to evaluate, not answers to accept.' },
        ],
      },
      {
        id: 'BI',
        name: 'A5. Behavioral Intention (BI)',
        items: [
          { code: 'BI1', text: 'I intend to use AI tools in ways that improve my learning and engineering judgment, not just my grades.' },
          { code: 'BI2', text: 'I expect my use of AI tools in engineering learning to increase as I learn how to use them responsibly.' },
          { code: 'BI3', text: 'I would recommend AI tool use to other students when paired with clear learning expectations and guardrails.' },
        ],
      },
    ],
  },
  B: {
    title: 'Section B: AI Use Practices, Guardrails, and Ownership in Engineering Learning',
    instruction: 'Please indicate your level of agreement with each statement using the scale below.',
    constructs: [
      {
        id: 'MU',
        name: 'B1. Modes of AI Use (MU)',
        items: [
          { code: 'MU1', text: 'I use AI tools as a tutor or coach to help me think through problems.' },
          { code: 'MU2', text: 'I use AI tools to explore \u201cwhat-if\u201d scenarios or alternative designs.' },
          { code: 'MU3', text: 'I use AI tools to critique, compare, or improve my own work.' },
          { code: 'MU4', text: 'I avoid using AI tools in ways that would complete an assignment without my own reasoning.' },
        ],
      },
      {
        id: 'LP',
        name: 'B2. Timing in the Learning Process (LP)',
        items: [
          { code: 'LP1', text: 'I usually attempt a problem or design before using AI tools.' },
          { code: 'LP2', text: 'I use AI tools after initial work to refine, test, or challenge my ideas.' },
          { code: 'LP3', text: 'I know when AI tool use is not appropriate for my learning.' },
        ],
      },
      {
        id: 'GB',
        name: 'B3. Guardrails and Boundaries (GB)',
        items: [
          { code: 'GB1', text: 'I set personal boundaries for AI tool use to ensure I am still learning key concepts.' },
          { code: 'GB2', text: 'I follow course-specific expectations about AI use for each assignment.' },
          { code: 'GB3', text: 'I keep track of how AI influenced my thinking or decisions.' },
        ],
      },
      {
        id: 'OA',
        name: 'B4. Ownership and Accountability (OA)',
        items: [
          { code: 'OA1', text: 'I can clearly explain what I contributed versus what AI contributed to my work.' },
          { code: 'OA2', text: 'I can defend AI-assisted decisions using engineering reasoning, not just AI explanations.' },
          { code: 'OA3', text: 'I take full responsibility for the correctness and quality of AI-assisted work I submit.' },
          { code: 'OA4', text: 'Disclosing AI use helps me reflect on my learning, not just meet a requirement.' },
        ],
      },
      {
        id: 'EV',
        name: 'B5. Evaluation and Verification (EV)',
        items: [
          { code: 'EV1', text: 'I test or verify AI-assisted code, models, or calculations.' },
          { code: 'EV2', text: 'I check AI outputs against known constraints, assumptions, or physical principles.' },
          { code: 'EV3', text: 'I value assignments that reward reasoning and validation, not just final answers.' },
        ],
      },
      {
        id: 'ET',
        name: 'B6. Ethics and Responsible Use (ET)',
        items: [
          { code: 'ET1', text: 'I understand that AI outputs may reflect bias or limitations.' },
          { code: 'ET2', text: 'I know what information should not be entered into AI tools (e.g., personal, proprietary, or sensitive data).' },
          { code: 'ET3', text: 'I understand when and how to disclose AI use in academic or professional contexts.' },
          { code: 'ET4', text: 'I think about the ethical implications of using AI in engineering decisions.' },
        ],
      },
    ],
  },
  C: {
    title: 'Section C: AI Readiness and Career Preparedness (AR / CR)',
    instruction: 'Please indicate your level of agreement with each statement using the scale below.',
    constructs: [
      {
        id: 'AR',
        name: 'C1. Current Readiness (AR)',
        items: [
          { code: 'AR1', text: 'I feel prepared to use AI tools appropriately in my current engineering coursework or projects.' },
          { code: 'AR2', text: 'I feel confident selecting when AI tools are helpful versus when traditional engineering methods are more appropriate.' },
          { code: 'AR3', text: 'I feel prepared to verify and validate AI-assisted results using engineering principles.' },
          { code: 'AR4', text: 'I feel prepared to use AI tools in ways that align with academic integrity and engineering ethics.' },
        ],
      },
      {
        id: 'CR',
        name: 'C2. Career Readiness and Professional Signaling (CR)',
        items: [
          { code: 'CR1', text: 'AI skills will be important in my future engineering career.' },
          { code: 'CR2', text: 'I am intentionally developing AI-augmented engineering skills, not just tool familiarity.' },
          { code: 'CR3', text: 'I can explain how my AI use adds value to my work in a professional setting.' },
          { code: 'CR4', text: 'I feel prepared to discuss my AI use confidently with employers or internship supervisors.' },
          { code: 'CR5', text: 'I know what skills or knowledge I still need to develop to improve my readiness to work with AI tools.' },
        ],
      },
    ],
  },
};

const PRACTITIONER_LIKERT = {
  A: {
    title: 'Section A: Perceived Value and Usability of AI in Engineering Practice',
    instruction: 'Please indicate your level of agreement with each statement using the scale below.',
    constructs: [
      {
        id: 'PU-L',
        name: 'A1. Perceived Usefulness\u2014Engineering Practice (PU-L)',
        items: [
          { code: 'PU-L1', text: 'AI tools improve the quality of engineering work expected of new graduates or early-career engineers.' },
          { code: 'PU-L2', text: 'AI tools enable engineering activities that would be difficult or impractical without AI (e.g., large-scale data analysis, design optimization, rapid prototyping).' },
          { code: 'PU-L3', text: 'AI tools enhance the ability to address complex, multidisciplinary engineering problems in practice.' },
          { code: 'PU-L4', text: 'AI tools support engineers in making better-informed decisions by surfacing options, tradeoffs, or patterns.' },
        ],
      },
      {
        id: 'PU-E',
        name: 'A2. Perceived Usefulness\u2014Efficiency (PU-E)',
        items: [
          { code: 'PU-E1', text: 'AI tools increase efficiency in professional engineering practice.' },
          { code: 'PU-E2', text: 'Efficiency gains from AI tools allow engineers to spend more time on judgment-intensive tasks such as verification, design review, and client interaction.' },
        ],
      },
      {
        id: 'PEU',
        name: 'A3. Perceived Ease of Organizational Integration (PEU)',
        items: [
          { code: 'PEU1', text: 'AI tools are sufficiently usable for new graduates or early-career engineers to apply effectively in typical workflows.' },
          { code: 'PEU2', text: 'Organizational guidance and policies make it clear how and when AI tools should be used in engineering work.' },
          { code: 'PEU3', text: 'New graduates or early-career engineers can use AI tools effectively without excessive additional training.' },
        ],
      },
      {
        id: 'EJ',
        name: 'A4. Epistemic Judgment (EJ)',
        items: [
          { code: 'EJ1', text: 'New graduates or early-career engineers can recognize when AI outputs conflict with engineering principles or standards.' },
          { code: 'EJ2', text: 'New graduates or early-career engineers know when AI-assisted outputs require verification using engineering methods.' },
          { code: 'EJ3', text: 'New graduates or early-career engineers are appropriately cautious about relying on AI outputs without validation.' },
        ],
      },
      {
        id: 'BI',
        name: 'A5. Behavioral Expectation (BI)',
        items: [
          { code: 'BI1', text: 'AI tool use will be increasingly expected of engineering graduates in professional practice.' },
          { code: 'BI2', text: 'I expect AI tool use to increase across engineering roles in the near future.' },
          { code: 'BI3', text: 'I would recommend that engineering programs prepare students for appropriate and responsible AI tool use.' },
        ],
      },
    ],
  },
  B: {
    title: 'Section B: Workplace AI Practices, Judgment, and Accountability in Engineering',
    instruction: 'Please indicate your level of agreement with each statement using the scale below.',
    constructs: [
      {
        id: 'MU',
        name: 'B1. Modes of AI Use in Practice (MU)',
        items: [
          { code: 'MU1', text: 'Engineering graduates use AI tools to augment their reasoning (e.g., exploring options, testing assumptions) rather than to replace it.' },
          { code: 'MU2', text: 'Engineering graduates use AI tools for design exploration, trade-off analysis, or \u201cwhat-if\u201d evaluation.' },
          { code: 'MU3', text: 'Engineering graduates use AI tools to critique, compare, or refine their own work or the work of their teams.' },
          { code: 'MU4', text: 'Engineering graduates avoid using AI tools in ways that bypass professional engineering judgment.' },
        ],
      },
      {
        id: 'LP',
        name: 'B2. Timing and Workflow Integration (LP)',
        items: [
          { code: 'LP1', text: 'Engineering graduates apply their own analysis or reasoning before incorporating AI-generated outputs.' },
          { code: 'LP2', text: 'Engineering graduates use AI tools after initial engineering analysis to refine, test, or challenge their conclusions.' },
          { code: 'LP3', text: 'Engineering graduates recognize when AI tools are not appropriate for specific engineering tasks.' },
        ],
      },
      {
        id: 'GB',
        name: 'B3. Organizational Guardrails and Governance (GB)',
        items: [
          { code: 'GB1', text: 'My organization has clear policies defining appropriate and inappropriate uses of AI tools in engineering work.' },
          { code: 'GB2', text: 'Engineering workflows in my organization include checks that prevent AI tools from replacing critical engineering judgment.' },
          { code: 'GB3', text: 'Documentation and audit trail requirements exist for AI-assisted engineering decisions.' },
        ],
      },
      {
        id: 'OA',
        name: 'B4. Professional Ownership and Accountability (OA)',
        items: [
          { code: 'OA1', text: 'Engineering graduates can clearly explain their own contribution versus AI assistance in their work.' },
          { code: 'OA2', text: 'Engineering graduates can defend AI-assisted decisions to colleagues, clients, or regulators using engineering principles.' },
          { code: 'OA3', text: 'Engineering graduates take full professional responsibility for the correctness and quality of AI-assisted work.' },
          { code: 'OA4', text: 'Engineering graduates understand when and how to disclose AI use in professional deliverables.' },
        ],
      },
      {
        id: 'EV',
        name: 'B5. Evaluation and Verification (EV)',
        items: [
          { code: 'EV1', text: 'Engineering graduates test and verify AI-assisted code, models, or analyses using appropriate engineering methods.' },
          { code: 'EV2', text: 'Engineering graduates check AI outputs against known constraints, standards, or physical principles.' },
          { code: 'EV3', text: 'My organization values engineers who demonstrate sound reasoning and verification, not just rapid output.' },
        ],
      },
      {
        id: 'ET',
        name: 'B6. Ethics and Responsible Use (ET)',
        items: [
          { code: 'ET1', text: 'Engineering graduates are aware that AI outputs may reflect bias from training data or design choices.' },
          { code: 'ET2', text: 'Engineering graduates understand what information (e.g., proprietary, sensitive, or regulated data) should not be entered into AI tools.' },
          { code: 'ET3', text: 'Engineering graduates understand when and how to disclose AI use in professional engineering contexts.' },
          { code: 'ET4', text: 'Engineering graduates consider the ethical implications of AI-assisted engineering decisions.' },
        ],
      },
    ],
  },
  C: {
    title: 'Section C: AI Readiness for AI-Integrated Engineering Practice (AR / CR)',
    instruction: 'Please indicate your level of agreement with each statement using the scale below.',
    constructs: [
      {
        id: 'AR',
        name: 'C1. Graduate AI Readiness (AR)',
        items: [
          { code: 'AR1', text: 'Engineering graduates are prepared to use AI tools appropriately in entry-level engineering roles.' },
          { code: 'AR2', text: 'Engineering graduates can determine when AI tools add value versus when traditional engineering approaches are more appropriate.' },
          { code: 'AR3', text: 'Engineering graduates are prepared to verify and validate AI-assisted outputs using engineering standards and practices.' },
          { code: 'AR4', text: 'Engineering graduates are prepared to use AI tools in ways that align with professional ethics, regulations, and organizational policy.' },
          { code: 'AR5', text: 'Engineering graduates are prepared to explain and justify AI-assisted decisions or outputs to colleagues, clients, or regulators.' },
          { code: 'AR6', text: 'If required today, engineering graduates are ready to deploy AI tools responsibly in professional engineering settings.' },
          { code: 'AR7', text: 'Engineering graduates know what skills or training they need to improve their readiness to work with AI tools.' },
          { code: 'AR8', text: 'Engineering graduates understand organizational expectations or governance related to AI use.' },
        ],
      },
      {
        id: 'CR',
        name: 'C2. Graduate Workforce Preparedness (CR)',
        items: [
          { code: 'CR1', text: 'Engineering graduates can demonstrate AI competency during the hiring process (e.g., interviews, work samples, portfolios).' },
          { code: 'CR2', text: 'Engineering graduates possess AI skills that are transferable across tools and platforms, not limited to specific software.' },
          { code: 'CR3', text: 'Engineering graduates can articulate how their AI use adds value in a professional context.' },
          { code: 'CR4', text: 'My organization considers AI competency when evaluating new engineering graduates for hiring or advancement.' },
          { code: 'CR5', text: 'Engineering graduates are prepared to adapt to new AI tools and workflows as they emerge in practice.' },
        ],
      },
    ],
  },
};

const LIKERT_DATA = {
  faculty: FACULTY_LIKERT,
  student: STUDENT_LIKERT,
  practitioner: PRACTITIONER_LIKERT,
};

export function getLikertSections(stakeholderType) {
  return LIKERT_DATA[stakeholderType];
}

// Get all item codes for a stakeholder (useful for validation)
export function getAllItemCodes(stakeholderType) {
  const sections = LIKERT_DATA[stakeholderType];
  const codes = [];
  for (const sectionKey of ['A', 'B', 'C']) {
    for (const construct of sections[sectionKey].constructs) {
      for (const item of construct.items) {
        codes.push(item.code);
      }
    }
  }
  return codes;
}

// Demographics fields per stakeholder
export const DEMOGRAPHICS = {
  faculty: {
    title: 'Optional Demographics',
    fields: [
      { id: 'engineering_discipline', label: 'Engineering discipline(s)', type: 'text' },
      { id: 'years_in_academia', label: 'Years in academia', type: 'select', options: ['0\u20135', '6\u201310', '11\u201320', '21+'] },
      { id: 'primary_role', label: 'Primary role', type: 'select', options: ['Teaching', 'Research', 'Administration', 'Combination'] },
      { id: 'institution_type', label: 'Institution type', type: 'select-other', options: ['R1', 'R2', 'Teaching-focused'], otherField: 'institution_type_other' },
      { id: 'prior_ai_experience', label: 'Prior experience with AI tools', type: 'select', options: ['None', 'Limited', 'Moderate', 'Extensive'] },
      { id: 'primary_ai_context', label: 'Primary context of AI use', type: 'select', options: ['Teaching', 'Research', 'Assessment', 'Administration', 'Personal productivity'] },
    ],
  },
  student: {
    title: 'Optional Demographics',
    fields: [
      { id: 'major_program', label: 'Major / Program', type: 'text' },
      { id: 'year_in_program', label: 'Year in program', type: 'select', options: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'] },
      { id: 'prior_ai_experience', label: 'Prior experience with AI tools', type: 'select', options: ['None', 'Limited', 'Moderate', 'Extensive'] },
      { id: 'primary_ai_context', label: 'Primary context of AI use', type: 'select', options: ['Coursework', 'Labs', 'Projects', 'Internships', 'Personal learning'] },
    ],
  },
  practitioner: {
    title: 'Optional Demographics',
    fields: [
      { id: 'engineering_discipline', label: 'Engineering discipline(s)', type: 'text' },
      { id: 'years_professional_experience', label: 'Years of professional experience', type: 'select', options: ['0\u20135', '6\u201310', '11\u201320', '21+'] },
      { id: 'practitioner_role', label: 'Primary role', type: 'select-other', options: ['Engineer', 'Manager', 'Technical Lead', 'Hiring Manager'], otherField: 'practitioner_role_other' },
      { id: 'industry_sector', label: 'Industry sector', type: 'text' },
      { id: 'organization_size', label: 'Organization size (optional)', type: 'select', options: ['<100', '100\u2013999', '1,000\u20139,999', '10,000+'] },
      { id: 'prior_ai_experience', label: 'Prior experience with AI tools', type: 'select', options: ['None', 'Limited', 'Moderate', 'Extensive'] },
      { id: 'primary_ai_context', label: 'Primary context of AI use', type: 'select', options: ['Engineering design', 'Analysis/simulation', 'Project management', 'Decision support'] },
    ],
  },
};

// Construct mapping for analysis (construct id -> display name)
export const CONSTRUCT_NAMES = {
  'PU-L': 'Perceived Usefulness\u2014Learning',
  'PU-E': 'Perceived Usefulness\u2014Efficiency',
  'PEU': 'Perceived Ease of Use/Integration',
  'EJ': 'Epistemic Judgment',
  'BI': 'Behavioral Intention',
  'MU': 'Modes of AI Use',
  'LP': 'Learning/Workflow Placement',
  'GB': 'Guardrails & Boundaries',
  'OA': 'Ownership & Accountability',
  'EV': 'Evaluation & Verification',
  'ET': 'Ethics & Responsible Use',
  'AR': 'AI Readiness',
  'CR': 'Career/Workforce Readiness',
};

// Access codes for each stakeholder group (configurable)
export const ACCESS_CODES = {
  faculty: 'FACULTY2025',
  student: 'STUDENT2025',
  practitioner: 'PRACTITIONER2025',
};
