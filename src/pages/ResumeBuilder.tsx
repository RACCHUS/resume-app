import React, { useState, useEffect, useRef } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { Resume, HeaderSection, WorkSection as WorkSectionType, EducationSection as EducationSectionType, CertificationSection as CertificationSectionType, CustomSection as CustomSectionType } from '../types/resume';
import HeaderSectionComponent from '../components/sections/HeaderSection';
import SummarySection from '../components/sections/SummarySection';
import WorkSection from '../components/sections/WorkSection';
import EducationSection from '../components/sections/EducationSection';
import CertificationSection from '../components/sections/CertificationSection';
import SkillsSection from '../components/sections/SkillsSection';
import CustomSectionComponent from '../components/sections/CustomSection';
import { ResumePDF } from '../components/pdf/ResumePDF';
import ResumeImporter from '../components/shared/ResumeImporter';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getResumeOptimizationPrompt } from '../lib/promptGenerator';

const defaultHeader: HeaderSection = {
  name: '',
  contactInfo: [],
};

const defaultResume: Resume = {
  header: defaultHeader,
  summary: '',
  work: [],
  education: [],
  certifications: [],
  skills: [],
  customSections: [],
};

// Remove 'customSections' from defaultSectionOrder and defaultSectionVisibility
const defaultSectionOrder = [
  'header',
  'summary',
  'work',
  'education',
  'certifications',
  'skills',
];

const defaultSectionVisibility: Partial<Record<string, boolean>> = {
  header: true,
  summary: true,
  work: true,
  education: true,
  certifications: true,
  skills: true,
};

// Fix: use string for SectionKey everywhere, not typeof defaultSectionOrder[number]
type SectionKey = string;

// Sortable section wrapper
function SortableSection({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? '#e3e9f6' : undefined,
    borderRadius: 8,
    marginBottom: 12,
  };
  return (
    <div ref={setNodeRef} style={style}>
      {/* Drag handle only */}
      <div
        {...attributes}
        {...listeners}
        style={{ cursor: 'grab', padding: 4, display: 'flex', alignItems: 'center', userSelect: 'none' }}
        aria-label="Drag section"
      >
        <span style={{ fontSize: 18, marginRight: 8 }}>☰</span> {/* Drag icon */}
        <span style={{ fontWeight: 500, color: '#888' }}>Drag</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

// Helper to check if resume is empty
function isResumeEmpty(resume: Resume) {
  return (
    !resume.header.name &&
    resume.header.contactInfo.length === 0 &&
    !resume.summary &&
    resume.work.length === 0 &&
    resume.education.length === 0 &&
    resume.certifications.length === 0 &&
    resume.skills.length === 0 &&
    resume.customSections.length === 0
  );
}

// Helper: get all section keys (static + custom)
function getAllSectionKeys(resume: Resume): string[] {
  const staticKeys = [
    'header',
    'summary',
    'work',
    'education',
    'certifications',
    'skills',
  ];
  const customKeys = (resume.customSections || [])
    .filter(cs => cs && cs.id)
    .map(cs => `customSections-${cs.id}`);
  return [...staticKeys, ...customKeys];
}

// Utility: get valid section keys from resume data
function getValidSectionKeys(resume: Resume): string[] {
  const staticKeys = [
    'header',
    'summary',
    'work',
    'education',
    'certifications',
    'skills',
  ];
  const customKeys = (resume.customSections || [])
    .filter(cs => cs && cs.id)
    .map(cs => `customSections-${cs.id}`);
  return [...staticKeys, ...customKeys];
}

// Error boundary for PDF preview
class PDFErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: any) {
    // You can log error here if needed
    console.error('PDF Preview Error:', error, info);
  }
  render() {
    if (this.state.error) {
      return <div style={{ color: 'red', padding: 16 }}>PDF Preview Error: {this.state.error.message}</div>;
    }
    return this.props.children;
  }
}

