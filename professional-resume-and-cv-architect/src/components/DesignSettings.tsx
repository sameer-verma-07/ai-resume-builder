import { 
  Sliders, 
  Palette, 
  Type, 
  Layout, 
  Grid, 
  FileText, 
  Settings, 
  Printer, 
  Sparkles,
  Info
} from 'lucide-react';
import { DesignSettings as SettingsType, ThemeAccent, FontPreset, SpacingPreset, LayoutTemplate } from '../types';

interface DesignSettingsProps {
  settings: SettingsType;
  onChange: (newSettings: SettingsType) => void;
  onPrint: () => void;
  resumeData?: any; // To allow AI model guidance
  apiStatus: 'checking' | 'configured' | 'missing';
}

export default function DesignSettings({ settings, onChange, onPrint, resumeData, apiStatus }: DesignSettingsProps) {

  const updateSetting = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
    onChange({
      ...settings,
      [key]: value
    });
  };

  // Color options
  const accents: { id: ThemeAccent; label: string; color: string }[] = [
    { id: 'indigo', label: 'Indigo', color: 'bg-indigo-600' },
    { id: 'emerald', label: 'Emerald', color: 'bg-emerald-600' },
    { id: 'slate', label: 'Slate Gray', color: 'bg-slate-700' },
    { id: 'crimson', label: 'Crimson', color: 'bg-rose-600' },
    { id: 'sky', label: 'Sky Blue', color: 'bg-sky-500' },
    { id: 'amber', label: 'Amber Gold', color: 'bg-amber-600' },
    { id: 'neutral', label: 'Classic Noir', color: 'bg-slate-900 border border-slate-350' },
    { id: 'sage', label: 'Earthy Sage', color: 'bg-[#586c5c]' },
    { id: 'taupe', label: 'Warm Taupe', color: 'bg-[#8c7a6b]' },
  ];

  // Font style presets
  const fonts: { id: FontPreset; label: string; description: string }[] = [
    { id: 'classic-serif', label: 'Classic Academic', description: 'Georgia serif headers + Inter sans body' },
    { id: 'modern-sans', label: 'Corporate Modern', description: 'Plus Jakarta Sans headers & body text' },
    { id: 'editorial', label: 'Editorial Elegance', description: 'Playfair Display serifs for sophisticated profiles' },
    { id: 'tech-mono', label: 'Technical Mono', description: 'JetBrains Mono console code feel' },
    { id: 'geometric', label: 'Modern Geometric', description: 'Futuristic tight-font display headers' },
    { id: 'minimal-chic', label: 'Minimalist Chic', description: 'Ultra-clean sans titles with light spacing accents' },
  ];

  const layoutTemplates: { id: LayoutTemplate; label: string }[] = [
    { id: 'single-column', label: 'Single Column (Standard)' },
    { id: 'two-column-left', label: 'Two Column (Sidebar Left)' },
    { id: 'two-column-right', label: 'Two Column (Sidebar Right)' },
  ];

  // AI Design consultant
  const runAiDesignConsultant = async () => {
    if (!resumeData) return;
    try {
      const prompt = `Review this candidate profile and recommend the most professional layout and design settings.
Candidate Summary: "${resumeData.summary}"
Candidate Title: "${resumeData.personalInfo.title}"
Total Work Experience Positions: ${resumeData.workExperience.length}
Key Skills Category Count: ${resumeData.skills.length}

Choose the single best combination of the following criteria to make the resume match the candidate's industry standard.
Ensure you output exactly in the JSON format detailed below, without additional texts:
{
  "accent": "indigo" | "emerald" | "slate" | "crimson" | "sky" | "amber" | "neutral",
  "fontPreset": "classic-serif" | "modern-sans" | "editorial" | "tech-mono" | "geometric",
  "spacing": "compact" | "balanced" | "spacious",
  "layout": "single-column" | "two-column-left" | "two-column-right",
  "dividedLines": true | false
}`;

      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          systemInstruction: 'You are an elite corporate graphic identity consultant who audits CVs to match industry vibes. Return ONLY a valid JSON object matching the requested schema. No code fences, no prefix, no trailing messages.',
          temperature: 0.2
        })
      });

      const res = await response.json();
      if (response.ok && res.text) {
        // Strip code fences of any form
        let rawJSON = res.text.trim();
        if (rawJSON.startsWith('```json')) {
          rawJSON = rawJSON.substring(7);
        }
        if (rawJSON.startsWith('```')) {
          rawJSON = rawJSON.substring(3);
        }
        if (rawJSON.endsWith('```')) {
          rawJSON = rawJSON.substring(0, rawJSON.length - 3);
        }
        rawJSON = rawJSON.trim();
        
        const parsed = JSON.parse(rawJSON);
        onChange({
          ...settings,
          accent: parsed.accent || settings.accent,
          fontPreset: parsed.fontPreset || settings.fontPreset,
          spacing: parsed.spacing || settings.spacing,
          layout: parsed.layout || settings.layout,
          dividedLines: parsed.dividedLines !== undefined ? parsed.dividedLines : settings.dividedLines
        });
      } else {
        // Simple fallback suggestion
        onChange({
          ...settings,
          accent: 'indigo',
          fontPreset: 'modern-sans',
          spacing: 'balanced',
          layout: 'single-column',
          dividedLines: true
        });
      }
    } catch (err) {
      console.error('Error in design consultant:', err);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 space-y-6" id="design_controls_panel">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 select-none">
        <h3 className="text-sm font-black text-slate-850 uppercase tracking-widest flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-600" /> Layout & Styling
        </h3>
        
        {/* Print quick action */}
        <button
          onClick={onPrint}
          className="h-8 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black inline-flex items-center gap-1.5 transition-all duration-155 cursor-pointer border border-slate-855 border-slate-850"
          id="btn_print_cv"
        >
          <Printer className="w-3.5 h-3.5 text-indigo-300" />
          <span>PDF Print</span>
        </button>
      </div>

      {/* AI Design Consultant Banner */}
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 space-y-3 animate-fade-in select-none shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-indigo-105 bg-indigo-100/60 rounded-xl text-indigo-600 shrink-0">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider">AI STYLE ARCHITECT</h4>
            <p className="text-[11px] text-indigo-950/80 leading-relaxed mt-0.5 font-medium">
              We'll analyze your executive statement and career items to calibrate the aesthetic parameters matching your target industry vibe!
            </p>
          </div>
        </div>
        <button
          onClick={runAiDesignConsultant}
          className="w-full h-10 bg-white hover:bg-indigo-50/40 border border-indigo-200 hover:border-indigo-300 text-indigo-700 text-xs font-black rounded-xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          id="btn_ai_design_fit"
        >
          Auto-Fit Aesthetic Vibe
        </button>
      </div>

      {/* Spacing customizer */}
      <div className="space-y-2.5" id="style_group_spacing">
        <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">1. Grid Text Density</label>
        <div className="grid grid-cols-3 gap-2.5">
          {(['compact', 'balanced', 'spacious'] as SpacingPreset[]).map(s => (
            <button
              key={s}
              onClick={() => updateSetting('spacing', s)}
              className={`py-2 text-xs font-black rounded-xl border capitalize transition duration-150 cursor-pointer ${
                settings.spacing === s
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Calibrate padding metrics to optimize visual hierarchy and fit complex highlights clean on a single page.
        </p>
      </div>

      {/* Headings Layout theme selector */}
      <div className="space-y-2.5" id="style_group_layout">
        <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">2. Structural Grid Layout</label>
        <div className="space-y-2">
          {layoutTemplates.map(l => (
            <button
              key={l.id}
              onClick={() => updateSetting('layout', l.id)}
              className={`w-full py-2.5 text-xs font-black rounded-xl border text-left px-4 block transition duration-155 cursor-pointer ${
                settings.layout === l.id
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Font typography combos selection */}
      <div className="space-y-2.5" id="style_group_typography">
        <label className="text-xs font-black text-slate-705 text-slate-700 uppercase tracking-wider block">3. Corporate Typographic pair</label>
        <div className="space-y-2">
          {fonts.map(font => (
            <button
              key={font.id}
              onClick={() => updateSetting('fontPreset', font.id)}
              className={`w-full p-3.5 text-left border rounded-xl transition duration-150 cursor-pointer group ${
                settings.fontPreset === font.id
                  ? 'bg-indigo-50 border-indigo-600 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-black group-hover:text-indigo-600 transition ${settings.fontPreset === font.id ? 'text-indigo-700' : 'text-slate-800'}`}>
                  {font.label}
                </span>
                <span className="text-[9px] font-mono tracking-wider uppercase bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-lg text-slate-500 scale-95 origin-right">
                  {font.id}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">{font.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Color Accent presets selection */}
      <div className="space-y-2.5" id="style_group_colors">
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">4. Brand Theme Accent</label>
        <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
          {accents.map(acc => (
            <button
              key={acc.id}
              onClick={() => updateSetting('accent', acc.id)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition hover:scale-110 cursor-pointer ${acc.color} ${
                settings.accent === acc.id ? 'ring-2 ring-indigo-550 ring-offset-2 scale-105' : 'opacity-85'
              }`}
              title={acc.label}
            >
              {settings.accent === acc.id && (
                <span className="text-white text-[10px] font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Decorative and visibility toggles */}
      <div className="space-y-3 pt-3 border-t border-slate-150" id="style_group_toggles">
        <label className="text-xs font-bold text-slate-650 uppercase tracking-wider block">5. Extra Visual elements</label>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800">Dividing Lines</span>
              <span className="text-[10px] text-slate-400">Interlace headings with a clean accent line</span>
            </div>
            <input
              type="checkbox"
              checked={settings.dividedLines}
              onChange={(e) => updateSetting('dividedLines', e.target.checked)}
              className="rounded text-indigo-650 h-4.5 w-4.5 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800">Section Icons</span>
              <span className="text-[10px] text-slate-400">Show decorative vector category badges</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showSectionIcons}
              onChange={(e) => updateSetting('showSectionIcons', e.target.checked)}
              className="rounded text-indigo-650 h-4.5 w-4.5 focus:ring-indigo-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800">Global Text Scaling</span>
              <span className="text-[10px] text-slate-400">Scale the size class of all descriptive text</span>
            </div>
            <select
              value={settings.fontSize}
              onChange={(e) => updateSetting('fontSize', e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded p-1.5 text-xs text-slate-700 outline-none focus:ring-1 focus:ring-indigo-505"
            >
              <option value="sm">Compact (Small)</option>
              <option value="base">Standard (Medium)</option>
              <option value="lg">Spacious (Large)</option>
            </select>
          </div>
        </div>
      </div>

      {/* General Printing tips */}
      <div className="bg-slate-50 rounded-md p-3.5 border border-slate-150 relative select-none">
        <div className="flex gap-2 text-slate-500">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-[10.5px] leading-relaxed">
            <p className="font-bold text-slate-750">Pro Printing Tips:</p>
            <ol className="list-decimal pl-3 pb-1 text-slate-650 space-y-0.5 mt-1">
              <li>Click the <strong>PDF Print</strong> button above.</li>
              <li>Toggle the Destination selection to <strong>Save as PDF</strong> in browser settings.</li>
              <li>Enable <strong>Background graphics</strong> to preserve custom palette accents.</li>
            </ol>
          </div>
        </div>
      </div>

    </div>
  );
}
