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

export function ResumePDF({ resume }: { resume: Resume }) {
  const vis = resume.sectionVisibility || {};
  const sectionOrder = Array.isArray(resume.sectionOrder)
    ? resume.sectionOrder
    : ['header', 'summary', 'work', 'education', 'certifications', 'skills'];
  const customSectionsMap = new Map(
    (resume.customSections || []).map(cs => [`customSections-${cs.id}`, cs])
  );
  const pdfSections: React.ReactNode[] = [];

  for (const key of sectionOrder) {
    if (vis[key] === false) continue;
    if (key === 'header' && resume.header && resume.header.name) {
      pdfSections.push(
        <View key="header" style={styles.section}>
          <Text style={styles.header}>Header</Text>
          <Text style={{ fontSize: 16, fontWeight: 600 }}>{resume.header.name}</Text>
          <View style={styles.contact}>
            {Array.isArray(resume.header.contactInfo) && resume.header.contactInfo.map((c, i) => (
              <Text key={i} style={styles.contactItem}>{c.type}: {c.value}</Text>
            ))}
          </View>
        </View>
      );
    } else if (key === 'summary' && typeof resume.summary === 'string' && resume.summary) {
      pdfSections.push(
        <View key="summary" style={styles.section}>
          <Text style={styles.header}>Summary</Text>
          <Text style={styles.summary}>{resume.summary}</Text>
        </View>
      );
    } else if (key === 'work' && Array.isArray(resume.work) && resume.work.length > 0) {
      pdfSections.push(
        <View key="work" style={styles.section}>
          <Text style={styles.header}>Work Experience</Text>
          {resume.work.map((w, i) => (
            <View key={w.id} style={styles.job}>
              <Text style={styles.jobTitle}>{w.jobTitle} | {w.company} | {w.date}</Text>
              <View style={styles.bullets}>
                {Array.isArray(w.bullets) && w.bullets.map((b, j) => (
                  <Text key={j}>• {b}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      );
    } else if (key === 'education' && Array.isArray(resume.education) && resume.education.length > 0) {
      pdfSections.push(
        <View key="education" style={styles.section}>
          <Text style={styles.header}>Education</Text>
          {resume.education.map((e, i) => (
            <View key={e.id}>
              <Text style={{ fontWeight: 600 }}>{e.degree}</Text>
              <Text>{e.school} | {e.date}</Text>
              <View style={styles.bullets}>
                {Array.isArray(e.bullets) && e.bullets.map((b, j) => (
                  <Text key={j}>• {b}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      );
    } else if (key === 'certifications' && Array.isArray(resume.certifications) && resume.certifications.length > 0) {
      pdfSections.push(
        <View key="certifications" style={styles.section}>
          <Text style={styles.header}>Certifications</Text>
          {resume.certifications.map((c, i) => (
            <View key={c.id}>
              <Text style={{ fontWeight: 600 }}>{c.certification}</Text>
              <Text>{c.school} | {c.date}</Text>
              <View style={styles.bullets}>
                {Array.isArray(c.bullets) && c.bullets.map((b, j) => (
                  <Text key={j}>• {b}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      );
    } else if (key === 'skills' && Array.isArray(resume.skills) && resume.skills.length > 0) {
      pdfSections.push(
        <View key="skills" style={styles.section}>
          <Text style={styles.header}>Skills</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {resume.skills.map((s, i) => (
              <Text key={i} style={styles.skill}>{s}</Text>
            ))}
          </View>
        </View>
      );
    } else if (key.startsWith('customSections-')) {
      const section = customSectionsMap.get(key);
      if (!section) continue;
      if (
        section.type === 'combo' &&
        typeof section.content === 'object' &&
        section.content !== null &&
        !Array.isArray(section.content)
      ) {
        const comboContent = section.content as { summary?: string; items?: string[] };
        pdfSections.push(
          <View key={key} style={styles.custom}>
            <Text style={styles.header}>{section.name}</Text>
            {comboContent.summary && (
              <Text style={{ marginBottom: 4 }}>{comboContent.summary}</Text>
            )}
            {Array.isArray(comboContent.items) && comboContent.items.length > 0 && (
              <View style={styles.bullets}>
                {comboContent.items.map((item: string, j: number) => (
                  <Text key={j}>• {item}</Text>
                ))}
              </View>
            )}
          </View>
        );
      } else {
        pdfSections.push(
          <View key={key} style={styles.custom}>
            <Text style={styles.header}>{section.name}</Text>
            {section.type === 'summary' && (
              <Text>{section.content as string}</Text>
            )}
            {section.type === 'list' && Array.isArray(section.content) && (
              <View style={styles.bullets}>
                {(section.content as string[]).map((item, j) => (
                  <Text key={j}>• {item}</Text>
                ))}
              </View>
            )}
          </View>
        );
      }
    }
  }
  const onlyElements = pdfSections.filter(
    (el): el is React.ReactElement => React.isValidElement(el)
  );
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          {onlyElements.length === 0 ? (
            <Text>No sections to preview.</Text>
          ) : (
            onlyElements
          )}
        </View>
      </Page>
    </Document>
  );
}
