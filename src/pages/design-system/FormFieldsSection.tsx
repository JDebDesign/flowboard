import { useState } from 'react';
import fields from '../../components/formFields.module.css';
import styles from './section.module.css';

export function FormFieldsSection() {
  const [text, setText] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('Medium');

  return (
    <section id="form-fields" className={styles.section}>
      <h2 className={styles.sectionTitle}>Form Fields</h2>
      <p className={styles.sectionDescription}>
        Shared styling from <code>src/components/formFields.module.css</code>, used by every form in the app. Every
        field below is real and typeable.
      </p>
      <div className={styles.formFieldDemo}>
        <div className={fields.field}>
          <label className={fields.label} htmlFor="ds-text-input">
            Text input
          </label>
          <input
            id="ds-text-input"
            className={fields.input}
            placeholder="Type here…"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className={fields.field}>
          <label className={fields.labelMuted} htmlFor="ds-textarea">
            Textarea
          </label>
          <textarea
            id="ds-textarea"
            className={fields.textarea}
            placeholder="Type here…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className={fields.field}>
          <label className={fields.labelMuted} htmlFor="ds-select">
            Select
          </label>
          <select
            id="ds-select"
            className={fields.select}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>
    </section>
  );
}
