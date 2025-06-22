import React from 'react';
import styles from './SkillsSection.module.css';

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
    <section className={styles.section}>
      <h2 className={styles.sectionHeader}>Skills</h2>
      <ul className={styles.skillList}>
        {skills.map((skill, idx) => (
          <li key={idx} className={styles.skillItem}>
            <input
              type="text"
              value={skill}
              onChange={e => handleSkillChange(idx, e.target.value)}
              placeholder="Skill"
              className={styles.input}
            />
            <button onClick={() => handleRemoveSkill(idx)} className={styles.deleteBtn}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddSkill} className={styles.addBtn}>Add Skill</button>
    </section>
  );
}
