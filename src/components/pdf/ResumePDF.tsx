import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Resume } from '../../types/resume';

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 12, fontFamily: 'Helvetica' },
  section: { marginBottom: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  contact: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  contactItem: { marginRight: 16 },
  summary: { marginBottom: 8 },
  job: { marginBottom: 8 },
  jobTitle: { fontWeight: 'bold' },
  bullets: { marginLeft: 12 },
  skill: { marginRight: 8, marginBottom: 4, backgroundColor: '#e3e9f6', borderRadius: 4, padding: '2px 8px' },
  custom: { marginBottom: 8 },
});

// SafeText to prevent errors from bad data
const SafeText = ({ children, ...props }: { children: React.ReactNode; style?: any }) => {
  let text = '';
  if (typeof children === 'string') {
    text = children;
  } else if (children == null) {
    text = '';
  } else {
    try {
      text = children.toString();
    } catch {
      text = '[Invalid Text]';
    }
  }
  return <Text {...props}>{text}</Text>;
};

export function ResumePDF({ resume }: { resume: Resume }) {
  const vis = resume.sectionVisibility || {};
  const sectionOrder = Array.isArray(resume.sectionOrder)
    ? resume.sectionOrder
    : ['header', 'summary', 'work', 'education', 'certifications', 'skills'];

  // Map of custom sections by ID for easy lookup
  const customSectionsMap = new Map(
    (resume.customSections || []).map(cs => [`customSections-${cs.id}`, cs])
  );

  // Helper to safely filter and map array data by unique stable IDs
  function renderListSection<T extends { id?: string }>(
    items: T[] | undefined,
    renderItem: (item: T) => React.ReactNode,
    sectionName: string
  ) {
    if (!Array.isArray(items)) {
      console.warn(`renderListSection: items for ${sectionName} is not an array.`, items);
      return null;
    }
    const filteredItems = items.filter(
      (item, index) => {
        const isValid = item && typeof item === 'object' && (item.id !== undefined && item.id !== null);
        if (!isValid) {
          console.error(`renderListSection: Invalid item found in ${sectionName} at index ${index}:`, item);
        }
        return isValid;
      }
    );
    if (filteredItems.length === 0) {
      console.log(`renderListSection: No valid items for ${sectionName}.`);
      return null;
    }
    // Map and filter out any null/invalid React elements
    const renderedItems = filteredItems.map((item, idx) => {
      const rendered = renderItem(item);
      if (!React.isValidElement(rendered)) {
        if (rendered !== null) {
          console.error(`renderListSection: renderItem for ${sectionName} at idx ${idx} did not return a valid React element:`, rendered);
        }
        return null;
      }
      return <View key={item.id ?? idx}>{rendered}</View>;
    }).filter(Boolean);
    if (renderedItems.length === 0) {
      console.log(`renderListSection: All items for ${sectionName} were filtered out after renderItem.`);
      return null;
    }
    return (
      <View key={sectionName} style={styles.section}>
        <SafeText style={styles.header}>{capitalize(sectionName)}</SafeText>
        {renderedItems}
      </View>
    );
  }

  // Capitalize helper
  function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function renderPDFSection(key: string) {
    if (!vis[key]) return null;
    try {
      switch (key) {
        case 'header': {
          const header = resume.header;
          if (!header) return null;
          if (!header.name?.trim() && (!header.contactInfo || header.contactInfo.length === 0)) {
            return null;
          }
          const contacts = Array.isArray(header.contactInfo)
            ? header.contactInfo.filter(c => c && c.type && c.value)
            : [];
          return (
            <View key="header" style={styles.section}>
              {header.name && <SafeText style={{ fontSize: 16, fontWeight: 600 }}>{header.name}</SafeText>}
              <View style={styles.contact}>
                {contacts.map((c, i) => (
                  <SafeText key={i} style={styles.contactItem}>
                    {(c.type || '') + ': ' + (c.value || '')}
                  </SafeText>
                ))}
              </View>
            </View>
          );
        }
        case 'summary': {
          if (!resume.summary?.trim()) return null;
          return (
            <View key="summary" style={styles.section}>
              <SafeText style={styles.header}>Summary</SafeText>
              <SafeText style={styles.summary}>{resume.summary}</SafeText>
            </View>
          );
        }
        case 'work': {
          return renderListSection(
            resume.work,
            (w) => {
              // Defensive: skip if no jobTitle, company, or date
              if (!w || (!w.jobTitle?.trim() && !w.company?.trim() && !w.date?.trim())) {
                return null;
              }
              const bullets = Array.isArray(w.bullets)
                ? w.bullets.filter(b => typeof b === 'string' && b.trim())
                : [];
              return (
                <View>
                  {w.jobTitle && <SafeText style={styles.jobTitle}>{w.jobTitle}</SafeText>}
                  {w.company && <SafeText>{w.company}</SafeText>}
                  {w.date && <SafeText>{w.date}</SafeText>}
                  {bullets.length > 0 && (
                    <View style={styles.bullets}>
                      {bullets.map((b, j) => (
                        <SafeText key={j}>• {b}</SafeText>
                      ))}
                    </View>
                  )}
                </View>
              );
            },
            'work experience'
          );
        }
        case 'education': {
          return renderListSection(
            resume.education,
            (e) => {
              // Defensive: skip if no degree, school, or date
              if (!e || (!e.degree?.trim() && !e.school?.trim() && !e.date?.trim())) {
                return null;
              }
              const bullets = Array.isArray(e.bullets)
                ? e.bullets.filter(b => typeof b === 'string' && b.trim())
                : [];
              return (
                <View>
                  {e.degree && <SafeText style={{ fontWeight: 600 }}>{e.degree}</SafeText>}
                  {e.school && <SafeText>{e.school}</SafeText>}
                  {e.date && <SafeText>{e.date}</SafeText>}
                  {bullets.length > 0 && (
                    <View style={styles.bullets}>
                      {bullets.map((b, j) => (
                        <SafeText key={j}>• {b}</SafeText>
                      ))}
                    </View>
                  )}
                </View>
              );
            },
            'education'
          );
        }
        case 'certifications': {
          return renderListSection(
            resume.certifications,
            (c) => {
              // Defensive: skip if no certification, school, or date
              if (!c || (!c.certification?.trim() && !c.school?.trim() && !c.date?.trim())) {
                return null;
              }
              const bullets = Array.isArray(c.bullets)
                ? c.bullets.filter(b => typeof b === 'string' && b.trim())
                : [];
              return (
                <View>
                  {c.certification && <SafeText style={{ fontWeight: 600 }}>{c.certification}</SafeText>}
                  {c.school && <SafeText>{c.school}</SafeText>}
                  {c.date && <SafeText>{c.date}</SafeText>}
                  {bullets.length > 0 && (
                    <View style={styles.bullets}>
                      {bullets.map((b, j) => (
                        <SafeText key={j}>• {b}</SafeText>
                      ))}
                    </View>
                  )}
                </View>
              );
            },
            'certifications'
          );
        }
        case 'skills': {
          if (!Array.isArray(resume.skills)) return null;
          const skillItems = resume.skills.filter(s => typeof s === 'string' && s.trim());
          if (skillItems.length === 0) return null;
          return (
            <View key="skills" style={styles.section}>
              <SafeText style={styles.header}>Skills</SafeText>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {skillItems.map((s, i) => (
                  <SafeText key={i} style={styles.skill}>
                    {s}
                  </SafeText>
                ))}
              </View>
            </View>
          );
        }
        default: {
          if (key.startsWith('customSections-')) {
            const custom = customSectionsMap.get(key);
            if (!custom) return null;
            const content = typeof custom.content === 'string'
              ? custom.content
              : (custom.content ? JSON.stringify(custom.content) : '');
            if (!custom.name && !content) return null;
            return (
              <View key={key} style={styles.section}>
                <SafeText style={styles.header}>{custom.name || ''}</SafeText>
                <SafeText style={styles.custom}>{content || ''}</SafeText>
              </View>
            );
          }
          return null;
        }
      }
    } catch (error) {
      console.error(`Error rendering section ${key}:`, error);
      return (
        <View key={`error-${key}`} style={styles.section}>
          <SafeText style={{ color: 'red' }}>Error rendering section: {key}</SafeText>
        </View>
      );
    }
  }

  // Deep runtime check: log and validate all section data before rendering
  React.useEffect(() => {
    console.log('ResumePDF: resume prop', JSON.parse(JSON.stringify(resume)));
    if (!resume.header || typeof resume.header !== 'object') {
      console.error('ResumePDF: header is missing or invalid', resume.header);
    }
    if (!Array.isArray(resume.work)) {
      console.error('ResumePDF: work is not an array', resume.work);
    }
    if (!Array.isArray(resume.education)) {
      console.error('ResumePDF: education is not an array', resume.education);
    }
    if (!Array.isArray(resume.certifications)) {
      console.error('ResumePDF: certifications is not an array', resume.certifications);
    }
    if (!Array.isArray(resume.skills)) {
      console.error('ResumePDF: skills is not an array', resume.skills);
    }
    if (!Array.isArray(resume.customSections)) {
      console.error('ResumePDF: customSections is not an array', resume.customSections);
    }
  }, [resume]);

  // Compose sections respecting order and filtering invalid
  const pdfSections = sectionOrder
    .map(key => {
      const section = renderPDFSection(key);
      return React.isValidElement(section) ? section : null;
    })
    .filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          {pdfSections.length === 0 ? (
            <View style={styles.section}>
              <SafeText>No visible sections to preview.</SafeText>
            </View>
          ) : (
            pdfSections
          )}
        </View>
      </Page>
    </Document>
  );
}
