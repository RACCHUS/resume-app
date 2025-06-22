import React from 'react';
import { WorkSection as WorkSectionType } from '../../types/resume';
import styles from './WorkSection.module.css';

type Props = {
  work: WorkSectionType[];
  onChange: (work: WorkSectionType[]) => void;
};

export default function WorkSection({ work, onChange }: Props) {
  const handleFieldChange = (idx: number, field: keyof WorkSectionType, value: string) => {
    const updated = work.map((w, i) => i === idx ? { ...w, [field]: value } : w);
    onChange(updated);
  };

  const handleBulletChange = (idx: number, bulletIdx: number, value: string) => {
    const updated = work.map((w, i) =>
      i === idx ? { ...w, bullets: w.bullets.map((b, j) => j === bulletIdx ? value : b) } : w
    );
    onChange(updated);
  };

  const handleAddJob = () => {
    onChange([
      ...work,
      { id: Date.now().toString(), jobTitle: '', company: '', date: '', bullets: [] },
    ]);
  };

  const handleRemoveJob = (idx: number) => {
    // Defensive: filter out any null/undefined and ensure all have id
    const filtered = work
      .filter((w, i) => i !== idx && w && typeof w === 'object' && w.id)
      .map(w => ({ ...w }));
    onChange(filtered);
  };

  const handleAddBullet = (idx: number) => {
    const updated = work.map((w, i) =>
      i === idx ? { ...w, bullets: [...w.bullets, ''] } : w
    );
    onChange(updated);
  };

  const handleRemoveBullet = (idx: number, bulletIdx: number) => {
    const updated = work.map((w, i) =>
      i === idx ? { ...w, bullets: w.bullets.filter((_, j) => j !== bulletIdx) } : w
    );
    onChange(updated);
  };

  return (
    <section className={styles.workSection}>
      <h3>Work Experience</h3>
      {work.map((w, idx) => (
        <div key={w.id} className={styles.workItem}>
          <div className={styles.workHeader}>
            <input
              type="text"
              value={w.jobTitle}
              onChange={e => handleFieldChange(idx, 'jobTitle', e.target.value)}
              placeholder="Job Title"
              className={styles.jobTitle}
            />
            <input
              type="text"
              value={w.company}
              onChange={e => handleFieldChange(idx, 'company', e.target.value)}
              placeholder="Company"
              className={styles.company}
            />
            <input
              type="text"
              value={w.date}
              onChange={e => handleFieldChange(idx, 'date', e.target.value)}
              placeholder="Date"
              className={styles.date}
            />
            <button onClick={() => handleRemoveJob(idx)} className={styles.deleteBtn}>Delete Job</button>
          </div>
          <ul className={styles.bulletList}>
            {w.bullets.map((b, bulletIdx) => (
              <li key={bulletIdx} className={styles.bulletItem}>
                <input
                  type="text"
                  value={b}
                  onChange={e => handleBulletChange(idx, bulletIdx, e.target.value)}
                  placeholder="Detail or achievement"
                  className={styles.bulletInput}
                />
                <button onClick={() => handleRemoveBullet(idx, bulletIdx)} className={styles.removeBulletBtn}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={() => handleAddBullet(idx)} className={styles.addBulletBtn}>Add Bullet</button>
        </div>
      ))}
      <button onClick={handleAddJob} className={styles.addBtn}>Add Job</button>
    </section>
  );
}
