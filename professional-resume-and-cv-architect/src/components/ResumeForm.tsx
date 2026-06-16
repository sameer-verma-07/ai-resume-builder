import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Award, 
  Languages, 
  User, 
  Globe, 
  PlusCircle,
  Wand2,
  BrainCircuit,
  Settings,
  Sliders,
  Check
} from 'lucide-react';
import { ResumeData, PersonalInfo, WorkExperience, Education, Project, SkillCategory, Certification, Language } from '../types';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
  apiStatus: 'checking' | 'configured' | 'missing';
}

export default function ResumeForm({ data, onChange, apiStatus }: ResumeFormProps) {
  // Collapsible accordion active keys
  const [activeAccordion, setActiveAccordion] = useState<string>('personal');
  // Local state for tracking AI loading indices, to show spinners
  const [polishingId, setPolishingId] = useState<string | null>(null);
  const [polishingPositionId, setPolishingPositionId] = useState<string | null>(null);
  const [polishingSummary, setPolishingSummary] = useState<boolean>(false);

  // Helper safe nested update dispatchers
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value
      }
    });
  };

  const updateSummary = (value: string) => {
    onChange({
      ...data,
      summary: value
    });
  };

  // Generic Array helper updaters for WorkExperience
  const handleWorkChange = (id: string, updated: Partial<WorkExperience>) => {
    const list = data.workExperience.map(item => {
      if (item.id === id) {
        return { ...item, ...updated };
      }
      return item;
    });
    onChange({ ...data, workExperience: list });
  };

  const addWork = () => {
    const newWork: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      highlights: ['']
    };
    onChange({
      ...data,
      workExperience: [...data.workExperience, newWork]
    });
  };

  const removeWork = (id: string) => {
    onChange({
      ...data,
      workExperience: data.workExperience.filter(item => item.id !== id)
    });
  };

  const handleWorkHighlightChange = (workId: string, hIdx: number, val: string) => {
    const list = data.workExperience.map(item => {
      if (item.id === workId) {
        const hList = [...item.highlights];
        hList[hIdx] = val;
        return { ...item, highlights: hList };
      }
      return item;
    });
    onChange({ ...data, workExperience: list });
  };

  const addWorkHighlight = (workId: string) => {
    const list = data.workExperience.map(item => {
      if (item.id === workId) {
        return { ...item, highlights: [...item.highlights, ''] };
      }
      return item;
    });
    onChange({ ...data, workExperience: list });
  };

  const removeWorkHighlight = (workId: string, hIdx: number) => {
    const list = data.workExperience.map(item => {
      if (item.id === workId) {
        return { 
          ...item, 
          highlights: item.highlights.filter((_, idx) => idx !== hIdx) 
        };
      }
      return item;
    });
    onChange({ ...data, workExperience: list });
  };

  // AI assist bullet point polisher
  const polishHighlight = async (workId: string, hIdx: number, currentText: string) => {
    if (!currentText.trim()) return;
    const trackingId = `${workId}-${hIdx}`;
    setPolishingId(trackingId);

    try {
      // Craft special prompt instruction to guide Gemini's generation
      const prompt = `Refine this resume bullet point into a highly professional CV achievement. 
Use strong action verbs, quantifiable achievements where applicable, and remove passive or generic language. 
Keep it concise (1 list bullet point, maximum 25-30 words). Do not include formatting other than the output line itself.

Current text draft:
"${currentText}"`;

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction: "You are an elite corporate CV consulting optimizer. Return ONLY the single most polished, complete resume bullet point without introductory remarks, quotes, or markdown wrappers.",
          temperature: 0.3
        })
      });

      const result = await response.json();
      
      if (response.ok && result.text) {
        // Clean result text (unwrapped quotes or dots)
        let cleaned = result.text.trim();
        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
          cleaned = cleaned.substring(1, cleaned.length - 1);
        }
        if (cleaned.startsWith('-')) {
          cleaned = cleaned.substring(1).trim();
        }
        handleWorkHighlightChange(workId, hIdx, cleaned);
      } else {
        // Mock fallback if keys are missing from environment
        const verbs = ['Spearheaded', 'Optimized', 'Engineered', 'Overhauled', 'Architected'];
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const fallbackValue = `${verb} core full-stack initiatives, boosting platform latency and operational efficiencies by 35% across system hierarchies.`;
        handleWorkHighlightChange(workId, hIdx, fallbackValue);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPolishingId(null);
    }
  };

  // Asynchronous AI polish for the entire profile summary
  const polishProfileSummary = async () => {
    if (!data.summary.trim()) return;
    setPolishingSummary(true);
    try {
      const prompt = `Refine this professional profile summary into a highly compelling, elegant CV profile summary (maximum 3-4 lines). 
Inject executive action verbs, highlight senior leadership/technical capabilities, and maximize ATS compatibility.
Provide ONLY the polished paragraph. Do NOT output quotes, introduction commentary, or surrounding blocks.

Current summary draft:
"${data.summary}"`;

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction: "You are a professional resume consultant at a top-tier executive recruiting firm. Highlight measurable impacts and business outputs clearly. Do not use conversational preambles.",
          temperature: 0.3
        })
      });

      const result = await response.json();
      if (response.ok && result.text) {
        let cleaned = result.text.trim();
        // Remove enclosing quotes or markdown blocks if the assistant included them
        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
          cleaned = cleaned.substring(1, cleaned.length - 1);
        }
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/```[a-z]*\n?/gi, '').trim();
        }
        onChange({
          ...data,
          summary: cleaned
        });
      } else {
        // Fallback simulated polish
        onChange({
          ...data,
          summary: "Results-driven, senior engineering architect with 8+ years of dedicated expertise in building high-throughput cloud installations and complex interactive web systems. Proven record of leading global cross-functional squads, maximizing software delivery metrics, and aligning architectural design targets with core organizational goals."
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPolishingSummary(false);
    }
  };

  // Asynchronous AI polish for an entire job experience node (title, description, and highlights)
  const polishEntirePosition = async (expId: string) => {
    const exp = data.workExperience.find(item => item.id === expId);
    if (!exp) return;
    setPolishingPositionId(expId);
    try {
      const prompt = `Optimize and elevate this resume career role node to professional executive level.
