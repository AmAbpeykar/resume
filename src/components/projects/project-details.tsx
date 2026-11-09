'use client';

import { Plus, X } from 'lucide-react';
import { useRef, type ReactNode } from 'react';

export function ProjectDetails({ id, name, label, closeLabel, children }: {
  id: string;
  name: string;
  label: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className="project-details-trigger"
        aria-haspopup="dialog"
        aria-controls={id}
        aria-label={label + ' · ' + name}
        {...{ commandfor: id, command: 'show-modal' }}
        onClick={(event) => {
          event.preventDefault();
          if (!dialog.current?.open) dialog.current?.showModal();
        }}
      >
        <Plus size={17} aria-hidden="true" />
        {label}
      </button>
      <dialog ref={dialog} id={id} className="project-dialog" aria-labelledby={id + '-title'}>
        <div className="project-dialog-header">
          <h3 id={id + '-title'}><bdi dir="ltr" lang="en">{name}</bdi></h3>
          <form method="dialog">
            <button type="submit" className="project-dialog-close" aria-label={closeLabel}><X size={20} aria-hidden="true" /></button>
          </form>
        </div>
        <div className="project-dialog-body">{children}</div>
      </dialog>
    </>
  );
}
