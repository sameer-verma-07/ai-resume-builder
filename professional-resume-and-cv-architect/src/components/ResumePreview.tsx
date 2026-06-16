import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Github, 
  Linkedin, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Award, 
  Languages, 
  User,
  ExternalLink
} from 'lucide-react';
import { ResumeData, DesignSettings } from '../types';

interface ResumePreviewProps {
  data: ResumeData;
  settings: DesignSettings;
}

export default function ResumePreview({ data, settings }: ResumePreviewProps) {
  const { personalInfo, summary, workExperience, education, projects, skills, certifications, languages } = data;
  const { accent, fontPreset, spacing, layout, showSectionIcons, dividedLines, fontSize } = settings;

  // Spacing presets mapped to tailwind classes
  const spacingConfig = {
    compact: {
      gap: 'space-y-3',
      sectionGap: 'space-y-4',
      itemGap: 'space-y-1',
      padding: 'p-6 md:p-8',
      headingMargin: 'mb-1.5',
      bodyText: 'text-xs leading-normal',
      bulletGap: 'space-y-0.5',
    },
    balanced: {
      gap: 'space-y-4.5',
      sectionGap: 'space-y-6',
      itemGap: 'space-y-2',
      padding: 'p-8 md:p-12',
      headingMargin: 'mb-3',
      bodyText: 'text-sm leading-relaxed',
      bulletGap: 'space-y-1',
    },
    spacious: {
      gap: 'space-y-6',
      sectionGap: 'space-y-8',
      itemGap: 'space-y-3.5',
      padding: 'p-10 md:p-16',
      headingMargin: 'mb-4.5',
      bodyText: 'text-base leading-loose',
      bulletGap: 'space-y-2',
    }
  }[spacing];

  // Font presets mapped to tailwind classes
  const fontConfig = {
    'classic-serif': {
      title: 'font-serif tracking-tight font-bold',
      headers: 'font-serif tracking-tight font-bold uppercase text-slate-900',
      subheaders: 'font-inter font-bold text-slate-800',
      body: 'font-inter font-normal text-slate-700',
      meta: 'font-inter text-xs text-slate-500 font-medium',
    },
    'modern-sans': {
      title: 'font-sans tracking-tight font-black uppercase text-slate-900',
      headers: 'font-sans tracking-wide font-extrabold uppercase text-slate-905',
      subheaders: 'font-sans font-bold text-slate-800',
      body: 'font-sans font-normal text-slate-730 text-slate-700',
      meta: 'font-sans text-xs text-slate-500',
    },
    'editorial': {
      title: 'font-serif tracking-tight font-medium italic text-slate-950',
      headers: 'font-serif tracking-wide font-bold text-slate-900 uppercase border-b pb-0.5',
      subheaders: 'font-serif font-semibold italic text-slate-800',
      body: 'font-serif font-light text-slate-750 text-slate-700',
      meta: 'font-serif text-xs text-slate-500 italic',
    },
    'tech-mono': {
      title: 'font-mono tracking-tight font-bold text-slate-950',
      headers: 'font-mono tracking-wider font-bold text-slate-800 uppercase',
      subheaders: 'font-mono font-bold text-slate-700',
      body: 'font-mono text-[11px] text-slate-700 leading-normal',
      meta: 'font-mono text-xs text-slate-500',
    },
    'geometric': {
      title: 'font-display tracking-tight font-black uppercase text-slate-950',
      headers: 'font-display tracking-[0.14em] font-extrabold uppercase text-slate-900',
      subheaders: 'font-sans font-bold text-slate-800',
      body: 'font-inter font-normal text-slate-650 text-slate-700 leading-relaxed',
      meta: 'font-sans text-xs font-semibold tracking-wider text-slate-500 uppercase',
    },
    'minimal-chic': {
      title: 'font-sans tracking-[0.05em] font-light text-slate-950 uppercase border-b pb-1.5',
      headers: 'font-sans tracking-[0.18em] font-medium uppercase text-slate-800 border-b border-stone-200 pb-1',
      subheaders: 'font-sans font-semibold text-slate-900',
      body: 'font-inter font-normal text-slate-650 text-slate-705 leading-relaxed',
      meta: 'font-mono text-[10px] text-slate-500 tracking-wider uppercase',
    }
  }[fontPreset];

  // Accent Colors mapped
  const accentColors = {
    indigo: {
      text: 'text-indigo-850 text-indigo-800',
      border: 'border-indigo-600',
      heading: 'text-indigo-900',
      bullet: 'bg-indigo-600',
    },
    emerald: {
      text: 'text-emerald-800',
      border: 'border-emerald-600',
      heading: 'text-emerald-900',
      bullet: 'bg-emerald-600',
    },
    slate: {
      text: 'text-slate-800',
      border: 'border-slate-700',
      heading: 'text-slate-900',
      bullet: 'bg-slate-700',
    },
    crimson: {
      text: 'text-red-800',
      border: 'border-red-650 border-red-700',
      heading: 'text-red-915 text-red-900',
      bullet: 'bg-red-700',
    },
    sky: {
      text: 'text-sky-800',
      border: 'border-sky-500',
      heading: 'text-sky-900',
      bullet: 'bg-sky-500',
    },
    amber: {
      text: 'text-amber-800',
      border: 'border-amber-600',
      heading: 'text-amber-900',
      bullet: 'bg-amber-600',
    },
    neutral: {
      text: 'text-slate-900',
      border: 'border-slate-900',
      heading: 'text-slate-950 text-slate-900 font-bold',
      bullet: 'bg-slate-900',
    },
    sage: {
      text: 'text-[#48564b]',
      border: 'border-[#586c5c]/45',
      heading: 'text-[#303d33] font-bold',
      bullet: 'bg-[#586c5c]',
    },
    taupe: {
      text: 'text-[#6e5d4f]',
      border: 'border-[#8c7a6b]/35',
      heading: 'text-[#56493d] font-bold',
      bullet: 'bg-[#8c7a6b]',
    }
  }[accent];

  // Dynamic Font Size Class Modifier
  const sizeModifier = {
    sm: 'text-[11px] md:text-xs',
    base: 'text-xs md:text-sm',
    lg: 'text-sm md:text-base'
  }[fontSize];

  // Section Header Component to prevent repetitive logic
  const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => {
    return (
      <div className={`${spacingConfig.headingMargin} select-none`} id={`section_header_${title.toLowerCase().replace(/\s+/g, '_')}`}>
        <div className="flex items-center gap-2">
          {showSectionIcons && (
            <span className={`${accentColors.text} shrink-0 w-4 h-4 print:opacity-85`} id={`section_icon_${title.toLowerCase().replace(/\s+/g, '_')}`}>
              {icon}
            </span>
          )}
          <h2 className={`${fontConfig.headers} ${accentColors.heading} flex-1 text-sm md:text-base font-bold`} id={`section_title_${title.toLowerCase().replace(/\s+/g, '_')}`}>
            {title}
          </h2>
        </div>
        {dividedLines && (
          <div className={`w-full h-[1px] mt-1.5 ${accentColors.border} bg-current opacity-25`} id={`section_line_${title.toLowerCase().replace(/\s+/g, '_')}`}></div>
        )}
      </div>
    );
  };

  // Helper date formatter (YYYY-MM to Month YYYY)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.toLowerCase() === 'present') return 'Present';
    if (dateStr.length === 4) return dateStr; // year only
    
    try {
      const date = new Date(dateStr + '-02'); // Add day to construct safely
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Render personal info badges
  const renderContactInfo = () => {
    return (
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-slate-600 border-t md:border-t-0 pt-2 md:pt-0 mt-3 md:mt-0 font-sans" id="cv_contact_block">
        {personalInfo.email && (
          <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-1.5 hover:text-indigo-650 hover:underline">
            <Mail className="w-3.5 h-3.5 opacity-60 shrink-0" />
            <span>{personalInfo.email}</span>
          </a>
        )}
        {personalInfo.phone && (
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 opacity-60 shrink-0" />
            <span>{personalInfo.phone}</span>
          </span>
        )}
        {personalInfo.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 opacity-60 shrink-0" />
            <span>{personalInfo.location}</span>
          </span>
        )}
        {personalInfo.website && (
          <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-indigo-650 hover:underline">
            <Globe className="w-3.5 h-3.5 opacity-60 shrink-0" />
            <span>{personalInfo.website.replace(/^https?:\/\//i, '')}</span>
          </a>
        )}
        {personalInfo.github && (
          <a href={`https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-indigo-650 hover:underline">
            <Github className="w-3.5 h-3.5 opacity-60 shrink-0" />
            <span>{personalInfo.github.replace(/^github\.com\//i, '@')}</span>
          </a>
        )}
        {personalInfo.linkedin && (
          <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-indigo-650 hover:underline">
            <Linkedin className="w-3.5 h-3.5 opacity-60 shrink-0" />
            <span>{personalInfo.linkedin.replace(/^linkedin\.com\/in\//i, 'in/')}</span>
          </a>
        )}
      </div>
    );
  };

  // Sections contents block generators
  const renderSummarySection = () => {
    if (!summary) return null;
    return (
      <section className="animate-fade-in" id="cv_section_summary">
        <SectionHeader icon={<User className="w-4 h-4" />} title="Profile Summary" />
        <p className={`${fontConfig.body} ${sizeModifier} text-justify font-sans leading-relaxed mt-1 select-text text-slate-750`}>
          {summary}
        </p>
      </section>
    );
  };

  const renderWorkSection = () => {
    if (workExperience.length === 0) return null;
    return (
      <section className="animate-fade-in" id="cv_section_experience">
        <SectionHeader icon={<Briefcase className="w-4 h-4" />} title="Professional Experience" />
        <div className={`${spacingConfig.gap}`} id="cv_experience_items">
          {workExperience.map((exp) => (
            <div key={exp.id} className={`${spacingConfig.itemGap} group`} id={`exp_item_${exp.id}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className={`${fontConfig.subheaders} text-sm md:text-base font-bold text-slate-900 group-hover:text-indigo-700 transition duration-150`}>
                    {exp.role}
                  </h3>
                  <span className="text-slate-400 font-mono text-sm">|</span>
                  <span className={`${fontConfig.body} font-semibold text-slate-800`}>
                    {exp.company}
                  </span>
                </div>
                <div className={`${fontConfig.meta} flex items-center gap-1.5 shrink-0 whitespace-nowrap`}>
                  <span>{formatDate(exp.startDate)}</span>
                  <span>–</span>
                  <span>{exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                  {exp.location && (
                    <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-sans uppercase font-bold tracking-wider text-slate-500">
                      {exp.location}
                    </span>
                  )}
                </div>
              </div>

              {exp.description && (
                <p className={`${fontConfig.body} ${sizeModifier} text-slate-600 font-sans mt-0.5 italic`}>
                  {exp.description}
                </p>
              )}

              {exp.highlights && exp.highlights.length > 0 && (
                <ul className={`mt-1 pl-4 list-disc ${accentColors.bullet && 'marker:text-indigo-500'} ${spacingConfig.bulletGap}`} id={`exp_bullets_${exp.id}`}>
                  {exp.highlights.map((bullet, bIdx) => (
                    <li key={bIdx} className={`${fontConfig.body} ${sizeModifier} text-slate-700 leading-relaxed pl-1 select-text`}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderEducationSection = () => {
    if (education.length === 0) return null;
    return (
      <section className="animate-fade-in" id="cv_section_education">
        <SectionHeader icon={<GraduationCap className="w-4 h-4" />} title="Education" />
        <div className={`${spacingConfig.gap}`} id="cv_education_items">
          {education.map((edu) => (
            <div key={edu.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline" id={`edu_item_${edu.id}`}>
              <div>
                <h3 className={`${fontConfig.subheaders} text-sm md:text-base font-bold text-slate-900`}>
                  {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                </h3>
                <div className="flex items-center gap-2 mt-0.5 text-xs font-medium text-slate-700">
                  <span className="font-semibold">{edu.institution}</span>
                  {edu.gpa && (
                    <>
                      <span className="text-slate-350">•</span>
                      <span>GPA: <strong className="text-slate-800">{edu.gpa}</strong></span>
                    </>
                  )}
                </div>
              </div>
              <div className={`${fontConfig.meta} flex items-center gap-1.5 shrink-0 whitespace-nowrap`}>
                <span>{formatDate(edu.startDate)}</span>
                <span>–</span>
                <span>{edu.current ? 'Present' : formatDate(edu.endDate)}</span>
                {edu.location && <span className="text-slate-400">({edu.location})</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderProjectsSection = () => {
    if (projects.length === 0) return null;
    return (
      <section className="animate-fade-in" id="cv_section_projects">
        <SectionHeader icon={<Code2 className="w-4 h-4" />} title="Key Projects & Products" />
        <div className={`${spacingConfig.gap}`} id="cv_projects_items">
          {projects.map((proj) => (
            <div key={proj.id} className={`${spacingConfig.itemGap} group`} id={`proj_item_${proj.id}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className={`${fontConfig.subheaders} text-sm md:text-base font-bold text-slate-900 group-hover:text-indigo-700 transition duration-150`}>
                    {proj.name}
                  </h3>
                  {proj.link && (
                    <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-slate-405 text-indigo-600 hover:underline inline-flex items-center gap-0.5 text-xs font-semibold print:text-[10px]">
                      {proj.link.replace(/^https?:\/\//i, '').replace(/\/$/i, '')} <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
                <div className={`${fontConfig.meta} shrink-0`}>
                  <span>{formatDate(proj.startDate)}</span>
                  {proj.endDate && (
                    <>
                      <span> – </span>
                      <span>{formatDate(proj.endDate)}</span>
                    </>
                  )}
                </div>
              </div>

              {proj.highlights && proj.highlights.length > 0 && (
                <ul className={`mt-1 pl-4 list-disc ${accentColors.bullet && 'marker:text-indigo-500'} ${spacingConfig.bulletGap}`} id={`proj_bullets_${proj.id}`}>
                  {proj.highlights.map((bullet, bIdx) => (
                    <li key={bIdx} className={`${fontConfig.body} ${sizeModifier} text-slate-700 leading-relaxed pl-1 select-text`}>
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderSkillsSection = () => {
    if (skills.length === 0) return null;
    return (
      <section className="animate-fade-in" id="cv_section_skills">
        <SectionHeader icon={<Code2 className="w-4 h-4" />} title="Expertise & Technical Skills" />
        <div className="space-y-2 mt-1.5" id="cv_skills_container">
          {skills.map((category) => (
            <div key={category.id} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 text-xs" id={`skill_cat_${category.id}`}>
              <span className="font-bold text-slate-800 font-sans min-w-[140px] uppercase tracking-wider text-[11px]">
                {category.name}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {category.skills.map((skill, sIdx) => (
                  <span key={sIdx} className="bg-slate-100 hover:bg-slate-200/80 transition text-slate-800 px-2 py-0.5 rounded font-mono text-[10px] md:text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCertificationsSection = () => {
    if (certifications.length === 0) return null;
    return (
      <section className="animate-fade-in" id="cv_section_certifications">
        <SectionHeader icon={<Award className="w-4 h-4" />} title="Certifications" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="cv_cert_items">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between items-start text-xs border border-transparent hover:border-slate-100 rounded-md p-1.5 transition" id={`cert_item_${cert.id}`}>
              <div>
                <h4 className="font-bold text-slate-900 leading-tight">{cert.name}</h4>
                <p className="text-slate-500 font-sans">{cert.issuer}</p>
              </div>
              <span className="text-[11px] font-mono font-semibold text-slate-400 whitespace-nowrap bg-slate-50 px-1.5 py-0.5 rounded ml-2">
                {cert.date}
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderLanguagesSection = () => {
    if (languages.length === 0) return null;
    return (
      <section className="animate-fade-in" id="cv_section_languages">
        <SectionHeader icon={<Languages className="w-4 h-4" />} title="Languages" />
        <div className="flex flex-wrap gap-x-6 gap-y-1.5 mt-1.5" id="cv_lang_items">
          {languages.map((lang) => (
            <div key={lang.id} className="flex items-center gap-1.5 text-xs text-slate-800" id={`lang_item_${lang.id}`}>
              <span className="font-bold font-sans text-slate-900">{lang.name}</span>
              <span className="text-slate-400 font-mono">({lang.proficiency})</span>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Layout template routing logic (Single Column vs Dual Column)
  const renderSingleColumnLayout = () => {
    return (
      <div className={`${spacingConfig.sectionGap}`}>
        {renderSummarySection()}
        {renderWorkSection()}
        {renderProjectsSection()}
        {renderSkillsSection()}
        {renderEducationSection()}
        
        {/* Double column grid for footer meta elements */}
        {(certifications.length > 0 || languages.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 border-t border-slate-100 pt-5 print:border-none print:pt-0">
            <div className={`${certifications.length > 0 ? 'md:col-span-3' : 'hidden'}`}>
              {renderCertificationsSection()}
            </div>
            <div className={`${languages.length > 0 ? 'md:col-span-2' : 'hidden'}`}>
              {renderLanguagesSection()}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTwoColumnLayout = (sidebarOnLeft: boolean) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Main Side Column */}
        <div className={`md:col-span-4 space-y-6 ${sidebarOnLeft ? 'md:order-1' : 'md:order-2'} border-b md:border-b-0 pb-6 md:pb-0 border-slate-100 pr-0 md:pr-4`}>
          {renderSkillsSection()}
          {renderEducationSection()}
          {renderLanguagesSection()}
          {renderCertificationsSection()}
        </div>

        {/* Major Work Column */}
        <div className={`md:col-span-8 ${spacingConfig.sectionGap} ${sidebarOnLeft ? 'md:order-2 md:pl-4 border-l border-slate-100 print:border-l-0 print:pl-0' : 'md:order-1 md:pr-4 border-r border-slate-100 print:border-r-0 print:pr-0'}`}>
          {renderSummarySection()}
          {renderWorkSection()}
          {renderProjectsSection()}
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`bg-white shadow-xl shadow-slate-150-inset w-full aspect-auto md:aspect-[1/1.41] ${spacingConfig.padding} relative border border-slate-250 border-slate-200 print:shadow-none print:border-none print:p-0 print:mx-0 print:max-w-none print:aspect-auto select-none`} 
      style={{ minHeight: '297mm' }}
      id="cv_print_paper"
    >
      {/* Decorative vertical top highlight ribbon - hidden on print */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${accentColors.bullet || 'bg-indigo-600'} print:hidden`}></div>
      
      {/* CV Header containing personal information */}
      <header className="mb-6 pb-5 border-b border-slate-100 select-none pb-4" id="cv_header_area">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-3 text-center md:text-left select-none">
          <div className="space-y-1">
            <h1 className={`${fontConfig.title} text-2xl md:text-3.5xl font-extrabold text-slate-900 tracking-tight select-text leading-tight uppercase`} id="cv_full_name">
              {personalInfo.fullName || 'Anonymous Candidate'}
            </h1>
            <p className={`${fontConfig.subheaders} ${accentColors.text} text-xs md:text-sm font-black uppercase tracking-widest font-mono select-text`} id="cv_job_title">
              {personalInfo.title || 'Professional Specialist'}
            </p>
          </div>
        </div>
        {renderContactInfo()}
      </header>

      {/* Structured core CV contents */}
      <div id="cv_body_area">
        {layout === 'single-column' 
          ? renderSingleColumnLayout() 
          : renderTwoColumnLayout(layout === 'two-column-left')}
      </div>
    </div>
  );
}
