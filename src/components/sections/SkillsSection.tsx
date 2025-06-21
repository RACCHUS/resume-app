import React from 'react';

type Props = {
  skills: string[];
  onChange: (skills: string[]) => void;
};

export default function SkillsSection({ skills, onChange }: Props) {
  const handleSkillChange = (idx: number, value: string) => {
    const updated = skills.map((s, i) => (i === idx ? value : s));
    onChange(updated);
  };

  const handleAddSkill = () => {
    onChange([...skills, '']);
  };

  const handleRemoveSkill = (idx: number) => {
    // Defensive: filter out any null/undefined and ensure all are non-empty strings
    const filtered = skills
      .filter((s, i) => i !== idx && typeof s === 'string' && s.trim())
      .map(s => s.trim());
    onChange(filtered);
  };

  return (
    <section style={{ marginBottom: 24 }}>
      <h3>Skills</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {skills.map((skill, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              type="text"
              value={skill}
              onChange={e => handleSkillChange(idx, e.target.value)}
              placeholder="Skill"
              style={{ width: 120 }}
            />
            <button onClick={() => handleRemoveSkill(idx)} style={{ color: 'red' }}>Remove</button>
          </div>
        ))}
        <button onClick={handleAddSkill} style={{ marginLeft: 8 }}>Add Skill</button>
      </div>
      <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {skills.map((skill, idx) => (
          <span key={idx} style={{ background: '#e3e9f6', borderRadius: 6, padding: '4px 12px', marginBottom: 4, fontSize: 15 }}>
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
