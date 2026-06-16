export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  gpa: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  link: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface SkillCategory {
  id: string;
  name: string; // e.g. "Programming Languages"
  skills: string[]; // e.g. ["TypeScript", "Python"]
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string; // e.g. "Fluent", "Native", "Conversational"
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  projects: Project[];
  skills: SkillCategory[];
  certifications: Certification[];
  languages: Language[];
}

export type ThemeAccent = 'indigo' | 'emerald' | 'slate' | 'crimson' | 'sky' | 'amber' | 'neutral' | 'sage' | 'taupe';
export type FontPreset = 'classic-serif' | 'modern-sans' | 'editorial' | 'tech-mono' | 'geometric' | 'minimal-chic';
export type SpacingPreset = 'compact' | 'balanced' | 'spacious';
export type LayoutTemplate = 'single-column' | 'two-column-left' | 'two-column-right';

export interface DesignSettings {
  accent: ThemeAccent;
  fontPreset: FontPreset;
  spacing: SpacingPreset;
  layout: LayoutTemplate;
  showSectionIcons: boolean;
  dividedLines: boolean;
  fontSize: 'sm' | 'base' | 'lg';
}
