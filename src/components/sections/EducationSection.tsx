import React from 'react';
import { EducationSection as EducationSectionType } from '../../types/resume';

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
    onChange(education.filter((_, i) => i !== idx));
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
    <section style={{ marginBottom: 24 }}>
      <h3>Education</h3>
      {education.map((e, idx) => (
        <div key={e.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <input
              type="text"
              value={e.degree}
              onChange={ev => handleFieldChange(idx, 'degree', ev.target.value)}
              placeholder="Degree"
              style={{ flex: 1, minWidth: 120 }}
            />
            <input
              type="text"
              value={e.school}
              onChange={ev => handleFieldChange(idx, 'school', ev.target.value)}
              placeholder="School"
              style={{ flex: 1, minWidth: 120 }}
            />
            <input
              type="text"
              value={e.date}
              onChange={ev => handleFieldChange(idx, 'date', ev.target.value)}
              placeholder="Date"
              style={{ flex: 1, minWidth: 100 }}
            />
            <button onClick={() => handleRemoveEducation(idx)} style={{ color: 'red' }}>Delete</button>
          </div>
          <ul style={{ paddingLeft: 20 }}>
            {e.bullets.map((b, bulletIdx) => (
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
      <button onClick={handleAddEducation} style={{ marginTop: 8 }}>Add Education</button>
    </section>
  );
}
