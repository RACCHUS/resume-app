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
  return `You are an expert resume optimization assistant. Your tasks are:

1. Carefully analyze the provided resume (in JSON format) and the job description.
2. Optimize the resume for Applicant Tracking Systems (ATS) by:
   - Matching keywords and skills from the job description.
   - Improving phrasing and quantifying achievements.
   - Ensuring clarity, conciseness, and strong action verbs.
   - Removing irrelevant or redundant information.
   - Reordering or emphasizing sections as needed for impact.
   - Applying strong modern resume best practices.
3. Make the resume as competitive as possible for the job.
4. Output ONLY the improved resume as a valid JSON object matching this schema:

{
  "header": { "name": string, "contactInfo": [{ "type": string, "value": string }] },
  "summary": string,
  "work": [{ "id": string, "jobTitle": string, "company": string, "date": string, "bullets": string[] }],
  "education": [{ "id": string, "degree": string, "school": string, "date": string, "bullets": string[] }],
  "certifications": [{ "id": string, "certification": string, "school": string, "date": string, "bullets": string[] }],
  "skills": string[],
  "customSections": [{ "id": string, "name": string, "type": "summary"|"list"|"combo", "content": any }],
  "sectionOrder": string[],
  "sectionVisibility": { [key: string]: boolean }
}

Here is the current resume:
${JSON.stringify(resume, null, 2)}

Here is the job description:
${jobDescription}

Respond ONLY with the improved JSON resume. Do not include any explanation, commentary, or extra text.`;
}
