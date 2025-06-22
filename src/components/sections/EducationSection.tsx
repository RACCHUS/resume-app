import React from 'react';
import { EducationSection as EducationSectionType } from '../../types/resume';
import styles from './EducationSection.module.css';

type Props = {
  education: EducationSectionType[];
  onChange: (education: EducationSectionType[]) => void;
};

export default function EducationSection({ education, onChange }: Props) {
  const handleFieldChange = (idx: number, field: keyof EducationSectionType, value: string) => {
    const updated = education.map((e, i) => i === idx ? { ...e, [field]: value } : e);
    onChange(updated);
  };

  const handleBulletChange = (idx: number, bulletIdx: number, value: string) => {
    const updated = education.map((e, i) =>
      i === idx ? { ...e, bullets: e.bullets.map((b, j) => j === bulletIdx ? value : b) } : e
    );
    onChange(updated);
  };

  const handleAddEducation = () => {
    onChange([
      ...education,
      { id: Date.now().toString(), degree: '', school: '', date: '', bullets: [] },
    ]);
  };

  const handleRemoveEducation = (idx: number) => {
    // Defensive: filter out any null/undefined and ensure all have id
    const filtered = education
      .filter((e, i) => i !== idx && e && typeof e === 'object' && e.id)
      .map(e => ({ ...e }));
    onChange(filtered);
  };

  const handleAddBullet = (idx: number) => {
    const updated = education.map((e, i) =>
      i === idx ? { ...e, bullets: [...e.bullets, ''] } : e
    );
    onChange(updated);
  };

  const handleRemoveBullet = (idx: number, bulletIdx: number) => {
    const updated = education.map((e, i) =>
      i === idx ? { ...e, bullets: e.bullets.filter((_, j) => j !== bulletIdx) } : e
    );
    onChange(updated);
  };

  return (
    <section className={styles.section}>
      <h3 className={styles.heading}>Education</h3>
      {education.map((e, idx) => (
        <div key={e.id} className={styles.educationItem}>
          <div className={styles.educationFields}>
            <input
              type="text"
              value={e.degree}
              onChange={ev => handleFieldChange(idx, 'degree', ev.target.value)}
              placeholder="Degree"
              className={styles.input}
            />
            <input
              type="text"
              value={e.school}
              onChange={ev => handleFieldChange(idx, 'school', ev.target.value)}
              placeholder="School"
              className={styles.input}
            />
            <input
              type="text"
              value={e.date}
              onChange={ev => handleFieldChange(idx, 'date', ev.target.value)}
              placeholder="Date"
              className={styles.input}
            />
            <button onClick={() => handleRemoveEducation(idx)} className={styles.deleteBtn}>Delete</button>
          </div>
          <ul className={styles.bulletsList}>
            {e.bullets.map((b, bulletIdx) => (
              <li key={bulletIdx} className={styles.bulletItem}>
                <input
                  type="text"
                  value={b}
                  onChange={ev => handleBulletChange(idx, bulletIdx, ev.target.value)}
                  placeholder="Detail or achievement"
                  className={styles.input}
                />
                <button onClick={() => handleRemoveBullet(idx, bulletIdx)} className={styles.removeBulletBtn}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={() => handleAddBullet(idx)} className={styles.addBulletBtn}>Add Bullet</button>
        </div>
      ))}
      <button onClick={handleAddEducation} className={styles.addBtn}>Add Education</button>
    </section>
  );
}
