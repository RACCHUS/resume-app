import React, { useState } from 'react';
import { getResumeImportPrompt } from '../../lib/promptGenerator';
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import styles from './ResumeImporter.module.css';
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
    <div className={styles.importerContainer}>
      <h3>Import Resume (from ChatGPT.com, LinkedIn, Indeed, etc.)</h3>
      <input
        type="file"
        accept=".txt,.pdf,.doc,.docx"
        onChange={handleFileUpload}
        className={styles.importerInput}
      />
      {loading && <div className={styles.importerLoading}>Extracting text from PDF...</div>}
      <textarea
        value={resumeText}
        onChange={e => setResumeText(e.target.value)}
        placeholder="Paste your resume text here or upload a file above..."
        className={styles.importerTextarea}
        style={{ minHeight: 80 }}
      />
      <button onClick={handleGeneratePrompt} className={styles.importerButton}>Generate ChatGPT Prompt</button>
      {showPrompt && (
        <div>
          <textarea
            value={generatedPrompt}
            readOnly
            className={styles.importerTextarea}
            style={{ minHeight: 120, fontSize: 13, marginBottom: 4 }}
          />
          <button onClick={handleCopyPrompt} className={styles.importerButton}>
            {copied ? 'Copied!' : 'Copy Prompt'}
          </button>
        </div>
      )}
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste JSON output from ChatGPT.com here..."
        className={styles.importerTextarea}
        style={{ minHeight: 80 }}
      />
      <button onClick={handleImport} className={styles.importerButton}>Import Resume</button>
      {error && <div className={styles.importerError}>{error}</div>}
      <div className={styles.importerHelper}>
        1. Upload or paste your resume.<br />
        2. Click Generate ChatGPT Prompt.<br />
        3. Copy the prompt and paste it into ChatGPT.com.<br />
        4. Copy the JSON output from ChatGPT and paste it above.<br />
        5. Click Import Resume.
      </div>
    </div>
  );
}
