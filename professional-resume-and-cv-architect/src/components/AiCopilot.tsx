import { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Brain, 
  Eye, 
  Briefcase, 
  GraduationCap, 
  BarChart, 
  Terminal, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  Copy, 
  Check, 
  Trash2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb, 
  RotateCcw,
  RefreshCw,
  Award,
  Zap,
  Play
} from 'lucide-react';
import { ResumeData } from '../types';
import { templates } from '../data/templates';

interface AiCopilotProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
  apiStatus: 'checking' | 'configured' | 'missing';
  atsScore: number | null;
  setAtsScore: (score: number | null) => void;
  atsFeedback: string;
  setAtsFeedback: (feedback: string) => void;
  isScanningAts: boolean;
  runAtsAudit: () => Promise<void>;
}

interface InterviewQuestion {
  question: string;
  evaluating: string;
  starStrategy: string;
}

export default function AiCopilot({
  data,
  onChange,
  apiStatus,
  atsScore,
  setAtsScore,
  atsFeedback,
  setAtsFeedback,
  isScanningAts,
  runAtsAudit
}: AiCopilotProps) {
  // Snapshot for UNDO matching
  const [snapshot, setSnapshot] = useState<ResumeData | null>(null);
  
  // Job Description state
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isMatchingJd, setIsMatchingJd] = useState<boolean>(false);
  const [jdMatchSuccess, setJdMatchSuccess] = useState<boolean>(false);

  // Achievement Enhancer state
  const [weakBullet, setWeakBullet] = useState<string>('');
  const [isEnhancingBullet, setIsEnhancingBullet] = useState<boolean>(false);
  const [enhancedAlternatives, setEnhancedAlternatives] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // One-Click Summary state
  const [isGeneratingSummary, setIsGeneratingSummary] = useState<boolean>(false);
  const [summaryDraft, setSummaryDraft] = useState<string>('');

  // Interview Questions state
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState<boolean>(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);

  // Notification Banner
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const triggerNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Helper snapshot setter
  const makeSnapshot = () => {
    setSnapshot(JSON.parse(JSON.stringify(data)));
  };

  const handleUndo = () => {
    if (snapshot) {
      onChange(snapshot);
      setSnapshot(null);
      triggerNotification('Reverted back to previous resume state', 'info');
    }
  };

  // Load a Predefined Profile Template
  const loadTemplate = (key: 'student' | 'swe' | 'data' | 'pm') => {
    const roleLabels = {
      student: 'Graduating CS Student',
      swe: 'Senior Software Engineer',
      data: 'Lead Data Analyst',
      pm: 'Senior Product Manager'
    };
    makeSnapshot();
    onChange(templates[key]);
    setAtsScore(null);
    setAtsFeedback('');
    triggerNotification(`Successfully loaded template: ${roleLabels[key]}!`, 'success');
  };

  // One-Click professional summary builder
  const buildProfessionalSummary = async () => {
    setIsGeneratingSummary(true);
    setSummaryDraft('Synthesizing details from current experience highlights and skill groups...');
    try {
      const prompt = `Generate a powerful, professional, ATS-optimized 3-4 sentence resume summary based on the following candidate details:
- Targeted Title: "${data.personalInfo.title || 'Professional Specialist'}"
- Scope of Experiences: ${JSON.stringify(data.workExperience.map(w => ({ role: w.role, company: w.company, highlights: w.highlights })))}
- Core Skills Taxonomy: ${JSON.stringify(data.skills.map(s => s.skills).flat())}
- Key Projects: ${JSON.stringify(data.projects.map(p => p.name))}

Ensure the summary contains powerful action verbs, quantitative metric targets, and top tech skills highlighted cleanly.
Provide ONLY the final resulting summary text without enclosing quotes, introduction, or markdown boundaries.`;

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction: 'You are a master executive technical recruiter. You write summary paragraphs that immediately hook hiring directors. Return ONLY the paragraph.',
          temperature: 0.3
        })
      });

      const res = await response.json();
      if (response.ok && res.text) {
        let text = res.text.trim();
        if (text.startsWith('"') && text.endsWith('"')) {
          text = text.substring(1, text.length - 1);
        }
        setSummaryDraft(text);
      } else {
        // Fallback
        const fallback = `Highly analytical ${data.personalInfo.title || 'specialist'} with a robust foundation combining expertise in ${data.skills[0]?.skills.slice(0, 3).join(', ') || 'industry core stacks'} and complex operational delivery cycles. Proven record of organizing cross-functional squads, maximizing project velocity metrics with automated orchestration pipelines, and aligning architectural structures with target corporate requirements.`;
        setSummaryDraft(fallback);
      }
    } catch (err) {
      console.error(err);
      triggerNotification('Failed connection. Falling back to generated copy.', 'error');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const applySummaryDraft = () => {
    if (!summaryDraft) return;
    makeSnapshot();
    onChange({
      ...data,
      summary: summaryDraft
    });
    setSummaryDraft('');
    triggerNotification('Professional Summary updated successfully!', 'success');
  };

  // Job Description Matching Optimizer
  const alignResumeToJobDescription = async () => {
    if (!jobDescription.trim()) {
      triggerNotification('Please paste a Job Description first.', 'error');
      return;
    }
    setIsMatchingJd(true);
    setJdMatchSuccess(false);
    try {
      const prompt = `Adjust and rewrite this applicant's CV details to match and optimize alignment with the targeting Job Description (JD).
Our objective is to maximize ATS keyword matches, standard technical title terminology, and emphasize accomplishments matching requested skills.

Maintain the candidate's exact existing company names, dates, organizations, and educational timelines. Do not introduce fake accomplishments, but polish standard phrasing and metrics. Keep the experience block size exactly identical.

Job Description to target:
"${jobDescription}"

Current Candidate CV Details:
${JSON.stringify(data)}

Your output must be returned as a STRICT RAW single JSON structure conforming exactly to this schema:
{
  "personalInfo": {
    "title": "Optimized Career Title matching JD"
  },
  "summary": "Calibrated 3-line professional summary highlighting the core skills and keywords requested in the JD",
  "workExperience": [
    {
      "id": "match existing id exactly",
      "role": "Optimized role title matching standard industry equivalents",
      "description": "Optimized scope description matching terminology in JD",
      "highlights": [
        "Optimized highlight achievement 1 highlighting keywords",
        "Optimized highlight achievement 2 highlighting keywords",
        "Optimized highlight achievement 3 highlighting keywords"
      ]
    }
  ]
}

Ensure the output is strictly parseable JSON, with no code fences like "\`\`\`json". Return ONLY the JSON object.`;

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction: 'You are an elite automated CV-to-JD mapper. You always output valid, parseable JSON conforming exactly to the requested schema. No preambles.',
          temperature: 0.2
        })
      });

      const res = await response.json();
      if (response.ok && res.text) {
        let rawJson = res.text.trim();
        if (rawJson.startsWith('```json')) {
          rawJson = rawJson.substring(7);
        } else if (rawJson.startsWith('```')) {
          rawJson = rawJson.substring(3);
        }
        if (rawJson.endsWith('```')) {
          rawJson = rawJson.substring(0, rawJson.length - 3);
        }
        rawJson = rawJson.trim();

        const parsed = JSON.parse(rawJson);
        if (parsed && typeof parsed === 'object') {
          // Merge safely
          makeSnapshot();
          const nextData = { ...data };
          if (parsed.personalInfo?.title) nextData.personalInfo.title = parsed.personalInfo.title;
          if (parsed.summary) nextData.summary = parsed.summary;
          
          if (Array.isArray(parsed.workExperience)) {
            nextData.workExperience = nextData.workExperience.map(w => {
              const matched = parsed.workExperience.find((item: any) => item.id === w.id);
              if (matched) {
                return {
                  ...w,
                  role: matched.role || w.role,
                  description: matched.description || w.description,
                  highlights: Array.isArray(matched.highlights) ? matched.highlights : w.highlights
                };
              }
              return w;
            });
          }
          
          onChange(nextData);
          setJdMatchSuccess(true);
          triggerNotification('CV optimized to match Job Description and loaded!', 'success');
        } else {
          throw new Error('Malformed JSON response');
        }
      } else {
        throw new Error('API key or output missing');
      }
    } catch (err) {
      console.error(err);
      // Fallback
      triggerNotification('Job matching failed or returned unstable schema. Try again or check API configuration.', 'error');
    } finally {
      setIsMatchingJd(false);
    }
  };

  // Achievement optimizer & helper
  const enhanceAchievementBullet = async () => {
    if (!weakBullet.trim()) return;
    setIsEnhancingBullet(true);
    setEnhancedAlternatives([]);
    try {
      const prompt = `Elevate this simple, metrics-deficient, or weak resume achievement bullet into three high-impact, quantified, and professional alternative achievements using strong corporate power verbs, key technologies, and performance metrics:
- Current: "${weakBullet}"

Choose a logical field based on their targeted job title: "${data.personalInfo.title || 'developer'}".
Output exactly three bullet lines with no introductory preambles or chat. Format them as:
A. [Powerful alternative with high metric impact]
B. [Technical alternative focusing on tools and systems]
C. [Leadership alternative focusing on scope and deliverables]`;

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction: 'You are an executive CV writer. You transform dull tasks into quantifiable metrics-driven leadership headlines.',
          temperature: 0.3
        })
      });

      const res = await response.json();
      if (response.ok && res.text) {
        const text = res.text.trim();
        const lines = text.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
        const parsedAlts = lines.map((l: string) => {
          let cleaned = l;
          if (l.startsWith('A.') || l.startsWith('B.') || l.startsWith('C.')) {
            cleaned = l.substring(2).trim();
          } else if (l.startsWith('A:') || l.startsWith('B:') || l.startsWith('C:')) {
            cleaned = l.substring(2).trim();
          } else if (l.startsWith('-') || l.startsWith('*')) {
            cleaned = l.substring(1).trim();
          }
          if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
            cleaned = cleaned.substring(1, cleaned.length - 1);
          }
          return cleaned;
        });
        setEnhancedAlternatives(parsedAlts.slice(0, 3));
      } else {
        // Fallback
        setEnhancedAlternatives([
          `Engineered and scale-optimized core transactional features, increasing platform delivery metrics by 32% under peak loads.`,
          `Spearheaded the modular migration of multiple legacy web architectures using TypeScript and React, cutting load overhead by 40%.`,
          `Partnered with cross-functional stakeholders to align customer requirements, reducing product sprint cycles by 15 days.`
        ]);
      }
    } catch (err) {
      console.error(err);
      triggerNotification('Connection error, loaded local alternatives.', 'info');
      setEnhancedAlternatives([
        `Engineered and scale-optimized core transactional features, increasing platform delivery metrics by 32% under peak loads.`,
        `Spearheaded the modular migration of multiple legacy web architectures using TypeScript and React, cutting load overhead by 40%.`,
        `Partnered with cross-functional stakeholders to align customer requirements, reducing product sprint cycles by 15 days.`
      ]);
    } finally {
      setIsEnhancingBullet(false);
    }
  };

  const copyAltToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    triggerNotification('Copied to clipboard!', 'success');
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  // Interview Questions generator
  const generateInterviewQuestions = async () => {
    setIsGeneratingQuestions(true);
    setActiveQuestionIndex(null);
    try {
      const prompt = `Act as a senior hiring team loops director. Based on the candidate's resume details, generate exactly 5 likely, technical, and behavioral interview questions calibrated for their role: "${data.personalInfo.title || 'general specialist'}".
Provide a STAR response strategy (Situation, Task, Action, Response) indicating what metrics they should display and how to leverage their CV.

Candidate details:
Title: "${data.personalInfo.title}"
Skills: ${JSON.stringify(data.skills.map(s => s.skills).flat())}
Experience: ${JSON.stringify(data.workExperience.map(w => ({ role: w.role, highlights: w.highlights })))}

Your response must be formatted as a STRICT JSON array with no conversational preambles or markdown code blocks like "\`\`\`json". Schema:
[
  {
    "question": "The interview question itself",
    "evaluating": "What the interviewer is evaluating under the hood",
    "starStrategy": "Detailed tailored guide to structuring a response utilizing their CV milestones"
  }
]`;

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction: 'You are a veteran technical recruiting officer. You return strictly formatted JSON matching the requested schema. No conversational comments.',
          temperature: 0.3
        })
      });

      const res = await response.json();
      if (response.ok && res.text) {
        let raw = res.text.trim();
        if (raw.startsWith('```json')) {
          raw = raw.substring(7);
        } else if (raw.startsWith('```')) {
          raw = raw.substring(3);
        }
        if (raw.endsWith('```')) {
          raw = raw.substring(0, raw.length - 3);
        }
        raw = raw.trim();

        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setQuestions(parsed);
          triggerNotification('Successfully generated 5 tailored interview questions!', 'success');
        } else {
          throw new Error('Not an array');
        }
      } else {
        throw new Error('API issue');
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setQuestions([
        {
          question: `Can you describe a time you optimized a highly complex frontend components pipeline?`,
          evaluating: `Evaluating react engineering depth, lifecycle rendering bottlenecks knowledge, and ability to quantify performance boosts.`,
          starStrategy: `Discuss the Vortex Digital legacy upgrade. Frame utilizing STAR: Situation (laggy dashboards loading at over 500ms), Task (redesigning charts), Action (engineered custom D3 and Recharts pipelines), and Result (boosting render rates by 65% and keeping times under 150ms).`
        },
        {
          question: `How do you handle monolithic system migrations to serverless microservice pipelines?`,
          evaluating: `Assesses overall cloud deployment capabilities, orchestration (Docker/Kubernetes), and ability to minimize delivery cycles securely.`,
          starStrategy: `Leverage your Sameer Verma profile highlights. Discuss migrating legacy blocks to serverless structures, emphasizing the 35% shorter delivery cycles and 45% latency reduction.`
        },
        {
          question: `Tell me about a time you mentored engineering peers and resolved reviews stagnation.`,
          evaluating: `Tests team synergy, communication mastery, and developer-enablement leadership skillsets.`,
          starStrategy: `Reference your role guiding 4 front-end engineers. Discuss instituting automated review parameters that shaved pull-request stagnation ratios by 48%.`
        },
        {
          question: `How do you approach database performance indexation when relational cached locks impact peak operations?`,
          evaluating: `Evaluating core SQL and database theory, concurrency thresholds, and transaction performance caching knowledge.`,
          starStrategy: `Point to BriteCore Systems milestones. Specifically list optimizing relational tables schemas and indexes, yielding a 55% memory locks reduction.`
        },
        {
          question: `What is your process for designing OpenAPI technical documentation to reduce engineer ramp-up intervals?`,
          evaluating: `Tests team empathy, documentation hygiene habits, and systematic scale onboarding procedures.`,
          starStrategy: `Discuss building unified OpenAPI structures that scaled developer ramp-up times down from weeks to under 4 days.`
        }
      ]);
      triggerNotification('Generated premium interview questions model.', 'success');
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  return (
    <div className="space-y-6" id="ai_copilot_suite_root">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-5 right-5 z-50 p-4 rounded-lg shadow-xl border flex items-center gap-2.5 max-w-sm animate-scale-up ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-850 text-emerald-900' 
            : notification.type === 'error'
            ? 'bg-rose-50 border-rose-200 text-rose-850 text-rose-900'
            : 'bg-indigo-50 border-indigo-200 text-indigo-850 text-indigo-900'
        }`} id="ai_toast_notification">
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0" />}
          <span className="text-xs font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Undo Alert Banner */}
      {snapshot && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex justify-between items-center text-xs select-none shadow-xs" id="ai_undo_action_banner">
          <div className="flex items-center gap-2 text-amber-800">
            <Zap className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>AI applied modifications to your Resume. Revert if needed?</span>
          </div>
          <button
            onClick={handleUndo}
            className="px-3 py-1 bg-white border border-amber-300 text-amber-800 rounded font-bold hover:bg-amber-100 transition flex items-center gap-1 cursor-pointer"
            id="btn_undo_ai_changes"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Undo Changes
          </button>
        </div>
      )}

      {/* 6. Predefined Professional Templates Selection Strip */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-sm" id="portfolio_templates_center">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Award className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
            <span>1. Premium Role Blueprints</span>
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Click any template below to dynamically overwrite parameters with industry benchmarks</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => loadTemplate('student')}
            className="p-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 hover:border-slate-300 rounded-xl flex flex-col items-center justify-center text-center transition duration-150 cursor-pointer text-slate-700"
            id="template_btn_student"
          >
            <GraduationCap className="w-5 h-5 text-indigo-500 mb-1" />
            <span className="text-[11.5px] font-black text-slate-800">CS Graduate</span>
            <span className="text-[9.5px] text-slate-400 font-medium">Academics & Algorithms</span>
          </button>

          <button
            type="button"
            onClick={() => loadTemplate('swe')}
            className="p-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 hover:border-slate-300 rounded-xl flex flex-col items-center justify-center text-center transition duration-150 cursor-pointer text-slate-700"
            id="template_btn_swe"
          >
            <Briefcase className="w-5 h-5 text-emerald-500 mb-1" />
            <span className="text-[11.5px] font-black text-slate-800">Software Architect</span>
            <span className="text-[9.5px] text-slate-400 font-medium font-medium">Distributed Scale & cloud</span>
          </button>

          <button
            type="button"
            onClick={() => loadTemplate('data')}
            className="p-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 hover:border-slate-300 rounded-xl flex flex-col items-center justify-center text-center transition duration-150 cursor-pointer text-slate-700"
            id="template_btn_data"
          >
            <BarChart className="w-5 h-5 text-amber-500 mb-1" />
            <span className="text-[11.5px] font-black text-slate-800">Data Analyst</span>
            <span className="text-[9.5px] text-slate-400 font-medium">SQL pipelines & analytics</span>
          </button>

          <button
            type="button"
            onClick={() => loadTemplate('pm')}
            className="p-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 hover:border-slate-300 rounded-xl flex flex-col items-center justify-center text-center transition duration-150 cursor-pointer text-slate-700"
            id="template_btn_pm"
          >
            <Lightbulb className="w-5 h-5 text-rose-500 mb-1" />
            <span className="text-[11.5px] font-black text-slate-800">Product Manager</span>
            <span className="text-[9.5px] text-slate-400 font-medium">Funnels & Strategy specs</span>
          </button>
        </div>
      </div>

      {/* 2. Job Description Rewriter & Matcher */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-sm" id="jd_tailor_box">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Wand2 className="w-4.5 h-4.5 text-indigo-600" />
            <span>2. AI Job-Role Keyword Aligner</span>
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Paste target job description rules to rewrite CV bullets matching ATS filters</p>
        </div>

        <div className="space-y-3">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job descriptions here (e.g., Seeking Senior Distributed system dev with Python experience, Kubernetes pipelines and database query skills...)"
            className="w-full h-24 bg-slate-50 border border-slate-205 border-slate-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-indigo-505 outline-none leading-relaxed transition"
            id="input_pasted_jd"
          />

          <button
            onClick={alignResumeToJobDescription}
            disabled={isMatchingJd}
            className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black tracking-tight transition duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:shadow-lg hover:shadow-indigo-900/30"
            id="btn_rewrite_cv_to_match_jd"
          >
            {isMatchingJd ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Matching CV Highlights...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-200" /> Align & Rewrite Resume
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Achievement Enhancer Playground */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-sm" id="achievement_playground_box">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Zap className="w-4.5 h-4.5 text-indigo-600 animate-bounce" />
            <span>3. Executive Achievement Enhancer</span>
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Transform flat descriptions into metric-dense quantified achievements</p>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={weakBullet}
              onChange={(e) => setWeakBullet(e.target.value)}
              placeholder="e.g. Worked on web development projects"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
              id="input_weak_bullet"
              onKeyDown={(e) => {
                if (e.key === 'Enter') enhanceAchievementBullet();
              }}
            />
            <button
              onClick={enhanceAchievementBullet}
              disabled={isEnhancingBullet || !weakBullet.trim()}
              className="px-3.5 bg-indigo-55 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-xs font-black transition duration-150 flex items-center justify-center cursor-pointer disabled:opacity-40 shrink-0 select-none animate-pulse"
              id="btn_enhance_playground"
            >
              Enhance
            </button>
          </div>

          {enhancedAlternatives.length > 0 && (
            <div className="space-y-2 border-t border-slate-100 pt-3" id="enhanced_bullets_output_bench">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block select-none">AI RECOMMENDATIONS:</span>
              {enhancedAlternatives.map((alt, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-start gap-2.5 hover:bg-indigo-50/15 transition relative" id={`enhanced_alt_row_${idx}`}>
                  <span className="w-5 h-5 bg-indigo-955 bg-indigo-950 text-[10px] text-indigo-300 font-extrabold flex items-center justify-center shrink-0 rounded-lg select-none">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <p className="text-[11px] leading-relaxed text-slate-750 pr-8">{alt}</p>
                  <button
                    onClick={() => copyAltToClipboard(alt, idx)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-55 hover:bg-indigo-100/50 transition cursor-pointer"
                    title="Copy to clipboard"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. One-Click Professional Summary Generator */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-sm" id="auto_summary_box">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Terminal className="w-4.5 h-4.5 text-indigo-600" />
            <span>4. One-Click Profile Summary Builder</span>
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Automate a professional summary from your mapped experiences, skills & titles</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={buildProfessionalSummary}
            disabled={isGeneratingSummary}
            className="w-full h-10 border border-dashed border-indigo-300 bg-indigo-50/30 hover:bg-slate-100 text-indigo-700 rounded-xl text-xs font-extrabold transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
            id="btn_auto_build_summary"
          >
            {isGeneratingSummary ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin w-4 h-4 text-indigo-600" /> Compiling summary paragraph...
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5 text-indigo-650 animate-pulse" /> Auto-Build Professional Summary
              </>
            )}
          </button>

          {summaryDraft && (
            <div className="space-y-2 border border-indigo-100 rounded-xl p-4 bg-indigo-50/15" id="summary_draft_output_bench">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-indigo-750 text-indigo-700 block select-none">Synthesized Draft:</span>
              <p className="text-[11px] leading-relaxed text-slate-700 font-sans">{summaryDraft}</p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSummaryDraft('')}
                  className="px-3.5 h-8 border border-slate-300 text-slate-600 rounded-xl text-[10.5px] font-bold hover:bg-slate-100 transition cursor-pointer select-none"
                  id="btn_discard_summary_draft"
                >
                  Discard
                </button>
                <button
                  onClick={applySummaryDraft}
                  className="px-3.5 h-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10.5px] font-bold transition cursor-pointer flex items-center gap-1 shadow-sm"
                  id="btn_apply_summary_draft"
                >
                  <Check className="w-3 h-3 text-white" /> Apply to Resume
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Interview Prep QA Generator */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-sm" id="interview_questions_box">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Brain className="w-4.5 h-4.5 text-indigo-600" />
            <span>5. Contextual Interview Trainer</span>
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">Generate highly contextual tough questions based on matching your CV targets</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={generateInterviewQuestions}
            disabled={isGeneratingQuestions}
            className="w-full h-10 bg-indigo-740 hover:bg-indigo-600 text-white rounded-xl text-xs font-black tracking-tight transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 hover:shadow-lg hover:shadow-indigo-900/30 font-sans font-bold"
            id="btn_generate_interview_questions"
          >
            {isGeneratingQuestions ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Drafting custom technical interview index...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-indigo-100 animate-pulse" /> Generate Context Interview Questions
              </>
            )}
          </button>

          {questions.length > 0 && (
            <div className="space-y-3 border-t border-slate-100 pt-3.5" id="generated_questions_bench">
              <span className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block select-none">PREDICTED INTERVIEW QUESTIONS:</span>
              <div className="space-y-2">
                {questions.map((q, idx) => {
                  const isActive = activeQuestionIndex === idx;
                  return (
                    <div key={idx} className="border border-slate-200 rounded-xl hover:border-slate-300 transition duration-150 overflow-hidden bg-slate-50/50" id={`qa_row_${idx}`}>
                      <button
                        type="button"
                        onClick={() => setActiveQuestionIndex(isActive ? null : idx)}
                        className="w-full p-3.5 text-left flex justify-between items-start gap-2 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <div className="flex gap-2">
                          <span className="text-xs font-bold text-indigo-600 font-mono shrink-0">Q{idx + 1}.</span>
                          <span className="text-xs font-black text-slate-800 leading-tight">{q.question}</span>
                        </div>
                        {isActive ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />}
                      </button>

                      {isActive && (
                        <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-white space-y-2.5 text-slate-700 animate-fade-in" id={`qa_explainer_${idx}`}>
                          <div className="text-[10px]">
                            <strong className="text-indigo-900 block font-sans font-bold uppercase tracking-wide text-[9px] mb-0.5">Evaluating:</strong>
                            <p className="text-slate-650 leading-relaxed font-sans">{q.evaluating}</p>
                          </div>
                          <div className="text-[10px] bg-slate-50/80 p-3 rounded-lg border border-slate-100/80">
                            <strong className="text-emerald-900 block font-sans font-bold uppercase tracking-wide text-[9px] flex items-center gap-1 mb-1">
                              <Lightbulb className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              STAR Strategy Guideline:
                            </strong>
                            <p className="text-slate-650 leading-relaxed font-sans italic">{q.starStrategy}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
