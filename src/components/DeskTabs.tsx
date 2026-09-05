import { useRef } from 'react';

interface Props<T extends string> {
  id: string;
  label: string;
  items: readonly { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  primary?: boolean;
}

export default function DeskTabs<T extends string>({ id, label, items, value, onChange, primary }: Props<T>) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className={`desk-tabs${primary ? ' desk-tabs--mode' : ''}`} role="tablist" aria-label={label}>
      {items.map((item, index) => (
        <button
          key={item.id}
          ref={el => { buttons.current[index] = el; }}
          type="button"
          role="tab"
          id={`${id}-tab-${item.id}`}
          aria-controls={`${id}-panel-${item.id}`}
          aria-selected={value === item.id}
          tabIndex={value === item.id ? 0 : -1}
          onClick={() => onChange(item.id)}
          onKeyDown={event => {
            const next = event.key === 'ArrowRight' ? (index + 1) % items.length
              : event.key === 'ArrowLeft' ? (index + items.length - 1) % items.length
              : event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : null;
            if (next === null) return;
            event.preventDefault();
            onChange(items[next].id);
            buttons.current[next]?.focus();
          }}
        >{item.label}</button>
      ))}
    </div>
  );
}
