import React from 'react';
import { CertificationSection as CertificationSectionType } from '../../types/resume';
import styles from './CertificationSection.module.css';

type Props = {
  certifications: CertificationSectionType[];
  onChange: (certifications: CertificationSectionType[]) => void;
};

export default function CertificationSection({ certifications, onChange }: Props) {
  const handleFieldChange = (idx: number, field: keyof CertificationSectionType, value: string) => {
    const updated = certifications.map((c, i) => i === idx ? { ...c, [field]: value } : c);
    onChange(updated);
  };

  const handleBulletChange = (idx: number, bulletIdx: number, value: string) => {
    const updated = certifications.map((c, i) =>
      i === idx ? { ...c, bullets: c.bullets.map((b, j) => j === bulletIdx ? value : b) } : c
    );
    onChange(updated);
  };

  const handleAddCertification = () => {
    onChange([
      ...certifications,
      { id: Date.now().toString(), certification: '', school: '', date: '', bullets: [] },
    ]);
  };

  const handleRemoveCertification = (idx: number) => {
    // Defensive: filter out any null/undefined and ensure all have id
    const filtered = certifications
      .filter((c, i) => i !== idx && c && typeof c === 'object' && c.id)
      .map(c => ({ ...c }));
    onChange(filtered);
  };

  const handleAddBullet = (idx: number) => {
    const updated = certifications.map((c, i) =>
      i === idx ? { ...c, bullets: [...c.bullets, ''] } : c
    );
    onChange(updated);
  };

  const handleRemoveBullet = (idx: number, bulletIdx: number) => {
    const updated = certifications.map((c, i) =>
      i === idx ? { ...c, bullets: c.bullets.filter((_, j) => j !== bulletIdx) } : c
    );
    onChange(updated);
  };

  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>Certifications</h3>
      {certifications.map((c, idx) => (
        <div key={c.id} className={styles.certCard}>
          <div className={styles.certInputs}>
            <input
              type="text"
              value={c.certification}
              onChange={ev => handleFieldChange(idx, 'certification', ev.target.value)}
              placeholder="Certification"
              className={styles.input}
            />
            <input
              type="text"
              value={c.school}
              onChange={ev => handleFieldChange(idx, 'school', ev.target.value)}
              placeholder="School"
              className={styles.input}
            />
            <input
              type="text"
              value={c.date}
              onChange={ev => handleFieldChange(idx, 'date', ev.target.value)}
              placeholder="Date"
              className={styles.input}
            />
            <button onClick={() => handleRemoveCertification(idx)} className={styles.deleteBtn}>Delete</button>
          </div>
          <ul className={styles.bulletList}>
            {c.bullets.map((b, bulletIdx) => (
              <li key={bulletIdx} className={styles.bulletItem}>
                <input
                  type="text"
                  value={b}
                  onChange={ev => handleBulletChange(idx, bulletIdx, ev.target.value)}
                  placeholder="Detail or achievement"
                  className={styles.bulletInput}
                />
                <button onClick={() => handleRemoveBullet(idx, bulletIdx)} className={styles.deleteBtn}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={() => handleAddBullet(idx)} className={styles.addBtn}>Add Bullet</button>
        </div>
      ))}
      <button onClick={handleAddCertification} className={styles.addBtn}>Add Certification</button>
    </section>
  );
}
