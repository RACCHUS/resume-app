import { Resume } from '../types/resume';

// ChatGPT prompt generation utilities
export function generateResumePrompt(resumeData: any) {/* ... */}
export function generateOptimizationPrompt(resumeData: any, jobDescription: string) {/* ... */}

export function getResumeImportPrompt(): string {
  return `You are a resume parser. Convert the following resume text, LinkedIn export, or Indeed resume into a JSON object with this schema:\n\n{
  "header": { "name": string, "contactInfo": [{ "type": string, "value": string }] },
  "summary": string,
  "work": [{ "id": string, "jobTitle": string, "company": string, "date": string, "bullets": string[] }],
  "education": [{ "id": string, "degree": string, "school": string, "date": string, "bullets": string[] }],
  "certifications": [{ "id": string, "certification": string, "school": string, "date": string, "bullets": string[] }],
  "skills": string[],
  "customSections": [{ "id": string, "name": string, "type": "summary"|"list"|"combo", "content": any }]
}\n\nOnly output valid JSON. Do not include any explanation or extra text.`;
}

export function getResumeOptimizationPrompt(resume: Resume, jobDescription: string): string {
  return `You are a resume optimization assistant. Here is a resume in JSON format:\n${JSON.stringify(resume, null, 2)}\n\nAnd here is a job description:\n${jobDescription}\n\nSuggest improvements to the resume to better match the job description. Output suggestions as a list.`;
}
