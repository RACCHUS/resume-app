import { pdf } from '@react-pdf/renderer';
import { Resume } from '../types/resume';
import { ResumePDF } from '../components/pdf/ResumePDF';
import React from 'react';

// PDF export logic using @react-pdf/renderer
export async function exportResumeToPDF(resume: Resume, fileName = 'resume.pdf') {
  // @ts-ignore: JSX in non-TSX file
  const blob = await pdf(React.createElement(ResumePDF, { resume })).toBlob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
