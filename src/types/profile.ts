import { Timestamp, FieldValue } from 'firebase/firestore';

export interface BasicInfo {
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
}

export interface ProfessionalInfo {
  headline: string;
  summary: string;
  yearsOfExperience: number;
  currentRole?: string;
  currentCompany?: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  graduationYear: number;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Preferences {
  roles: string[];
  locations: string[];
  remoteType: 'remote' | 'hybrid' | 'onsite' | 'any';
  minimumSalary: number | null;
  employmentTypes: ('full-time' | 'contract' | 'part-time' | 'internship')[];
}

export interface CandidateProfile {
  basicInfo: BasicInfo;
  professional: ProfessionalInfo;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: string[];
  preferences: Preferences;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}
