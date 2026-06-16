import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Eye, 
  EyeOff,
  Printer, 
  Clock, 
  RotateCcw, 
  FileText, 
  Sliders,
  CheckCircle,
  AlertCircle,
  Brain,
  Shield,
  BookOpen,
  Download,
  X,
  FileCode,
  ZoomIn,
  ZoomOut,
  Grid,
  Layout,
  Maximize2,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeData, DesignSettings as SettingsType } from './types';
import { sampleResume } from './data/sampleCV';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import DesignSettings from './components/DesignSettings';
import AiCopilot from './components/AiCopilot';

const LOCAL_STORAGE_DATA_KEY = 'cv_architect_resume_data';
const LOCAL_STORAGE_SETTINGS_KEY = 'cv_architect_design_settings';

export default function App() {
  // Global CV Resume state
  const [resumeData, setResumeData] = useState<ResumeData>(sampleResume);
  
  // Custom layout design settings state
  const [designSettings, setDesignSettings] = useState<SettingsType>({
    accent: 'indigo',
    fontPreset: 'modern-sans',
    spacing: 'balanced',
    layout: 'single-column',
    showSectionIcons: true,
    dividedLines: true,
    fontSize: 'base'
  });

  // Active form workspace mode (Editor list vs Style controls vs AI Copilot Suite)
  const [activeControlTab, setActiveControlTab] = useState<'editor' | 'styles' | 'copilot'>('editor');
  
  // Simulated clock or state tracking
  const [currentTime, setCurrentTime] = useState<string>('');
  const [apiStatus, setApiStatus] = useState<'checking' | 'configured' | 'missing'>('checking');
  const [apiMessage, setApiMessage] = useState<string>('');
  
  // ATS optimizer analysis result state
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsFeedback, setAtsFeedback] = useState<string>('');
  const [isScanningAts, setIsScanningAts] = useState<boolean>(false);

  // Responsive state view toggle for mobile layout options
  const [mobileMode, setMobileMode] = useState<'write' | 'view'>('write');
  // High fidelity export panel modal toggle
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  // Premium Layout Designer workspace settings
  const [zoomScale, setZoomScale] = useState<number>(100);
  const [showGuidelines, setShowGuidelines] = useState<boolean>(false);
  const [backdropTheme, setBackdropTheme] = useState<'blueprint' | 'dark' | 'clean'>('blueprint');

  // Initialize time & storage
  useEffect(() => {
    // Clock
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.getUTCFullYear() + '-' + 
        String(now.getUTCMonth() + 1).padStart(2, '0') + '-' + 
        String(now.getUTCDate()).padStart(2, '0') + ' ' + 
        String(now.getUTCHours()).padStart(2, '0') + ':' + 
        String(now.getUTCMinutes()).padStart(2, '0') + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);

    // Hydrate state from localStorage if it exists
    const storedData = localStorage.getItem(LOCAL_STORAGE_DATA_KEY);
    const storedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (parsed && parsed.personalInfo && parsed.personalInfo.fullName === 'Sarah Vance') {
          // Auto-migrate old default template to Sameer Verma template
          setResumeData(sampleResume);
          localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(sampleResume));
        } else {
          setResumeData(parsed);
        }
      } catch (e) {
        console.error('Failed to parse stored resume data:', e);
      }
    }
    
    if (storedSettings) {
      try {
        setDesignSettings(JSON.parse(storedSettings));
      } catch (e) {
        console.error('Failed to parse stored design settings:', e);
      }
    }

    return () => clearInterval(interval);
  }, []);

  // Check backend server proxy API connections
  const checkStatus = async () => {
    try {
      setApiStatus('checking');
      const res = await fetch('/api/status');
      const data = await res.json();
      if (data.status === 'configured') {
        setApiStatus('configured');
      } else {
        setApiStatus('missing');
      }
      setApiMessage(data.message);
    } catch (err) {
      console.error(err);
      setApiStatus('missing');
      setApiMessage('Could not reach backend API router. Running in template simulation mode.');
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  // Save changes to localStorage helper
  const handleResumeDataChange = (newData: ResumeData) => {
    setResumeData(newData);
    localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(newData));
  };

  const handleDesignSettingsChange = (newSettings: SettingsType) => {
    setDesignSettings(newSettings);
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(newSettings));
  };

  // Clear or reset to blank templates
  const resetToSample = () => {
    if (window.confirm('Are you sure you want to revert all changes back to the sample CV template?')) {
      handleResumeDataChange(sampleResume);
      handleDesignSettingsChange({
        accent: 'indigo',
        fontPreset: 'modern-sans',
        spacing: 'balanced',
        layout: 'single-column',
        showSectionIcons: true,
        dividedLines: true,
        fontSize: 'base'
      });
      setAtsScore(null);
      setAtsFeedback('');
    }
  };

  const clearToBlank = () => {
    if (window.confirm('Wipe current resume buffer to start compiling a blank CV from scratch?')) {
      const blankCV: ResumeData = {
        personalInfo: {
          fullName: '',
          title: '',
          email: '',
          phone: '',
          location: '',
          website: '',
          github: '',
          linkedin: ''
        },
        summary: '',
        workExperience: [],
        education: [],
        projects: [],
        skills: [],
        certifications: [],
        languages: []
      };
      handleResumeDataChange(blankCV);
      setAtsScore(null);
      setAtsFeedback('');
    }
  };

  // Trigger Print system dialog (custom print @media CSS is bundled on modern sheets)
  const triggerPrintCV = () => {
    window.print();
  };

  // Download CV resume data as backup JSON file
  const downloadJsonBackup = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      const safeCandidateName = (resumeData.personalInfo.fullName || 'cv-profile').toLowerCase().replace(/[^a-z0-9]/gi, '_');
      downloadAnchor.setAttribute("download", `resume_backup_${safeCandidateName}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error(err);
    }
  };

  // Run AI ATS Keyword & Formatting Scan
  const runAtsAudit = async () => {
    setIsScanningAts(true);
    setAtsFeedback('Gemini is compiling keyword checklists, auditing spacing readability, and auditing section densities...');
    try {
      const textToAnalyze = `
        Candidate: ${resumeData.personalInfo.fullName}
        Title: ${resumeData.personalInfo.title}
        Summary: ${resumeData.summary}
        Work Highlights: ${JSON.stringify(resumeData.workExperience.map(w => w.highlights))}
        Skills: ${JSON.stringify(resumeData.skills)}
        Education: ${JSON.stringify(resumeData.education)}
      `;

      const prompt = `Review this applicant's CV details to report an ATS (Applicant Tracking System) compatibility scoring.
Check for standard resume pitfalls: lack of metric outcomes, vague skills listings, and profile summary clarity deficiencies.

First, reply with a scoring percentage integer from 40 to 100 on the first line (just the raw number like: "85").
On the lines following that, write a clean, elegant, bulleted feedback report with categories of "Strengths" and "Opportunities for ATS Optimization". Include suggested industry keywords to add based on their Title "${resumeData.personalInfo.title}".

Applicant details to analyze:
${textToAnalyze}`;

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction: 'You are a veteran recruiting director and senior ATS parser technician. Provide realistic audits with a focus on impact verb use and key term density. Be encouraging yet critical.',
          temperature: 0.2
        })
      });

      const res = await response.json();
      if (response.ok && res.text) {
        const textOutput = res.text.trim();
        const firstLineBreak = textOutput.indexOf('\n');
        let scoreCandidate = 80;
        let feedbackTrim = textOutput;
        
        if (firstLineBreak > 0) {
          const scoreStr = textOutput.substring(0, firstLineBreak).trim();
          const parsed = parseInt(scoreStr.replace(/[^0-9]/g, ''));
          if (!isNaN(parsed)) {
            scoreCandidate = Math.min(100, Math.max(0, parsed));
            feedbackTrim = textOutput.substring(firstLineBreak).trim();
          }
        }
        
        setAtsScore(scoreCandidate);
        setAtsFeedback(feedbackTrim);
      } else {
        // Fallback demo score
        setAtsScore(88);
        setAtsFeedback(`### ATS Scan Complete [Suggested Feedback]
- **Key Strengths**:
  - Balanced work tenure ratios and strong architectural action verbs like *Spearheaded*, *Overhauled*, and *Architected*.
  - Logical taxonomy layout with proper categorization.
- **ATS Opportunities**:
  - Increase density of technical keywords specifically matching cloud platforms like *Google Cloud Platform (GCP)* or *Docker*.
  - Consider adding quantifiable metric percentages to all bullet highlights.`);
      }
    } catch (err: any) {
      console.error(err);
      setAtsFeedback('Internal verification failure dispatching to AI auditor engine. Demo scan offline.');
      setAtsScore(75);
    } finally {
      setIsScanningAts(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased overflow-x-hidden print:bg-white selection:bg-indigo-100" id="cv_architect_root">
      
      {/* 1. Header (Hidden on print) */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex justify-between items-center z-40 sticky top-0 shrink-0 print:hidden select-none shadow-md backdrop-blur-md" id="builder_header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-750 p-[1px] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-900/20">
            <div className="w-full h-full bg-slate-950/40 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-300 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-sm md:text-base font-black tracking-tight text-white flex items-center gap-2">
              <span>CV ARCHITECT</span>
              <span className="text-[8.5px] font-mono tracking-widest font-black uppercase text-indigo-200 bg-indigo-950/80 border border-indigo-800/80 px-2 py-0.5 rounded-full">
                PRO EDITION
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">ATS-compliant lexical layout generator</p>
          </div>
        </div>

        {/* Global state, Refresh clocks */}
        <div className="flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700/60 rounded-xl text-[11px] text-slate-300 font-mono shadow-inner">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{currentTime || 'Syncing UTC...'}</span>
          </div>

          {/* Connectivity diagnostic badge */}
          <div className="flex items-center gap-2">
            {apiStatus === 'checking' ? (
              <span className="px-3 py-1.5 bg-slate-800 border border-slate-700/60 text-[10.5px] text-slate-300 flex items-center gap-2 rounded-xl font-mono shadow-inner">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" /> Checking AI...
              </span>
            ) : apiStatus === 'configured' ? (
              <span className="px-3 py-1.5 bg-emerald-950/50 border border-emerald-800/50 text-[10.5px] text-emerald-300 flex items-center gap-1.5 rounded-xl font-bold font-mono shadow-inner">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                <span>Gemini PRO</span>
              </span>
            ) : (
              <span 
                className="px-3 py-1.5 bg-amber-950/50 border border-amber-800/50 text-[10.5px] text-amber-300 flex items-center gap-1.5 rounded-xl font-bold font-mono cursor-pointer shadow-inner hover:bg-amber-900/40 transition duration-150"
                title="AI key missing. Fallback simulator active."
                onClick={checkStatus}
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulation Only</span>
              </span>
            )}
          </div>

          {/* Master Export Trigger Button */}
          <button
            onClick={() => setShowExportModal(true)}
            className="h-9 px-4.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black tracking-tight flex items-center gap-1.5 shadow-md shadow-indigo-900/30 hover:shadow-indigo-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer"
            id="btn_header_export_pdf"
          >
            <Download className="w-4 h-4 text-indigo-100" />
            <span>Export Document</span>
          </button>
        </div>
      </header>

      {/* Responsive mobile tabs controller (visible ONLY on mobile screens (<1024px) / hidden on print) */}
      <div className="lg:hidden bg-white border-b border-slate-200 p-2.5 sticky top-16 z-30 shrink-0 print:hidden select-none" id="mobile_viewport_pills_root">
        <div className="flex bg-slate-100 p-1 rounded-lg gap-1.5 shadow-inner">
          <button
            type="button"
            onClick={() => setMobileMode('write')}
            className={`flex-1 py-2 text-xs font-black rounded-md flex items-center justify-center gap-1.5 transition ${
              mobileMode === 'write'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Draft CV Content</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileMode('view')}
            className={`flex-1 py-1.5 text-xs font-black rounded-md flex items-center justify-center gap-1.5 transition ${
              mobileMode === 'view'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-505 text-slate-500 hover:text-slate-805'
            }`}
          >
            <Eye className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Live PDF Preview</span>
          </button>
        </div>
      </div>

      {/* 2. Core Dashboard Layout Split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden" id="workspace_split_layout">
        
        {/* LEFT COLUMN: Controls & Form Accordions (Hidden on Print, conditionally visible on mobile) */}
        <aside className={`w-full lg:w-[460px] xl:w-[500px] border-r border-slate-200 bg-white flex flex-col shrink-0 overflow-y-auto print:hidden ${mobileMode === 'write' ? 'flex' : 'hidden lg:flex'}`} id="left_dashboard_sidebar">
          
          {/* Workspace Tabs Controller */}
          <div className="flex items-center bg-slate-50 border-b border-slate-200 px-6 py-3 justify-between select-none" id="form_controls_header">
            <div className="relative flex bg-slate-200/60 p-1 rounded-lg gap-1.5 w-full mr-2.5 overflow-hidden select-none">
              <button
                onClick={() => setActiveControlTab('editor')}
                className={`relative flex-1 py-1.5 text-[11px] font-bold rounded-md flex items-center justify-center gap-1 transition-all z-10 cursor-pointer ${
                  activeControlTab === 'editor' ? 'text-slate-900 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {activeControlTab === 'editor' && (
                  <motion.div
                    layoutId="active_tab_pillow"
                    className="absolute inset-0 bg-white rounded-md -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Draft</span>
              </button>

              <button
                onClick={() => setActiveControlTab('styles')}
                className={`relative flex-1 py-1.5 text-[11px] font-bold rounded-md flex items-center justify-center gap-1 transition-all z-10 cursor-pointer ${
                  activeControlTab === 'styles' ? 'text-slate-900 shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {activeControlTab === 'styles' && (
                  <motion.div
                    layoutId="active_tab_pillow"
                    className="absolute inset-0 bg-white rounded-md -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                <span>Styles</span>
              </button>

              <button
                onClick={() => setActiveControlTab('copilot')}
                className={`relative flex-1 py-1.5 text-[11px] font-extrabold rounded-md flex items-center justify-center gap-1 transition-all z-10 cursor-pointer ${
                  activeControlTab === 'copilot' ? 'text-white' : 'text-indigo-600 hover:text-indigo-805 hover:bg-indigo-50/40'
                }`}
                id="btn_tab_ai_copilot_trigger"
              >
                {activeControlTab === 'copilot' && (
                  <motion.div
                    layoutId="active_tab_pillow"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-650 rounded-md shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <Sparkles className={`w-3.5 h-3.5 ${activeControlTab === 'copilot' ? 'text-indigo-100' : 'text-indigo-600'} animate-pulse`} />
                <span>AI Copilot</span>
              </button>
            </div>

            {/* Clear, Reset action dropdown */}
            <div className="flex gap-2">
              <button
                onClick={resetToSample}
                className="p-1.5 hover:bg-slate-200/80 rounded border border-slate-200 text-slate-500 hover:text-slate-800 transition"
                title="Reset back to Sameer Verma sample CV"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={clearToBlank}
                className="px-2.5 py-1.5 hover:bg-slate-200/80 rounded border border-slate-200 text-xs font-semibold text-slate-500 hover:text-red-650 transition"
                title="Wipe to Blank starting sheet"
              >
                Start Blank
              </button>
            </div>
          </div>

          {/* Form and Accordions Viewport */}
          <div className="flex-1 p-6 space-y-6">
            {activeControlTab === 'editor' ? (
              <>
                <ResumeForm 
                  data={resumeData} 
                  onChange={handleResumeDataChange} 
                  apiStatus={apiStatus}
                />

                {/* 3. ATS AI Auditor Box */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl shadow-slate-950/40 animate-fade-in" id="ats_score_scanner">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-white">
                      <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/50 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-indigo-450 text-indigo-400 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-100">ATS CO-PILOT AUDIT</h3>
                        <p className="text-[10px] text-slate-400 leading-normal">Parsing metrics density & compliance</p>
                      </div>
                    </div>
                    {atsScore !== null && (
                      <div className="relative flex items-center justify-center w-12 h-12 rounded-full border border-indigo-500/30 bg-gradient-to-tr from-indigo-950 to-indigo-900 font-extrabold font-mono text-sm text-indigo-300 shadow-md shadow-indigo-500/15">
                        <span className="absolute inset-0 rounded-full border border-indigo-400/20 animate-ping opacity-60"></span>
                        <span>{atsScore}%</span>
                      </div>
                    )}
                  </div>

                  {atsFeedback ? (
                    <div className="bg-slate-950/90 rounded-xl border border-slate-850 border-slate-800/80 p-4 text-slate-300 font-mono text-xs max-h-[220px] overflow-y-auto leading-relaxed select-text shadow-inner">
                      <pre className="whitespace-pre-wrap font-mono text-[11px] select-text text-slate-205 text-slate-300">{atsFeedback}</pre>
                    </div>
                  ) : (
                    <div className="bg-slate-950/30 rounded-xl border border-slate-850 p-4 text-[11px] text-slate-400 leading-relaxed font-sans shadow-inner">
                      Ready to calibrate lexical metrics. This engine audits active power verbs, phrase repetition, and missing keywords based on: <span className="text-indigo-300 font-bold">"{resumeData.personalInfo.title || 'selected role'}"</span>.
                    </div>
                  )}

                  <button
                    onClick={runAtsAudit}
                    disabled={isScanningAts}
                    className="w-full h-10 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-450 text-white rounded-xl text-xs font-black tracking-tight transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:shadow-lg hover:shadow-indigo-900/30 hover:-translate-y-0.5 active:translate-y-0"
                    id="btn_ats_checker"
                  >
                    {isScanningAts ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Deep Indexing Keywords...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-indigo-200" /> Audit Resume Compliance
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : activeControlTab === 'styles' ? (
              <DesignSettings 
                settings={designSettings} 
                onChange={handleDesignSettingsChange} 
                onPrint={triggerPrintCV}
                resumeData={resumeData}
                apiStatus={apiStatus}
              />
            ) : (
              <div className="animate-fade-in" id="copilot_viewport_wrapper">
                <AiCopilot
                  data={resumeData}
                  onChange={handleResumeDataChange}
                  apiStatus={apiStatus}
                  atsScore={atsScore}
                  setAtsScore={setAtsScore}
                  atsFeedback={atsFeedback}
                  setAtsFeedback={setAtsFeedback}
                  isScanningAts={isScanningAts}
                  runAtsAudit={runAtsAudit}
                />
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT COLUMN: Real-time lifelike paper CV preview (Spans full page on Print / Conditionally hidden on mobile screens) */}
        <main 
          className={`flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center justify-start print:bg-white print:p-0 print:overflow-visible print:block transition-colors duration-300 ${
            backdropTheme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
          } ${mobileMode === 'view' ? 'flex' : 'hidden lg:flex'}`} 
          style={backdropTheme === 'blueprint' ? {
            backgroundImage: 'radial-gradient(#cbd5e1 0.8px, transparent 0.8px)',
            backgroundSize: '16px 16px'
          } : backdropTheme === 'dark' ? {
            backgroundImage: 'radial-gradient(#334155 0.75px, transparent 0.75px)',
            backgroundSize: '16px 16px'
          } : {}}
          id="right_preview_space"
        >
          <div className="w-full max-w-4xl print:max-w-none print:w-full" id="print_contain_wrapper">
            
            {/* 🖥️ Premium Live Designer HUD Toolbar (Floating Pill) */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl p-3 shadow-md mb-6 print:hidden select-none" id="designer_hud_toolbar">
              
              {/* Scale Zoom Controls */}
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60 font-medium">
                <span className="text-[10.5px] font-bold text-slate-500 mr-1 flex items-center gap-1 font-mono uppercase tracking-wider">
                  <Maximize2 className="w-3.5 h-3.5 text-indigo-600" /> SCALE:
                </span>
                <button 
                  type="button"
                  onClick={() => setZoomScale(Math.max(70, zoomScale - 10))}
                  className="p-1 hover:bg-white rounded border border-slate-200 text-slate-600 hover:text-slate-900 transition disabled:opacity-30 cursor-pointer"
                  disabled={zoomScale <= 70}
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-mono font-bold w-12 text-center text-slate-800">{zoomScale}%</span>
                <button 
                  type="button"
                  onClick={() => setZoomScale(Math.min(120, zoomScale + 10))}
                  className="p-1 hover:bg-white rounded border border-slate-200 text-slate-600 hover:text-slate-900 transition disabled:opacity-30 cursor-pointer"
                  disabled={zoomScale >= 120}
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                {zoomScale !== 100 && (
                  <button 
                    type="button"
                    onClick={() => setZoomScale(100)}
                    className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 hover:bg-indigo-100 transition cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Backdrop Workspace Theme Selector */}
              <div className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-xl border border-slate-200/60">
                <span className="text-[10.5px] font-bold text-slate-500 mr-1 hidden sm:inline uppercase font-mono tracking-wider">desk style:</span>
                <button 
                  type="button"
                  onClick={() => setBackdropTheme('blueprint')}
                  className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg border transition cursor-pointer ${
                    backdropTheme === 'blueprint' 
                      ? 'bg-white border-slate-200 shadow-xs text-indigo-700' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Drafting Grid
                </button>
                <button 
                  type="button"
                  onClick={() => setBackdropTheme('dark')}
                  className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg border transition cursor-pointer ${
                    backdropTheme === 'dark' 
                      ? 'bg-slate-800 border-slate-700 shadow-xs text-indigo-350 text-indigo-300 font-extrabold' 
                      : 'border-transparent text-slate-500 hover:text-slate-400'
                  }`}
                >
                  Carbon Cyber
                </button>
                <button 
                  type="button"
                  onClick={() => setBackdropTheme('clean')}
                  className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg border transition cursor-pointer ${
                    backdropTheme === 'clean' 
                      ? 'bg-white border-slate-200 shadow-xs text-slate-800' 
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Minimal Desk
                </button>
              </div>

              {/* Grid margin checklist helper */}
              <button
                type="button"
                onClick={() => setShowGuidelines(!showGuidelines)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                  showGuidelines 
                    ? 'bg-indigo-600 border-indigo-700 text-white shadow-sm' 
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
                title="Toggles standard page balance guideline overlay lines to verify alignment margins"
              >
                <Grid className="w-4 h-4" />
                <span>Page Grid Guides</span>
                <span className={`text-[9.5px] px-1 py-0.2 rounded font-mono ${showGuidelines ? 'bg-indigo-850 text-indigo-200' : 'bg-slate-255 text-slate-500'}`}>
                  {showGuidelines ? 'ON' : 'OFF'}
                </span>
              </button>

            </div>

            {/* Quick floating reminder banner over preview */}
            <div className="flex justify-between items-center text-xs text-slate-500 mb-4 px-1 shrink-0 print:hidden select-none">
              <span className="flex items-center gap-1.5 font-medium">
                <BookOpen className="w-4 h-4 text-indigo-600 animate-pulse" />
                Real-Time Document Layout Monitor
              </span>
              <button 
                type="button"
                onClick={() => setShowExportModal(true)}
                className="text-xs text-indigo-600 hover:text-indigo-850 hover:underline font-bold flex items-center gap-1 cursor-pointer bg-white px-2.5 py-1 rounded-lg border border-slate-200/60 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-indigo-600" /> Download as PDF / Print
              </button>
            </div>

            {/* Print paper mockup target with precision zoom scaling styles */}
            <div 
              className={`print:block print:scale-100 print:transform-none transition-transform duration-300 ease-out origin-top relative`}
              style={{ 
                transform: zoomScale !== 100 ? `scale(${zoomScale / 100})` : 'none',
                marginBottom: zoomScale < 100 ? `-${(100 - zoomScale) * 3.5}%` : '0px'
              }}
              id="paper_mockup_container"
            >
              <ResumePreview data={resumeData} settings={designSettings} />
              
              {/* Optional blueprint Safe Area Overlays */}
              {showGuidelines && (
                <div className="absolute inset-0 border border-indigo-500/10 pointer-events-none select-none print:hidden rounded" id="guidelines_layout_layer">
                  {/* Left safe line */}
                  <div className="absolute top-0 bottom-0 left-[7%] border-l border-dashed border-indigo-500/25"></div>
                  {/* Right safe line */}
                  <div className="absolute top-0 bottom-0 right-[7%] border-r border-dashed border-indigo-500/25"></div>
                  {/* Top safe line */}
                  <div className="absolute left-0 right-0 top-[5%] border-t border-dashed border-red-500/25 text-[8px] font-mono text-red-500/60 p-1">0.75" safe top margin bounds</div>
                  {/* Bottom safe line */}
                  <div className="absolute left-0 right-0 bottom-[5%] border-b border-dashed border-red-500/25 text-[8px] font-mono text-red-500/60 p-1 text-right">0.75" safe bottom margin bounds</div>
                  {/* Vertical splits guides */}
                  <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-indigo-500/10"></div>
                </div>
              )}
            </div>
          </div>
        </main>

      </div>

      {/* 3. Interactive PRO PDF Export & Data Backup Center Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in" id="pdf_export_modal_wrapper">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up" id="pdf_export_modal_content">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center select-none">
              <div className="flex items-center gap-2.5">
                <Download className="w-5 h-5 text-indigo-400 animate-bounce" />
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider">PRO PDF Export & Backup Center</h2>
                  <p className="text-[10px] text-slate-405 text-slate-400">Secure high-precision document extraction parameters</p>
                </div>
              </div>
              <button 
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition cursor-pointer"
                title="Close overlay"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto text-slate-700">
              
              {/* Core Actions Panel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* PDF Action */}
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-5 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                      <Printer className="w-4 h-4 text-indigo-600" />
                      1. Extract Print-Ready PDF
                    </h3>
                    <p className="text-[11px] text-indigo-950/70 leading-relaxed mt-1">
                      Extracts your designed resume sheet directly as a pixel-perfect, ATS-compliant PDF document through the browser.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowExportModal(false);
                      setTimeout(() => triggerPrintCV(), 150);
                    }}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Save / Download PDF file
                  </button>
                </div>

                {/* Offline Backup Action */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-850 flex items-center gap-1.5">
                      <FileCode className="w-4 h-4 text-slate-650" />
                      2. Cloud Offline Backup
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                      Download your data as a secure backup file. Drag and upload it later to restore all fields in seconds.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={downloadJsonBackup}
                      className="py-2.5 border border-slate-300 hover:border-slate-450 hover:bg-slate-100 rounded text-slate-750 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      title="Save offline resume data dictionary"
                    >
                      <Download className="w-3.5 h-3.5" /> Save Data
                    </button>
                    <label className="py-2.5 border border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/20 rounded text-slate-650 text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer text-center">
                      <FileCode className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                      <span>Upload Data</span>
                      <input 
                        type="file" 
                        accept=".json" 
                        className="hidden" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const parsed = JSON.parse(event.target?.result as string);
                              if (parsed && parsed.personalInfo && parsed.workExperience) {
                                handleResumeDataChange(parsed);
                                alert("Resume profile backup loaded successfully!");
                                setShowExportModal(false);
                              } else {
                                alert("Error: Selected JSON is not a valid CV Architect dataset.");
                              }
                            } catch (err) {
                              alert("Error parsing backup JSON file: formatting error.");
                            }
                          };
                          reader.readAsText(file);
                        }}
                      />
                    </label>
                  </div>
                </div>

              </div>

              {/* PDF Settings Calibration Checklists */}
              <div className="border border-slate-200 rounded-lg overflow-hidden shrink-0">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-xs font-black text-slate-800 uppercase tracking-wider select-none">
                  🔐 Required Web Browser Printing Configuration Calibration
                </div>
                <div className="p-4 space-y-3.5 text-xs text-slate-600">
                  <p className="leading-relaxed font-sans">
                    To guarantee that the dynamically exported PDF exactly matches the live responsive preview dimensions, please adjust these settings in your safe print dialog:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 font-medium">
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center font-mono text-[9px] font-bold shrink-0 mt-0.5">1</span>
                      <div>
                        <strong className="text-slate-850">Margins</strong>: Set to <span className="bg-slate-100 text-slate-800 font-mono px-1 border border-slate-200 rounded text-[11px]">None</span>
                        <p className="text-[10px] text-slate-450 text-slate-500">Removes empty border space, printing to exact sheet edge.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center font-mono text-[9px] font-bold shrink-0 mt-0.5">2</span>
                      <div>
                        <strong className="text-slate-850">Background Graphics</strong>: <span className="bg-slate-100 text-emerald-700 font-mono px-1 border border-slate-200 rounded text-[11px]">Enabled / Checked</span>
                        <p className="text-[10px] text-slate-550 text-slate-500">Preserves subtle background templates and divider accent colors.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center font-mono text-[9px] font-bold shrink-0 mt-0.5">3</span>
                      <div>
                        <strong className="text-slate-850">Headers & Footers</strong>: <span className="bg-slate-100 text-red-700 font-mono px-1 border border-slate-200 rounded text-[11px]">Disabled / Unchecked</span>
                        <p className="text-[10px] text-slate-550 text-slate-500">Hides browser printed headers, footers, website URLs, and date stamps.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center justify-center font-mono text-[9px] font-bold shrink-0 mt-0.5">4</span>
                      <div>
                        <strong className="text-slate-850">Paper Size</strong>: Set to <strong className="text-slate-800">A4 or Letter</strong>
                        <p className="text-[10px] text-slate-550 text-slate-500">Aligns printable paper scale matching responsive workspace ratios.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
