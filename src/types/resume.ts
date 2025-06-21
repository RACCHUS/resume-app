// Resume TypeScript types and schema
export interface Resume {
  header: HeaderSection;
  summary: string;
  work: WorkSection[];
  education: EducationSection[];
  certifications: CertificationSection[];
  skills: string[];
  customSections: CustomSection[];
  sectionOrder?: string[];
  sectionVisibility?: Partial<Record<string, boolean>>; // Add this line
}

export interface HeaderSection {
  name: string;
  contactInfo: { type: string; value: string }[];
}

export interface WorkSection {
  id: string;
  jobTitle: string;
  company: string;
  date: string;
  bullets: string[];
}

export interface EducationSection {
  id: string;
  degree: string;
  school: string;
  date: string;
  bullets: string[];
}

export interface CertificationSection {
  id: string;
  certification: string;
  school: string;
  date: string;
  bullets: string[];
}

export type CustomSectionType = 'summary' | 'list' | 'combo';

export interface CustomSection {
  id: string;
  name: string;
  type: CustomSectionType;
  content: string | string[] | { [key: string]: any };
}
