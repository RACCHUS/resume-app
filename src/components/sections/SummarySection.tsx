import React from 'react';
import styles from './SummarySection.module.css';

type Props = {
  summary: string;
  onChange: (summary: string) => void;
};

export default function SummarySection({ summary, onChange }: Props) {
  return (
    <section className={styles.summarySection}>
      <h3 className={styles.heading}>Summary</h3>
      <textarea
        className={styles.textarea}
        value={typeof summary === 'string' ? summary : ''}
        onChange={e => onChange(e.target.value)}
        placeholder="Write a brief professional summary..."
      />
    </section>
  );
}