export default function ResumeBuilder() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, saveProfile } = useUserProfile(user);
  const [resume, setResume] = useState<Resume>(defaultResume);
  // sectionOrder now string[]
  const [sectionOrder, setSectionOrder] = useState<string[]>(getAllSectionKeys(defaultResume));
  const [sectionVisibility, setSectionVisibility] = useState<Partial<Record<string, boolean>>>(defaultSectionVisibility);
  const [history, setHistory] = useState<Array<{resume: Resume, sectionOrder: string[], sectionVisibility: Partial<Record<string, boolean>>;}>>([]);
  const [future, setFuture] = useState<typeof history>([]);
  const hasLoadedProfile = useRef(false);

  // Optimization prompt state
  const [jobDescription, setJobDescription] = useState('');
  const [optimizationPrompt, setOptimizationPrompt] = useState('');
  const [showOptimizationPrompt, setShowOptimizationPrompt] = useState(false);
  const [copiedOptimization, setCopiedOptimization] = useState(false);

  // Helper to push current state to history
  const pushHistory = () => {
    setHistory(h => [...h, { resume, sectionOrder, sectionVisibility }]);
    setFuture([]);
  };

  // Only set resume from profile on first load
  useEffect(() => {
    if (profile && !hasLoadedProfile.current) {
      setResume(profile);
      const validKeysFromProfile = getValidSectionKeys(profile);
      if (profile.sectionOrder && Array.isArray(profile.sectionOrder)) {
        setSectionOrder(profile.sectionOrder.filter(key => validKeysFromProfile.includes(key)));
      } else {
        setSectionOrder(validKeysFromProfile);
      }
      if (profile.sectionVisibility) {
        const filteredVisibility = Object.keys(profile.sectionVisibility).reduce((acc, key) => {
          if (validKeysFromProfile.includes(key) && profile.sectionVisibility && profile.sectionVisibility[key] !== undefined) {
            acc[key] = profile.sectionVisibility[key];
          }
          return acc;
        }, {} as Partial<Record<string, boolean>>);
        setSectionVisibility(filteredVisibility);
      } else {
        setSectionVisibility(defaultSectionVisibility);
      }
      hasLoadedProfile.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  // Prevent rendering sections until profile is loaded
  if (authLoading || profileLoading || !hasLoadedProfile.current) return <div>Loading...</div>;
  if (!user) return <div>Please sign in.</div>;

  // Top-level handlers that push to history, then update state
  const handleHeaderChange = (header: HeaderSection) => {
    pushHistory();
    setResume(r => ({ ...r, header }));
  };
  const handleSummaryChange = (summary: string) => {
    pushHistory();
    setResume(r => ({ ...r, summary }));
  };
  const handleWorkChange = (work: WorkSectionType[]) => {
    pushHistory();
    setResume(r => ({ ...r, work }));
  };
  const handleEducationChange = (education: EducationSectionType[]) => {
    pushHistory();
    setResume(r => ({ ...r, education }));
  };
  const handleCertificationsChange = (certifications: CertificationSectionType[]) => {
    pushHistory();
    setResume(r => ({ ...r, certifications }));
  };
  const handleSkillsChange = (skills: string[]) => {
    pushHistory();
    setResume(r => ({ ...r, skills }));
  };
  // Custom section add/remove logic
  const handleCustomSectionsChange = (customSections: CustomSectionType[]) => {
    pushHistory();
    setResume(r => ({ ...r, customSections }));
    setSectionOrder(order => {
      const customKeys = customSections.map(cs => `customSections-${cs.id}`);
      const combinedKeys = [...defaultSectionOrder, ...customKeys];
      // Remove deleted custom section keys from order
      return order.filter(key => combinedKeys.includes(key));
    });
    setSectionVisibility(v => {
      const newVisibility = { ...v };
      Object.keys(newVisibility).forEach(key => {
        if (key.startsWith('customSections-') && !customSections.some(cs => `customSections-${cs.id}` === key)) {
          delete newVisibility[key];
        }
      });
      customSections.forEach(cs => {
        const key = `customSections-${cs.id}`;
        if (newVisibility[key] === undefined) {
          newVisibility[key] = true;
        }
      });
      return newVisibility;
    });
  };
  const handleToggleSection = (key: SectionKey) => {
    pushHistory();
    setSectionVisibility(v => {
      const next = { ...v, [key]: !v[key] };
      return next;
    });
  };
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      pushHistory();
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id as SectionKey);
        const newIndex = items.indexOf(over.id as SectionKey);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  const handleImport = (json: any) => {
    pushHistory();
    setResume(json);
  };

  // Undo/redo handlers
  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setFuture(f => [{ resume, sectionOrder, sectionVisibility }, ...f]);
    setResume(prev.resume);
    setSectionOrder(prev.sectionOrder);
    setSectionVisibility(prev.sectionVisibility);
    setHistory(h => h.slice(0, h.length - 1));
  };
  const handleRedo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setHistory(h => [...h, { resume, sectionOrder, sectionVisibility }]);
    setResume(next.resume);
    setSectionOrder(next.sectionOrder);
    setSectionVisibility(next.sectionVisibility);
    setFuture(f => f.slice(1));
  };

  const handleSave = () => {
    saveProfile({ ...resume, sectionOrder, sectionVisibility });
  };

  // Add custom section handlers
  const handleAddCustomSection = (type: 'summary' | 'list' | 'combo') => {
    pushHistory();
    const newSection = { id: Date.now().toString(), name: '', type, content: type === 'list' ? [] : type === 'combo' ? { summary: '', items: [] } : '' };
    setResume(r => {
      const newCustomSections = [...r.customSections, newSection];
      return { ...r, customSections: newCustomSections };
    });
    setSectionOrder(order => [...order, `customSections-${newSection.id}`]);
    setSectionVisibility(v => ({ ...v, [`customSections-${newSection.id}`]: true }));
  };

  // Section renderers as a function
  const renderSectionComponent = (key: string) => {
    if (key.startsWith('customSections-')) {
      const id = key.replace('customSections-', '');
      const section = resume.customSections.find(cs => cs.id === id);
      if (!section) return null;
      // Render a CustomSectionComponent for just this section
      return (
        <CustomSectionComponent
          customSections={[section]}
          onChange={updatedSections => {
            // Only one section, so update that one in the array
            const updated = resume.customSections.map(cs =>
              cs.id === id ? { ...cs, ...updatedSections[0] } : cs
            );
            handleCustomSectionsChange(updated);
          }}
        />
      );
    }
    switch (key) {
      case 'header':
        return <HeaderSectionComponent header={resume.header} onChange={handleHeaderChange} />;
      case 'summary':
        return <SummarySection summary={resume.summary} onChange={handleSummaryChange} />;
      case 'work':
        return <WorkSection work={resume.work} onChange={handleWorkChange} />;
      case 'education':
        return <EducationSection education={resume.education} onChange={handleEducationChange} />;
      case 'certifications':
        return <CertificationSection certifications={resume.certifications} onChange={handleCertificationsChange} />;
      case 'skills':
        return <SkillsSection skills={resume.skills} onChange={handleSkillsChange} />;
      default:
        return null;
    }
  };

  // Optimization prompt handlers
  const handleGenerateOptimizationPrompt = () => {
    setOptimizationPrompt(getResumeOptimizationPrompt({ ...resume, sectionOrder, sectionVisibility }, jobDescription));
    setShowOptimizationPrompt(true);
    setCopiedOptimization(false);
  };
  const handleCopyOptimizationPrompt = () => {
    if (optimizationPrompt) {
      navigator.clipboard.writeText(optimizationPrompt);
      setCopiedOptimization(true);
      setTimeout(() => setCopiedOptimization(false), 1500);
    }
  };

  // Filter out invalid keys from sectionOrder before rendering/toggling
  const validKeys = getValidSectionKeys(resume);
  const filteredSectionOrder = Array.isArray(sectionOrder)
    ? sectionOrder.filter(key => validKeys.includes(key))
    : validKeys;

  // Add debug logs for sectionOrder, sectionVisibility, and resume
  console.log('sectionOrder:', sectionOrder);
  console.log('filteredSectionOrder:', filteredSectionOrder);
  console.log('sectionVisibility:', sectionVisibility);
  console.log('resume:', resume);

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 32, flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 350, maxWidth: 700 }}>
        <h2>Resume Builder</h2>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button onClick={handleUndo} disabled={history.length === 0}>Undo</button>
          <button onClick={handleRedo} disabled={future.length === 0}>Redo</button>
        </div>
        <ResumeImporter onImport={handleImport} />
        {/* Optimize Resume for Job Description */}
        <div style={{ marginBottom: 24, background: '#f5f6fa', padding: 16, borderRadius: 8 }}>
          <h3>Optimize Resume for Job Description</h3>
          <textarea
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            style={{ width: '100%', minHeight: 80, marginBottom: 8 }}
          />
          <button onClick={handleGenerateOptimizationPrompt} style={{ marginBottom: 8 }}>Generate Optimization Prompt</button>
          {showOptimizationPrompt && (
            <div style={{ marginBottom: 8 }}>
              <textarea
                value={optimizationPrompt}
                readOnly
                style={{ width: '100%', minHeight: 120, fontSize: 13, marginBottom: 4 }}
              />
              <button onClick={handleCopyOptimizationPrompt} style={{ marginRight: 8 }}>{copiedOptimization ? 'Copied!' : 'Copy Prompt'}</button>
            </div>
          )}
        </div>
        {/* Section toggles UI */}
        <div style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {filteredSectionOrder.map(key => {
            let label = '';
            if (key.startsWith('customSections-')) {
              const id = key.replace('customSections-', '');
              const section = resume.customSections.find(cs => cs.id === id);
              label = section?.name?.trim() ? section.name : 'Custom Section';
            } else {
              label = key.charAt(0).toUpperCase() + key.slice(1);
            }
            // Debug log for each toggle
            console.log('Toggle:', key, 'checked:', !!sectionVisibility[key]);
            return (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  type="checkbox"
                  checked={!!sectionVisibility[key]}
                  onChange={() => {
                    console.log('Toggling section:', key);
                    handleToggleSection(key);
                  }}
                />
                {label}
              </label>
            );
          })}
        </div>
        {/* Add Custom Section Buttons */}
        <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
          <button onClick={() => handleAddCustomSection('summary')}>Add Summary Section</button>
          <button onClick={() => handleAddCustomSection('list')}>Add List Section</button>
          <button onClick={() => handleAddCustomSection('combo')}>Add Combo Section</button>
        </div>
        {/* Drag-and-drop section order */}
        {(() => {
          const visibleSections = filteredSectionOrder.filter(key => sectionVisibility[key]);
          console.log('visibleSections:', visibleSections);
          return (
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={visibleSections} strategy={verticalListSortingStrategy}>
                {visibleSections.map(key => {
                  console.log('Rendering section:', key);
                  return (
                    <SortableSection key={key} id={key}>
                      {renderSectionComponent(key)}
                    </SortableSection>
                  );
                })}
              </SortableContext>
            </DndContext>
          );
        })()}
        <button onClick={handleSave} style={{ marginTop: 16 }}>Save Resume</button>
        <button onClick={() => import('../lib/pdfExporter').then(m => m.exportResumeToPDF({ ...resume, sectionOrder, sectionVisibility }))} style={{ marginTop: 16, marginLeft: 8 }}>
          Export as PDF
        </button>
      </div>
      <div style={{ flex: 1, minWidth: 350, maxWidth: 600, height: 900, border: '1px solid #eee', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
        <PDFErrorBoundary>
          <PDFViewer
            key={JSON.stringify({ sectionOrder, sectionVisibility, resume })}
            width="100%"
            height="100%"
          >
            <ResumePDF resume={{ ...resume, sectionOrder, sectionVisibility }} />
          </PDFViewer>
        </PDFErrorBoundary>
      </div>
    </div>
  );
}
