import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getSectionDData, getLikertSections, DEMOGRAPHICS } from '../data/surveyData';
import { submitSurvey } from '../lib/supabase';
import ProgressBar from '../components/ProgressBar';
import LikertSection from '../components/LikertSection';
import SectionD from '../components/SectionD';
import DemographicsForm from '../components/DemographicsForm';

const TITLES = {
  faculty: 'Faculty Survey',
  student: 'Student Survey',
  practitioner: 'Practitioner / Hiring Manager Survey',
};

const TOTAL_STEPS = 5; // A, B, C, D, Demographics

export default function SurveyPage() {
  const { stakeholderType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const accessCode = location.state?.accessCode || '';
  const repeatFlag = location.state?.repeatFlag || false;

  // Redirect if no valid stakeholder type
  useEffect(() => {
    if (!['faculty', 'student', 'practitioner'].includes(stakeholderType)) {
      navigate('/');
    }
  }, [stakeholderType, navigate]);

  const [step, setStep] = useState(0); // 0=A, 1=B, 2=C, 3=D, 4=Demo
  const [likertResponses, setLikertResponses] = useState({});
  const [sectionDResponses, setSectionDResponses] = useState({});
  const [demographics, setDemographics] = useState({});
  const [demoValidationErrors, setDemoValidationErrors] = useState({});
  const [validationError, setValidationError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const likertSections = getLikertSections(stakeholderType);
  const sectionDData = getSectionDData(stakeholderType);

  const handleLikertResponse = (itemCode, value) => {
    setLikertResponses((prev) => ({ ...prev, [itemCode]: value }));
    setValidationError('');
  };

  const handleSectionDUpdate = (categoryId, data) => {
    setSectionDResponses((prev) => ({ ...prev, [categoryId]: data }));
    setValidationError('');
  };

  // Validate that all Likert items in the current section are answered
  const validateLikertSection = (sectionKey) => {
    const section = likertSections[sectionKey];
    const unanswered = [];
    for (const construct of section.constructs) {
      for (const item of construct.items) {
        if (!likertResponses[item.code]) {
          unanswered.push(item.code);
        }
      }
    }
    return unanswered;
  };

  // Validate Section D: all categories must have yes/no answered
  const validateSectionD = () => {
    const unanswered = [];
    for (const cat of sectionDData.categories) {
      const resp = sectionDResponses[cat.id];
      if (!resp || resp.uses === null || resp.uses === undefined) {
        unanswered.push(cat.name);
      }
    }
    return unanswered;
  };

  // Validate required demographics fields
  const validateDemographics = () => {
    const errors = {};
    const demoFields = DEMOGRAPHICS[stakeholderType]?.fields || [];
    for (const field of demoFields) {
      if (field.required && (!demographics[field.id] || demographics[field.id].trim() === '')) {
        errors[field.id] = 'This field is required';
      }
    }
    return errors;
  };

  const handleNext = () => {
    setValidationError('');

    if (step === 0) {
      const missing = validateLikertSection('A');
      if (missing.length > 0) {
        setValidationError(`Please answer all items in Section A. Missing: ${missing.join(', ')}`);
        return;
      }
    } else if (step === 1) {
      const missing = validateLikertSection('B');
      if (missing.length > 0) {
        setValidationError(`Please answer all items in Section B. Missing: ${missing.join(', ')}`);
        return;
      }
    } else if (step === 2) {
      const missing = validateLikertSection('C');
      if (missing.length > 0) {
        setValidationError(`Please answer all items in Section C. Missing: ${missing.join(', ')}`);
        return;
      }
    } else if (step === 3) {
      const missing = validateSectionD();
      if (missing.length > 0) {
        setValidationError(`Please indicate Yes or No for: ${missing.join(', ')}`);
        return;
      }
    }

    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo(0, 0);
      setValidationError('');
      setDemoValidationErrors({});
    }
  };

  const handleSubmit = async () => {
    // Validate required demographics fields before submitting
    const demoErrors = validateDemographics();
    if (Object.keys(demoErrors).length > 0) {
      setDemoValidationErrors(demoErrors);
      setValidationError('Please fill in all required fields before submitting.');
      return;
    }
    setDemoValidationErrors({});

    setSubmitting(true);
    setValidationError('');

    try {
      // Build respondent record
      const respondent = {
        stakeholder_type: stakeholderType,
        access_code: accessCode,
        repeat_flag: repeatFlag,
        ...demographics,
      };

      // Build Section D rows
      const sectionD = sectionDData.categories.map((cat) => {
        const resp = sectionDResponses[cat.id] || { uses: false, tools: [], other: '' };
        return {
          category: cat.id,
          uses_category: resp.uses || false,
          selected_tools: resp.tools || [],
          other_tool: resp.other || null,
        };
      });

      // Build Likert rows
      const likertRows = [];
      for (const sectionKey of ['A', 'B', 'C']) {
        for (const construct of likertSections[sectionKey].constructs) {
          for (const item of construct.items) {
            if (likertResponses[item.code]) {
              likertRows.push({
                section: sectionKey,
                item_code: item.code,
                value: likertResponses[item.code],
              });
            }
          }
        }
      }

      await submitSurvey({
        respondent,
        sectionA: sectionD,
        likertResponses: likertRows,
      });

      // Set localStorage flag to detect future repeat submissions
      try {
        localStorage.setItem(`ai_eng_tam_submitted_${stakeholderType}`, 'true');
      } catch {
        // localStorage may not be available; ignore silently
      }

      navigate('/thank-you');
    } catch (err) {
      console.error('Submission error:', err);
      setValidationError(`Submission failed: ${err.message}. Please try again.`);
      setSubmitting(false);
    }
  };

  const sectionKeys = ['A', 'B', 'C'];

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>AI-Eng-TAM</h1>
        <p className="subtitle">{TITLES[stakeholderType]}</p>
      </div>

      <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} />

      {validationError && (
        <div className="validation-error">{validationError}</div>
      )}

      {/* Steps 0-2: Likert Sections A, B, C */}
      {step < 3 && (
        <LikertSection
          sectionData={likertSections[sectionKeys[step]]}
          responses={likertResponses}
          onResponse={handleLikertResponse}
        />
      )}

      {/* Step 3: Section D */}
      {step === 3 && (
        <SectionD
          sectionDData={sectionDData}
          responses={sectionDResponses}
          onUpdate={handleSectionDUpdate}
        />
      )}

      {/* Step 4: Demographics */}
      {step === 4 && (
        <DemographicsForm
          stakeholderType={stakeholderType}
          values={demographics}
          onChange={setDemographics}
          validationErrors={demoValidationErrors}
        />
      )}

      <div className="nav-buttons">
        {step > 0 ? (
          <button className="btn btn-secondary" onClick={handleBack}>
            Back
          </button>
        ) : (
          <div className="spacer" />
        )}

        {step < TOTAL_STEPS - 1 ? (
          <button className="btn btn-primary" onClick={handleNext}>
            Next
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Survey'}
          </button>
        )}
      </div>
    </div>
  );
}
