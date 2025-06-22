import React from 'react';
import { CustomSection } from '../../types/resume';
import styles from './CustomSection.module.css';

type Props = {
  customSections: CustomSection[];
  onChange: (customSections: CustomSection[]) => void;
};

// Fix: Defensive check for onChange in CustomSectionComponent
export default function CustomSectionComponent({ customSections, onChange }: Props) {
  const safeOnChange = (arr: CustomSection[]) => {
    if (typeof onChange === 'function') onChange(arr);
  };
  const handleNameChange = (idx: number, value: string) => {
    const updated = customSections.map((s, i) => i === idx ? { ...s, name: value } : s);
    safeOnChange(updated);
  };

  const handleTypeChange = (idx: number, value: CustomSection['type']) => {
    const updated = customSections.map((s, i) => i === idx ? { ...s, type: value } : s);
    safeOnChange(updated);
  };

  const handleContentChange = (idx: number, value: any) => {
    const updated = customSections.map((s, i) => i === idx ? { ...s, content: value } : s);
    safeOnChange(updated);
  };

  const handleAddSection = () => {
    safeOnChange([
      ...customSections,
      { id: Date.now().toString(), name: '', type: 'summary', content: '' },
    ]);
  };

  const handleRemoveSection = (idx: number) => {
    // Defensive: filter out any null/undefined and ensure all have id
    const filtered = customSections
      .filter((s, i) => i !== idx && s && typeof s === 'object' && s.id)
      .map(s => ({ ...s }));
    safeOnChange(filtered);
  };

  return (
    <section className={styles.section}>
      <h3>Custom Sections</h3>
      {customSections.map((section, idx) => (
        <div key={section.id} className={styles.sectionContainer}>
          <input
            type="text"
            value={section.name}
            onChange={e => handleNameChange(idx, e.target.value)}
            placeholder="Section Name"
            className={styles.nameInput}
          />
          <select
            value={section.type}
            onChange={e => handleTypeChange(idx, e.target.value as CustomSection['type'])}
            className={styles.typeSelect}
          >
            <option value="summary">Summary</option>
            <option value="list">List</option>
            <option value="combo">Combo</option>
          </select>
          {section.type === 'summary' && (
            <textarea
              value={typeof section.content === 'string' ? section.content : ''}
              onChange={e => handleContentChange(idx, e.target.value)}
              placeholder="Summary content..."
              className={styles.summaryTextarea}
            />
          )}
          {section.type === 'list' && (
            <div className={styles.listContainer}>
              {(Array.isArray(section.content) ? section.content : []).map((item, i) => (
                <div key={i} className={styles.listItem}>
                  <input
                    type="text"
                    value={item}
                    onChange={e => {
                      const arr = Array.isArray(section.content) ? [...section.content] : [];
                      arr[i] = e.target.value;
                      handleContentChange(idx, arr);
                    }}
                    placeholder="List item"
                    className={styles.listInput}
                  />
                  <button onClick={() => {
                    const arr = Array.isArray(section.content) ? [...section.content] : [];
                    arr.splice(i, 1);
                    handleContentChange(idx, arr);
                  }} className={styles.removeButton}>Remove</button>
                </div>
              ))}
              <button onClick={() => {
                const arr = Array.isArray(section.content) ? [...section.content] : [];
                arr.push('');
                handleContentChange(idx, arr);
              }} className={styles.addItemButton}>Add Item</button>
            </div>
          )}
          {section.type === 'combo' && (
            <div className={styles.comboContainer}>
              <textarea
                value={
                  typeof section.content === 'object' && !Array.isArray(section.content) && section.content !== null && 'summary' in section.content
                    ? section.content.summary || ''
                    : ''
                }
                onChange={e => {
                  let content: { summary: string; items: string[] } = { summary: '', items: [] };
                  if (typeof section.content === 'object' && !Array.isArray(section.content) && section.content !== null) {
                    content = {
                      summary: 'summary' in section.content ? section.content.summary || '' : '',
                      items: Array.isArray(section.content.items) ? section.content.items : [],
                    };
                  }
                  content.summary = e.target.value;
                  handleContentChange(idx, content);
                }}
                placeholder="Combo summary..."
                className={styles.comboSummaryTextarea}
              />
              {(
                typeof section.content === 'object' && !Array.isArray(section.content) && section.content !== null && Array.isArray(section.content.items)
                  ? section.content.items
                  : []
              ).map((item: string, i: number) => (
                <div key={i} className={styles.comboItem}>
                  <input
                    type="text"
                    value={item}
                    onChange={e => {
                      let arr = [] as string[];
                      if (typeof section.content === 'object' && !Array.isArray(section.content) && section.content !== null && Array.isArray(section.content.items)) {
                        arr = [...section.content.items];
                      }
                      arr[i] = e.target.value;
                      let content: { summary: string; items: string[] } = { summary: '', items: [] };
                      if (typeof section.content === 'object' && !Array.isArray(section.content) && section.content !== null) {
                        content = {
                          summary: 'summary' in section.content ? section.content.summary || '' : '',
                          items: arr,
                        };
                      } else {
                        content.items = arr;
                      }
                      handleContentChange(idx, content);
                    }}
                    placeholder="List item"
                    className={styles.comboInput}
                  />
                  <button onClick={() => {
                    let arr = [] as string[];
                    if (typeof section.content === 'object' && !Array.isArray(section.content) && section.content !== null && Array.isArray(section.content.items)) {
                      arr = [...section.content.items];
                    }
                    arr.splice(i, 1);
                    let content: { summary: string; items: string[] } = { summary: '', items: [] };
                    if (typeof section.content === 'object' && !Array.isArray(section.content) && section.content !== null) {
                      content = {
                        summary: 'summary' in section.content ? section.content.summary || '' : '',
                        items: arr,
                      };
                    } else {
                      content.items = arr;
                    }
                    handleContentChange(idx, content);
                  }} className={styles.removeButton}>Remove</button>
                </div>
              ))}
              <button onClick={() => {
                let arr = [] as string[];
                if (typeof section.content === 'object' && !Array.isArray(section.content) && section.content !== null && Array.isArray(section.content.items)) {
                  arr = [...section.content.items];
                }
                arr.push('');
                let content: { summary: string; items: string[] } = { summary: '', items: [] };
                if (typeof section.content === 'object' && !Array.isArray(section.content) && section.content !== null) {
                  content = {
                    summary: 'summary' in section.content ? section.content.summary || '' : '',
                    items: arr,
                  };
                } else {
                  content.items = arr;
                }
                handleContentChange(idx, content);
              }} className={styles.addItemButton}>Add Item</button>
            </div>
          )}
          <button onClick={() => handleRemoveSection(idx)} className={styles.deleteButton}>Delete Section</button>
        </div>
      ))}
    </section>
  );
}
