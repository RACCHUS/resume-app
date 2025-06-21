import React from 'react';

type Props = {
  summary: string;
  onChange: (summary: string) => void;
};

export default function SummarySection({ summary, onChange }: Props) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h3>Summary</h3>
      <textarea
        value={summary}
        onChange={e => onChange(e.target.value)}
        placeholder="Write a brief professional summary..."
        style={{ width: '100%', minHeight: 60, fontSize: 16, borderRadius: 6, padding: 8 }}
      />
    </section>
  );
}
