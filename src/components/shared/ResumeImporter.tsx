import React, { useState } from 'react';
import { getResumeImportPrompt } from '../../lib/promptGenerator';
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

export default function ResumeImporter({ onImport }: { onImport: (json: any) => void }) {
  const [input, setInput] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImport = () => {
    try {
      const json = JSON.parse(input);
      onImport(json);
      setError('');
    } catch (e) {
      setError('Invalid JSON. Please paste the JSON output from ChatGPT.com.');
    }
  };

  const extractPdfText = async (file: File) => {
    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str).join(' ') + '\n';
      }
      setResumeText(text);
    } catch (e) {
      setError('Failed to extract text from PDF.');
    }
    setLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type === 'application/pdf') {
      extractPdfText(file);
    } else {
      const reader = new FileReader();
      reader.onload = ev => {
        setResumeText(ev.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  };

  const handleGeneratePrompt = () => {
    setGeneratedPrompt(getResumeImportPrompt() + '\n\nResume Data:\n' + resumeText);
    setShowPrompt(true);
    setCopied(false);
  };

  const handleCopyPrompt = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div style={{ marginBottom: 24, background: '#f5f6fa', padding: 16, borderRadius: 8 }}>
      <h3>Import Resume (from ChatGPT.com, LinkedIn, Indeed, etc.)</h3>
      <input type="file" accept=".txt,.pdf,.doc,.docx" onChange={handleFileUpload} style={{ marginBottom: 8 }} />
      {loading && <div style={{ color: '#2d6cdf', marginBottom: 8 }}>Extracting text from PDF...</div>}
      <textarea
        value={resumeText}
        onChange={e => setResumeText(e.target.value)}
        placeholder="Paste your resume text here or upload a file above..."
        style={{ width: '100%', minHeight: 80, marginBottom: 8 }}
      />
      <button onClick={handleGeneratePrompt} style={{ marginBottom: 8 }}>Generate ChatGPT Prompt</button>
      {showPrompt && (
        <div style={{ marginBottom: 8 }}>
          <textarea
            value={generatedPrompt}
            readOnly
            style={{ width: '100%', minHeight: 120, fontSize: 13, marginBottom: 4 }}
          />
          <button onClick={handleCopyPrompt} style={{ marginRight: 8 }}>{copied ? 'Copied!' : 'Copy Prompt'}</button>
        </div>
      )}
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste JSON output from ChatGPT.com here..."
        style={{ width: '100%', minHeight: 80, marginBottom: 8 }}
      />
      <button onClick={handleImport} style={{ marginRight: 8 }}>Import Resume</button>
      {error && <div style={{ color: 'red', marginTop: 4 }}>{error}</div>}
      <div style={{ fontSize: 13, color: '#666', marginTop: 8 }}>
        1. Upload or paste your resume.<br />
        2. Click Generate ChatGPT Prompt.<br />
        3. Copy the prompt and paste it into ChatGPT.com.<br />
        4. Copy the JSON output from ChatGPT and paste it above.<br />
        5. Click Import Resume.
      </div>
    </div>
  );
}
