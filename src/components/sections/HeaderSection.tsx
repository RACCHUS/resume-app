import React from 'react';
import { Resume, HeaderSection as HeaderSectionType } from '../../types/resume';
import styles from './HeaderSection.module.css';

type Props = {
  header: HeaderSectionType;
  onChange: (header: HeaderSectionType) => void;
};

export default function HeaderSection({ header, onChange }: Props) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...header, name: e.target.value });
  };

  const handleContactChange = (idx: number, value: string) => {
    const updated = header.contactInfo.map((c, i) => i === idx ? { ...c, value } : c);
    onChange({ ...header, contactInfo: updated });
  };

  const handleAddContact = () => {
    onChange({ ...header, contactInfo: [...header.contactInfo, { type: '', value: '' }] });
  };

  const handleRemoveContact = (idx: number) => {
    onChange({ ...header, contactInfo: header.contactInfo.filter((_, i) => i !== idx) });
  };

  return (
    <section className={styles.section}>
      {/* Save/Export buttons are now handled by the parent, not here */}
      <input
        type="text"
        value={header.name}
        onChange={handleNameChange}
        placeholder="Full Name"
        className={styles.nameInput}
      />
      <div>
        {header.contactInfo.map((c, idx) => (
          <div key={idx} className={styles.contactRow}>
            <input
              type="text"
              value={c.type}
              onChange={e => {
                const updated = header.contactInfo.map((ci, i) => i === idx ? { ...ci, type: e.target.value } : ci);
                onChange({ ...header, contactInfo: updated });
              }}
              placeholder="Type (e.g. Email)"
              className={styles.contactTypeInput}
            />
            <input
              type="text"
              value={c.value}
              onChange={e => handleContactChange(idx, e.target.value)}
              placeholder="Value"
              className={styles.contactValueInput}
            />
            <button onClick={() => handleRemoveContact(idx)} className={styles.removeBtn}>Remove</button>
          </div>
        ))}
        <button onClick={handleAddContact} className={styles.addBtn}>Add Contact</button>
      </div>
    </section>
  );
}
