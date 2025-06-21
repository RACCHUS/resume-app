import React from 'react';
import { Resume, HeaderSection as HeaderSectionType } from '../../types/resume';

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
    <section style={{ marginBottom: 24 }}>
      <input
        type="text"
        value={header.name}
        onChange={handleNameChange}
        placeholder="Full Name"
        style={{ fontSize: 20, fontWeight: 600, width: '100%', marginBottom: 8 }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {header.contactInfo.map((c, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <input
              type="text"
              value={c.type}
              onChange={e => {
                const updated = header.contactInfo.map((ci, i) => i === idx ? { ...ci, type: e.target.value } : ci);
                onChange({ ...header, contactInfo: updated });
              }}
              placeholder="Type (e.g. Email)"
              style={{ width: 90 }}
            />
            <input
              type="text"
              value={c.value}
              onChange={e => handleContactChange(idx, e.target.value)}
              placeholder="Value"
              style={{ width: 160 }}
            />
            <button onClick={() => handleRemoveContact(idx)} style={{ color: 'red' }}>Remove</button>
          </div>
        ))}
        <button onClick={handleAddContact} style={{ marginLeft: 8 }}>Add Contact</button>
      </div>
    </section>
  );
}
