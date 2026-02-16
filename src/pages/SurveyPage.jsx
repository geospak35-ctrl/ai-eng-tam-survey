import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getSectionAData, getLikertSections } from '../data/surveyData';
import { submitSurvey } from '../lib/supabase';
import ProgressBar from '../components/ProgressBar';
import LikertSection from '../components/LikertSection';
import SectionA from '../components/SectionA';
import DemographicsForm from '../components/DemographicsForm';

const TITLES = {
  faculty: 'Faculty Survey',
  student: 'Student Survey',
  practitioner: 'Practitioner / Hiring Manager Survey',
};

const TOTAL_STEPS = 5; // B, C, D, A, Demographics

export default function SurveyPage() {
  const { stakeholderType } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const accessCode = location.state?.accessCode || '';

  // Redirect if no valid stakeholder type
  useEffect(() => {
    if (!['faculty', 'student', 'practitioner'].includes(stakeholderType)) {
      navigate('/');
    }
  }, [stakeholderType, navigate]);

  const [step, setStep] = useState(0); // 0=B, 1=C, 2=D, 3=A, 4=Demo
  const [likertResponses, setLikertResponses] = useState({});
  const [sectionAResponses, setSectionAResponses] = useState({});
  const [demographics, setDemographics] = useState({});
  const [validationError, setValidationError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const likertSections = getLikertSections(stakeholderType);
  const sectionAData = getSectionAData(stakeholderType);

  const handleLikertResponse = (itemCode, value) => {
    setLikertResponses((prev) => ({ ...prev, [itemCode]: value }));
    setValidationError('');
  };

  const handleSectionAUpdate = (categoryId, data) => {
    setSectionAResponses((prev) => ({ ...prev, [categoryId]: data }));
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

  // Validate Section A: all categories must have yes/no answered
  const validateSectionA = () => {
    const unanswered = [];
    for (const cat of sectionAData.categories) {
      const resp = sectionAResponses[cat.id];
      if (!resp || resp.uses === null || resp.uses === undefined) {
        unanswered.push(cat.name);
      }
    }
    return unanswered;
  };

  const handleNext = () => {
    setValidationError('');

    if (step === 0) {
      const missing = validateLikertSection('B');
      if (missing.length > 0) {
        setValidationError(`Please answer all items in Section B. Missing: ${missing.join(', ')}`);
        return;
      }
    } else if (step === 1) {
      const missing = validateLikertSection('C');
      if (missing.length > 0) {
        setValidationError(`Please answer all items in Section C. Missing: ${missing.join(', ')}`);
        return;
      }
    } else if (step === 2) {
      const missing = validateLikertSection('D');
      if (missing.length > 0) {
        setValidationError(`Please answer all items in Section D. Missing: ${missing.join(', ')}`);
        return;
      }
    } else if (step === 3) {
      const missing = validateSectionA();
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
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setValidationError('');

    try {
      // Build respondent record
      const respondent = {
        stakeholder_type: stakeholderType,
        access_code: accessCode,
        ...demographics,
      };

      // Build Section A rows
      const sectionA = sectionAData.categories.map((cat) => {
        const resp = sectionAResponses[cat.id] || { uses: false, tools: [], other: '' };
        return {
          category: cat.id,
          uses_category: resp.uses || false,
          selected_tools: resp.tools || [],
          other_tool: resp.other || null,
        };
      });

      // Build Likert rows
      const likertRows = [];
      for (const sectionKey of ['B', 'C', 'D']) {
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
        sectionA,
        likertResponses: likertRows,
      });

      navigate('/thank-you');
    } catch (err) {
      console.error('Submission error:', err);
      setValidationError(`Submission failed: ${err.message}. Please try again.`);
      setSubmitting(false);
    }
  };

  const sectionKeys = ['B', 'C', 'D'];

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

      {/* Steps 0-2: Likert Sections B, C, D */}
      {step < 3 && (
        <LikertSection
          sectionData={likertSections[sectionKeys[step]]}
          responses={likertResponses}
          onResponse={handleLikertResponse}
        />
      )}

      {/* Step 3: Section A */}
      {step === 3 && (
        <SectionA
          sectionAData={sectionAData}
          responses={sectionAResponses}
          onUpdate={handleSectionAUpdate}
        />
      )}

      {/* Step 4: Demographics */}
      {step === 4 && (
        <DemographicsForm
          stakeholderType={stakeholderType}
          values={demographics}
          onChange={setDemographics}
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
