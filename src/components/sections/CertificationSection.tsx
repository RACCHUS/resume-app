import React from 'react';
import { CertificationSection as CertificationSectionType } from '../../types/resume';

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
    onChange(certifications.filter((_, i) => i !== idx));
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
    <section style={{ marginBottom: 24 }}>
      <h3>Certifications</h3>
      {certifications.map((c, idx) => (
        <div key={c.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <input
              type="text"
              value={c.certification}
              onChange={ev => handleFieldChange(idx, 'certification', ev.target.value)}
              placeholder="Certification"
              style={{ flex: 1, minWidth: 120 }}
            />
            <input
              type="text"
              value={c.school}
              onChange={ev => handleFieldChange(idx, 'school', ev.target.value)}
              placeholder="School"
              style={{ flex: 1, minWidth: 120 }}
            />
            <input
              type="text"
              value={c.date}
              onChange={ev => handleFieldChange(idx, 'date', ev.target.value)}
              placeholder="Date"
              style={{ flex: 1, minWidth: 100 }}
            />
            <button onClick={() => handleRemoveCertification(idx)} style={{ color: 'red' }}>Delete</button>
          </div>
          <ul style={{ paddingLeft: 20 }}>
            {c.bullets.map((b, bulletIdx) => (
              <li key={bulletIdx} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                <input
                  type="text"
                  value={b}
                  onChange={ev => handleBulletChange(idx, bulletIdx, ev.target.value)}
                  placeholder="Detail or achievement"
                  style={{ flex: 1 }}
                />
                <button onClick={() => handleRemoveBullet(idx, bulletIdx)} style={{ color: 'red' }}>Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={() => handleAddBullet(idx)} style={{ marginTop: 4 }}>Add Bullet</button>
        </div>
      ))}
      <button onClick={handleAddCertification} style={{ marginTop: 8 }}>Add Certification</button>
    </section>
  );
}