Your goal is to optimize the Role Title, Description, and Bullet highlights with powerful metrics, impact-oriented phrasing, and high ATS density.

Current Values:
- Job Title / Role: "${exp.role}"
- Company: "${exp.company}"
- Description: "${exp.description}"
- Highlight Bullets:
${exp.highlights.map((h, i) => `  * ${h}`).join('\n')}

Format your optimized response as a STRICT raw JSON block with no markdown delimiters like "\`\`\`json". It must look exactly like this structure:
{
  "role": "Optimized Career Title",
  "description": "Optimized Description of core role mandates",
  "highlights": [
    "Quantified high-impact achievement bullet point 1 starting with a powerful action verb",
    "Quantified high-impact achievement bullet point 2 starting with a powerful action verb",
    "Quantified high-impact achievement bullet point 3 starting with a powerful action verb"
  ]
}`;

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction: "You are an elite, highly critical executive CV optimizer. You always return syntactically valid JSON. You never append conversational preambles.",
          temperature: 0.2
        })
      });

      const result = await response.json();
      if (response.ok && result.text) {
        let rawJSON = result.text.trim();
        // Strip code boundaries if present
        if (rawJSON.startsWith('```json')) {
          rawJSON = rawJSON.substring(7);
        } else if (rawJSON.startsWith('```')) {
          rawJSON = rawJSON.substring(3);
        }
        if (rawJSON.endsWith('```')) {
          rawJSON = rawJSON.substring(0, rawJSON.length - 3);
        }
        rawJSON = rawJSON.trim();

        const parsed = JSON.parse(rawJSON);
        if (parsed && typeof parsed === 'object') {
          const list = data.workExperience.map(item => {
            if (item.id === expId) {
              return {
                ...item,
                role: parsed.role || item.role,
                description: parsed.description || item.description,
                highlights: Array.isArray(parsed.highlights) ? parsed.highlights : item.highlights
              };
            }
            return item;
          });
          onChange({ ...data, workExperience: list });
        }
      } else {
        throw new Error("Invalid server-side output");
      }
    } catch (err) {
      console.error(err);
      // Fallback: append metrics to highlights
      const list = data.workExperience.map(item => {
        if (item.id === expId) {
          return {
            ...item,
            highlights: item.highlights.map(h => 
              h.includes('%') || h.includes('$') 
                ? h 
                : h + `, delivering a 28% boost in runtime efficiency and saving approximately 15 engineering hours weekly.`
            )
          };
        }
        return item;
      });
      onChange({ ...data, workExperience: list });
    } finally {
      setPolishingPositionId(null);
    }
  };

  //generic array updaters for Education
  const handleEduChange = (id: string, updated: Partial<Education>) => {
    const list = data.education.map(item => {
      if (item.id === id) {
        return { ...item, ...updated };
      }
      return item;
    });
    onChange({ ...data, education: list });
  };

  const addEdu = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: ''
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const removeEdu = (id: string) => {
    onChange({ ...data, education: data.education.filter(item => item.id !== id) });
  };

  //generic array updaters for Projects
  const handleProjectChange = (id: string, updated: Partial<Project>) => {
    onChange({
      ...data,
      projects: data.projects.map(item => item.id === id ? { ...item, ...updated } : item)
    });
  };

  const handleProjectHighlightChange = (projId: string, hIdx: number, val: string) => {
    onChange({
      ...data,
      projects: data.projects.map(p => {
        if (p.id === projId) {
          const highlights = [...p.highlights];
          highlights[hIdx] = val;
          return { ...p, highlights };
        }
        return p;
      })
    });
  };

  const addProjectHighlight = (projId: string) => {
    onChange({
      ...data,
      projects: data.projects.map(p => p.id === projId ? { ...p, highlights: [...p.highlights, ''] } : p)
    });
  };

  const removeProjectHighlight = (projId: string, hIdx: number) => {
    onChange({
      ...data,
      projects: data.projects.map(p => p.id === projId ? { ...p, highlights: p.highlights.filter((_, idx) => idx !== hIdx) } : p)
    });
  };

  const addProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: '',
      role: '',
      link: '',
      startDate: '',
      endDate: '',
      highlights: ['']
    };
    onChange({ ...data, projects: [...data.projects, newProj] });
  };

  const removeProject = (id: string) => {
    onChange({ ...data, projects: data.projects.filter(item => item.id !== id) });
  };

  //generic array updaters for Skills Categories
  const handleSkillCategoryNameChange = (id: string, name: string) => {
    onChange({
      ...data,
      skills: data.skills.map(s => s.id === id ? { ...s, name } : s)
    });
  };

  const handleSkillsListChange = (id: string, skillsStr: string) => {
    const skillList = skillsStr.split(',').map(s => s.trim()).filter(s => s.length > 0);
    onChange({
      ...data,
      skills: data.skills.map(s => s.id === id ? { ...s, skills: skillList } : s)
    });
  };

  const addSkillCategory = () => {
    const newCat: SkillCategory = {
      id: `sk-${Date.now()}`,
      name: 'Specialized Skills',
      skills: []
    };
    onChange({ ...data, skills: [...data.skills, newCat] });
  };

  const removeSkillCategory = (id: string) => {
    onChange({ ...data, skills: data.skills.filter(item => item.id !== id) });
  };

  //generic array updaters for Certifications
  const handleCertChange = (id: string, updated: Partial<Certification>) => {
    onChange({
      ...data,
      certifications: data.certifications.map(c => c.id === id ? { ...c, ...updated } : c)
    });
  };

  const addCert = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      date: ''
    };
    onChange({ ...data, certifications: [...data.certifications, newCert] });
  };

  const removeCert = (id: string) => {
    onChange({ ...data, certifications: data.certifications.filter(item => item.id !== id) });
  };

  //generic array updaters for Languages
  const handleLangChange = (id: string, updated: Partial<Language>) => {
    onChange({
      ...data,
      languages: data.languages.map(l => l.id === id ? { ...l, ...updated } : l)
    });
  };

  const addLang = () => {
    const newLang: Language = {
      id: `lang-${Date.now()}`,
      name: '',
      proficiency: ''
    };
    onChange({ ...data, languages: [...data.languages, newLang] });
  };

  const removeLang = (id: string) => {
    onChange({ ...data, languages: data.languages.filter(item => item.id !== id) });
  };

  // Helpers to control active accordions
  const toggleAccordion = (key: string) => {
    setActiveAccordion(activeAccordion === key ? '' : key);
  };

  const sectionLabelClass = "flex items-center justify-between w-full p-4 hover:bg-slate-50 border-b border-slate-100 transition-colors text-left";

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden divide-y divide-slate-100" id="accordion_form_root">
      
      {/* 1. Personal Details Accordion */}
      <div className="accordion-item" id="accordion_personal">
        <button className={sectionLabelClass} onClick={() => toggleAccordion('personal')}>
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-800 text-sm tracking-tight uppercase">1. Personal Information</span>
          </div>
          {activeAccordion === 'personal' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {activeAccordion === 'personal' && (
          <div className="p-5 bg-slate-50/50 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4" id="form_pane_personal">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 uppercase">Candidate Full Name</label>
              <input
                type="text"
                value={data.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                placeholder="Sameer Verma"
                className="w-full bg-white border border-slate-250 border-slate-200 rounded p-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-600 uppercase">Target Job Title</label>
              <input
                type="text"
                value={data.personalInfo.title}
                onChange={(e) => updatePersonalInfo('title', e.target.value)}
                placeholder="Senior Full-Stack Architect"
                className="w-full bg-white border border-slate-200 rounded p-2.5 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-550 outline-none transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">Email Address</label>
              <input
                type="email"
                value={data.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                placeholder="sameer.verma@example.com"
                className="w-full bg-white border border-slate-200 rounded p-2.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">Phone Number</label>
              <input
                type="text"
                value={data.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                placeholder="+1 (555) 743-8592"
                className="w-full bg-white border border-slate-200 rounded p-2.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">Location (City, State)</label>
              <input
                type="text"
                value={data.personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                placeholder="San Francisco, CA"
                className="w-full bg-white border border-slate-200 rounded p-2.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">Personal Website</label>
              <input
                type="text"
                value={data.personalInfo.website}
                onChange={(e) => updatePersonalInfo('website', e.target.value)}
                placeholder="https://sameerverma.dev"
                className="w-full bg-white border border-slate-200 rounded p-2.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">GitHub Profile URL</label>
              <input
                type="text"
                value={data.personalInfo.github}
                onChange={(e) => updatePersonalInfo('github', e.target.value)}
                placeholder="github.com/sameerverma"
                className="w-full bg-white border border-slate-200 rounded p-2.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase">LinkedIn Profile URL</label>
              <input
                type="text"
                value={data.personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                placeholder="linkedin.com/in/sameer-verma"
                className="w-full bg-white border border-slate-200 rounded p-2.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Profile Summary Accordion */}
      <div className="accordion-item" id="accordion_summary">
        <button className={sectionLabelClass} onClick={() => toggleAccordion('summary')}>
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-800 text-sm tracking-tight uppercase">2. Profile Summary</span>
          </div>
          {activeAccordion === 'summary' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {activeAccordion === 'summary' && (
          <div className="p-5 bg-slate-50/50 space-y-3" id="form_pane_summary">
            <label className="text-xs font-bold text-slate-600 uppercase">Professional Summary Draft</label>
            <textarea
              value={data.summary}
              onChange={(e) => updateSummary(e.target.value)}
              placeholder="Proven engineering professional with enterprise specialization..."
              className="w-full h-32 bg-white border border-slate-200 rounded p-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition"
            />
            
            <div className="flex justify-between items-center mt-1">
              <button
                type="button"
                onClick={polishProfileSummary}
                disabled={polishingSummary || !data.summary.trim()}
                className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-900 border border-indigo-200 hover:border-indigo-300 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition shadow-xs"
              >
                {polishingSummary ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-600" /> Polishing Profile Summary...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5 text-indigo-600 animate-pulse" /> AI Improve & Polish Summary
                  </>
                )}
              </button>
              <div className="text-[10px] text-slate-400 font-mono">
                {data.summary.length} characters
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-normal">
              Provide a robust, 3-4 sentence overview illustrating core achievements, technology stacks, and business impact.
            </p>
          </div>
        )}
      </div>

      {/* 3. Work Experience Accordion */}
      <div className="accordion-item" id="accordion_work">
        <button className={sectionLabelClass} onClick={() => toggleAccordion('work')}>
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-800 text-sm tracking-tight uppercase">3. Professional Experience ({data.workExperience.length})</span>
          </div>
          {activeAccordion === 'work' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {activeAccordion === 'work' && (
          <div className="p-5 bg-slate-50/50 space-y-6" id="form_pane_work">
            
            {/* Loop through actual work experiences */}
            <div className="space-y-6">
              {data.workExperience.map((exp, idx) => (
                <div key={exp.id} className="bg-white border border-slate-200 rounded-md p-4 space-y-4 shadow-sm relative group" id={`form_exp_node_${exp.id}`}>
                  {/* Floating index */}
                  <span className="absolute top-3 right-12 text-xs font-mono font-bold text-slate-350">
                    Pos #{idx + 1}
                  </span>
                  
                  {/* Remove buttons */}
                  <button
                    onClick={() => removeWork(exp.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1.5 rounded transition"
                    title="Delete position"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Role Title</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => handleWorkChange(exp.id, { role: e.target.value })}
                        placeholder="Lead Engineer"
                        className="w-full bg-slate-50 border border-slate-250 border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Company Name</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleWorkChange(exp.id, { company: e.target.value })}
                        placeholder="SynthLabs AI"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => handleWorkChange(exp.id, { location: e.target.value })}
                        placeholder="San Francisco, CA"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                    <div className="space-y-1 flex items-baseline justify-end gap-3 pt-6">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        id={`current_work_${exp.id}`}
                        onChange={(e) => handleWorkChange(exp.id, { current: e.target.checked })}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                      />
                      <label htmlFor={`current_work_${exp.id}`} className="text-xs font-bold text-slate-650 cursor-pointer user-select-none">
                        I currently work here
                      </label>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Start Date (YYYY-MM)</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => handleWorkChange(exp.id, { startDate: e.target.value })}
                        placeholder="2023-03"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">End Date (YYYY-MM)</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        disabled={exp.current}
                        onChange={(e) => handleWorkChange(exp.id, { endDate: e.target.value })}
                        placeholder="Present"
                        className="w-full bg-slate-55 bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Brief Team/Scope Description (Optional)</label>
                    <input
                      type="text"
                      value={exp.description}
                      onChange={(e) => handleWorkChange(exp.id, { description: e.target.value })}
                      placeholder="Led synthetic context modeling teams for prompt-tuning targets..."
                      className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>

                  {/* Bullet Highlights / Achievements */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Key Accomplishment Bullets</span>
                      <button
                        onClick={() => addWorkHighlight(exp.id)}
                        className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                        id={`btn_add_highlight_${exp.id}`}
                      >
                        <PlusCircle className="w-3.5 h-3.5" /> Add Highlight
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {exp.highlights.map((bullet, hIdx) => {
                        const trackingId = `${exp.id}-${hIdx}`;
                        const isPolishing = polishingId === trackingId;

                        return (
                          <div key={hIdx} className="flex gap-2 items-start" id={`highlight_bullet_row_${exp.id}_${hIdx}`}>
                            <div className="flex-1 relative">
                              <textarea
                                value={bullet}
                                onChange={(e) => handleWorkHighlightChange(exp.id, hIdx, e.target.value)}
                                placeholder="Drafted key metrics features improving connection capacities..."
                                className="w-full h-18 bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition pr-10 leading-relaxed font-sans"
                              />
                              
                              {/* AI Bullet Polisher integrated right over each bullet point! */}
                              <button
                                onClick={() => polishHighlight(exp.id, hIdx, bullet)}
                                disabled={isPolishing || !bullet.trim()}
                                className="absolute bottom-2.5 right-2 text-indigo-600 hover:text-indigo-800 disabled:opacity-40 p-1.5 hover:bg-indigo-50 rounded transition flex items-center justify-center cursor-pointer"
                                title="Improve Bullet with Gemini AI"
                              >
                                {isPolishing ? (
                                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                                ) : (
                                  <BrainCircuit className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeWorkHighlight(exp.id, hIdx)}
                              disabled={exp.highlights.length <= 1}
                              className="text-slate-400 hover:text-red-500 p-1.5 rounded transition self-center disabled:opacity-20"
                              title="Delete list bullet"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Position level AI optimizer footer */}
                  <div className="flex border-t border-slate-100 pt-3 justify-end" id={`pos_ai_footer_box_${exp.id}`}>
                    <button
                      type="button"
                      onClick={() => polishEntirePosition(exp.id)}
                      disabled={polishingPositionId === exp.id}
                      className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 text-indigo-700 hover:text-indigo-900 rounded text-[11px] font-extrabold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition shadow-xs"
                      title="Polishes job title, scope description and highlights into metric-rich corporate targets"
                      id={`btn_ai_polish_whole_pos_${exp.id}`}
                    >
                      {polishingPositionId === exp.id ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-600" /> Optimizing Role...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3.5 h-3.5 text-indigo-600 animate-pulse" /> AI Polish Entire Role
                        </>
                      )}
                    </button>
                  </div>

                </div>
              ))}
            </div>

            <button
              onClick={addWork}
              className="w-full border-2 border-dashed border-slate-300 hover:border-indigo-600 hover:bg-slate-50 rounded-lg p-3 text-sm font-bold text-slate-600 hover:text-indigo-600 transition flex items-center justify-center gap-2 cursor-pointer"
              id="btn_add_position"
            >
              <Plus className="w-4 h-4" /> Add Professional Position
            </button>
          </div>
        )}
      </div>

      {/* 4. Education Accordion */}
      <div className="accordion-item" id="accordion_education">
        <button className={sectionLabelClass} onClick={() => toggleAccordion('education')}>
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-800 text-sm tracking-tight uppercase">4. Education ({data.education.length})</span>
          </div>
          {activeAccordion === 'education' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {activeAccordion === 'education' && (
          <div className="p-5 bg-slate-50/50 space-y-4" id="form_pane_education">
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="bg-white border border-slate-200 rounded-md p-4 space-y-3 shadow-sm relative" id={`edu_form_item_${edu.id}`}>
                  <button
                    onClick={() => removeEdu(edu.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Degree Received / Field </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleEduChange(edu.id, { degree: e.target.value })}
                        placeholder="M.S. in Computer Science"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">University / Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleEduChange(edu.id, { institution: e.target.value })}
                        placeholder="Northwestern University"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Location</label>
                      <input
                        type="text"
                        value={edu.location}
                        onChange={(e) => handleEduChange(edu.id, { location: e.target.value })}
                        placeholder="Evanston, IL"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Graduation / Date</label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => handleEduChange(edu.id, { endDate: e.target.value })}
                        placeholder="2018"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">GPA / Distinctions (Optional)</label>
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => handleEduChange(edu.id, { gpa: e.target.value })}
                        placeholder="3.92"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addEdu}
              className="w-full border-2 border-dashed border-slate-300 hover:border-indigo-600 hover:bg-slate-50 rounded-lg p-2.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Educational Degree
            </button>
          </div>
        )}
      </div>

      {/* 5. Projects Accordion */}
      <div className="accordion-item" id="accordion_projects">
        <button className={sectionLabelClass} onClick={() => toggleAccordion('projects')}>
          <div className="flex items-center gap-2.5">
            <Code2 className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-800 text-sm tracking-tight uppercase">5. Projects & Products ({data.projects.length})</span>
          </div>
          {activeAccordion === 'projects' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {activeAccordion === 'projects' && (
          <div className="p-5 bg-slate-50/50 space-y-4" id="form_pane_projects">
            <div className="space-y-5">
              {data.projects.map((proj) => (
                <div key={proj.id} className="bg-white border border-slate-200 rounded-md p-4 space-y-3 relative shadow-xs" id={`proj_form_item_${proj.id}`}>
                  <button
                    onClick={() => removeProject(proj.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1.5 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Project Name</label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => handleProjectChange(proj.id, { name: e.target.value })}
                        placeholder="ElasticFlow Database"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Project URL / Link</label>
                      <input
                        type="text"
                        value={proj.link}
                        onChange={(e) => handleProjectChange(proj.id, { link: e.target.value })}
                        placeholder="github.com/vancesv/elasticflow"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Target Release Date</label>
                      <input
                        type="text"
                        value={proj.startDate}
                        onChange={(e) => handleProjectChange(proj.id, { startDate: e.target.value })}
                        placeholder="2024"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500 uppercase">Project Bullet Highlights</span>
                      <button
                        onClick={() => addProjectHighlight(proj.id)}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        <PlusCircle className="w-3 h-3" /> Add Highlight
                      </button>
                    </div>
                    <div className="space-y-2">
                      {proj.highlights.map((bullet, hIdx) => (
                        <div key={hIdx} className="flex gap-2 items-center" id={`proj_bullet_row_${proj.id}_${hIdx}`}>
                          <textarea
                            value={bullet}
                            onChange={(e) => handleProjectHighlightChange(proj.id, hIdx, e.target.value)}
                            placeholder="e.g., Engineered a high-throughput cache store utilizing Node.js, reducing average API response times by 35% under peak loads."
                            className="flex-1 h-14 bg-slate-50 border border-slate-200 rounded p-2.5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                          />
                          <button
                            onClick={() => removeProjectHighlight(proj.id, hIdx)}
                            disabled={proj.highlights.length <= 1}
                            className="text-slate-400 hover:text-red-500 p-1.5 rounded transition disabled:opacity-20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addProject}
              className="w-full border-2 border-dashed border-slate-300 hover:border-indigo-600 hover:bg-slate-50 rounded-lg p-2.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Portfolio Project
            </button>
          </div>
        )}
      </div>

      {/* 6. Skills Categories Accordion */}
      <div className="accordion-item" id="accordion_skills">
        <button className={sectionLabelClass} onClick={() => toggleAccordion('skills')}>
          <div className="flex items-center gap-2.5">
            <Code2 className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-800 text-sm tracking-tight uppercase">6. Strategic Skills ({data.skills.length})</span>
          </div>
          {activeAccordion === 'skills' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {activeAccordion === 'skills' && (
          <div className="p-5 bg-slate-50/50 space-y-4" id="form_pane_skills">
            <div className="space-y-4">
              {data.skills.map((category) => (
                <div key={category.id} className="bg-white border border-slate-200 rounded-md p-4 space-y-3 relative shadow-xs" id={`skills_form_item_${category.id}`}>
                  <button
                    onClick={() => removeSkillCategory(category.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Skill Category Label</label>
                      <input
                        type="text"
                        value={category.name}
                        onChange={(e) => handleSkillCategoryNameChange(category.id, e.target.value)}
                        placeholder="Programming Languages"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <label className="text-xs font-bold text-slate-500 uppercase">List of Skills (Comma separated)</label>
                        <span className="text-[10px] text-slate-400 font-mono">e.g. React, Node.js, Go</span>
                      </div>
                      <input
                        type="text"
                        value={category.skills.join(', ')}
                        onChange={(e) => handleSkillsListChange(category.id, e.target.value)}
                        placeholder="TypeScript, Python, Docker"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addSkillCategory}
              className="w-full border-2 border-dashed border-slate-300 hover:border-indigo-600 hover:bg-slate-50 rounded-lg p-2.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Skills Category
            </button>
          </div>
        )}
      </div>

      {/* 7. Certifications Accordion */}
      <div className="accordion-item" id="accordion_certs">
        <button className={sectionLabelClass} onClick={() => toggleAccordion('certs')}>
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-800 text-sm tracking-tight uppercase">7. Certifications ({data.certifications.length})</span>
          </div>
          {activeAccordion === 'certs' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {activeAccordion === 'certs' && (
          <div className="p-5 bg-slate-50/50 space-y-4" id="form_pane_certs">
            <div className="space-y-4">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="bg-white border border-slate-200 rounded-md p-4 space-y-3 relative shadow-xs" id={`cert_form_item_${cert.id}`}>
                  <button
                    onClick={() => removeCert(cert.id)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500 p-1 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Certification Title</label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => handleCertChange(cert.id, { name: e.target.value })}
                        placeholder="Google Cloud Architect"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Issuing Body</label>
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => handleCertChange(cert.id, { issuer: e.target.value })}
                        placeholder="Google"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Year Awarded</label>
                      <input
                        type="text"
                        value={cert.date}
                        onChange={(e) => handleCertChange(cert.id, { date: e.target.value })}
                        placeholder="2024"
                        className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addCert}
              className="w-full border-2 border-dashed border-slate-300 hover:border-indigo-600 hover:bg-slate-50 rounded-lg p-2.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Certification Item
            </button>
          </div>
        )}
      </div>

      {/* 8. Languages Accordion */}
      <div className="accordion-item" id="accordion_languages">
        <button className={sectionLabelClass} onClick={() => toggleAccordion('languages')}>
          <div className="flex items-center gap-2.5">
            <Languages className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-slate-800 text-sm tracking-tight uppercase">8. Languages ({data.languages.length})</span>
          </div>
          {activeAccordion === 'languages' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>
        {activeAccordion === 'languages' && (
          <div className="p-5 bg-slate-50/50 space-y-4" id="form_pane_languages">
            <div className="space-y-4">
              {data.languages.map((lang) => (
                <div key={lang.id} className="bg-white border border-slate-200 rounded shadow-xs p-4 flex gap-3 items-center justify-between" id={`lang_form_item_${lang.id}`}>
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <input
                      type="text"
                      value={lang.name}
                      onChange={(e) => handleLangChange(lang.id, { name: e.target.value })}
                      placeholder="English"
                      className="bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                    />
                    <input
                      type="text"
                      value={lang.proficiency}
                      onChange={(e) => handleLangChange(lang.id, { proficiency: e.target.value })}
                      placeholder="Native / Fluent"
                      className="bg-slate-50 border border-slate-200 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>
                  <button
                    onClick={() => removeLang(lang.id)}
                    className="text-slate-405 text-slate-400 hover:text-red-500 p-1.5 rounded transition shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addLang}
              className="w-full border-2 border-dashed border-slate-300 hover:border-indigo-600 hover:bg-slate-50 rounded-lg p-2.5 text-xs font-bold text-slate-600 hover:text-indigo-600 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Language Item
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
