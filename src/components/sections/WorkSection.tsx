import React from 'react';
import { WorkSection as WorkSectionType } from '../../types/resume';

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
    onChange(work.filter((_, i) => i !== idx));
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
    <section style={{ marginBottom: 24 }}>
      <h3>Work Experience</h3>
      {work.map((w, idx) => (
        <div key={w.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <input
              type="text"
              value={w.jobTitle}
              onChange={e => handleFieldChange(idx, 'jobTitle', e.target.value)}
              placeholder="Job Title"
              style={{ flex: 1, minWidth: 120 }}
            />
            <input
              type="text"
              value={w.company}
              onChange={e => handleFieldChange(idx, 'company', e.target.value)}
              placeholder="Company"
              style={{ flex: 1, minWidth: 120 }}
            />
            <input
              type="text"
              value={w.date}
              onChange={e => handleFieldChange(idx, 'date', e.target.value)}
              placeholder="Date"
              style={{ flex: 1, minWidth: 100 }}
            />
            <button onClick={() => handleRemoveJob(idx)} style={{ color: 'red' }}>Delete Job</button>
          </div>
          <ul style={{ paddingLeft: 20 }}>
            {w.bullets.map((b, bulletIdx) => (
              <li key={bulletIdx} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                <input
                  type="text"
                  value={b}
                  onChange={e => handleBulletChange(idx, bulletIdx, e.target.value)}
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
      <button onClick={handleAddJob} style={{ marginTop: 8 }}>Add Job</button>
    </section>
  );
}
