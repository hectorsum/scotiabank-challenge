'use client';

import { useState } from 'react';
import { ACCENT, PRIORITY_ORDER, STATUS_ORDER, STATUS_CONFIG, PRIORITY_CONFIG, FORM_CATEGORIES, getPriorityBars } from '@/lib/designTokens';
import type { Priority, Status } from '@/types';

interface FormValues {
  title: string;
  description: string;
  requester: string;
  category: string;
  priority: Priority;
  status: Status;
}

interface FormErrors {
  title?: string;
  description?: string;
  requester?: string;
  category?: string;
}

interface FormProps {
  mode: 'crear' | 'editar';
  initialValues?: Partial<FormValues>;
  isSubmitting?: boolean;
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}

const DEFAULT_VALUES: FormValues = {
  title: '',
  description: '',
  requester: '',
  category: '',
  priority: 'media',
  status: 'pendiente',
};

function validate(values: FormValues, mode: 'crear' | 'editar'): FormErrors {
  const errors: FormErrors = {};
  if (!values.title || values.title.trim().length < 5) {
    errors.title = 'El título debe tener al menos 5 caracteres.';
  }
  if (!values.description || values.description.trim().length < 10) {
    errors.description = 'La descripción debe tener al menos 10 caracteres.';
  }
  if (mode === 'crear' && !values.requester.trim()) {
    errors.requester = 'Indica el nombre del solicitante.';
  }
  if (!values.category) {
    errors.category = 'Selecciona una categoría.';
  }
  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-[6px] mt-[6px] text-error font-sans text-[12.5px]">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
      </svg>
      {message}
    </div>
  );
}

const fieldClass = (hasError: boolean) =>
  `gs-input w-full py-[11px] px-[14px] rounded-md bg-bg-surface font-sans text-[14.5px] text-fg-primary border ${hasError ? 'border-error' : 'border-[rgba(20,17,13,0.14)]'}`;

const LABEL_CLASS = 'block font-sans text-[13px] font-medium text-fg-primary mb-[7px]';

export function Form({ mode, initialValues, isSubmitting = false, onSubmit, onCancel }: FormProps) {
  const [values, setValues] = useState<FormValues>({ ...DEFAULT_VALUES, ...initialValues });
  const [errors, setErrors] = useState<FormErrors>({});

  const isEdit = mode === 'editar';

  const set = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = () => {
    const errs = validate(values, mode);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit(values);
  };

  const endpoint = isEdit
    ? `PUT /api/v1/solicitudes/${(initialValues as { id?: number })?.id ?? ''}`
    : 'POST /api/v1/solicitudes';

  return (
    <div className="gs-enter max-w-[760px]">
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-[7px] border-none bg-transparent cursor-pointer font-sans text-[13.5px] text-fg-muted mb-5 p-0"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {isEdit ? 'Volver al detalle' : 'Cancelar'}
      </button>

      <div className="bg-bg-surface border border-[rgba(20,17,13,0.09)] rounded-xl p-8">
        <h2 className="font-serif text-[30px] text-fg-primary tracking-[-0.01em] mb-[6px]">
          {isEdit ? 'Editar solicitud' : 'Nueva solicitud'}
        </h2>
        <p className="text-fg-muted text-[14px] mb-[26px] font-mono">{endpoint}</p>

        <div className="flex flex-col gap-[22px]">
          {/* Title */}
          <div>
            <label className={LABEL_CLASS}>
              Título <span className="text-error">*</span>
            </label>
            <input
              className={fieldClass(!!errors.title)}
              value={values.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Resumen breve de la solicitud"
            />
            <FieldError message={errors.title} />
          </div>

          {/* Description */}
          <div>
            <label className={LABEL_CLASS}>
              Descripción <span className="text-error">*</span>
            </label>
            <textarea
              className={`${fieldClass(!!errors.description)} resize-y leading-[1.55]`}
              value={values.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Detalle de lo solicitado, contexto y resultado esperado"
              rows={5}
            />
            <FieldError message={errors.description} />
          </div>

          <div className="gs-grid-2 grid grid-cols-2 gap-[18px]">
            {/* Requester */}
            <div>
              <label className={LABEL_CLASS}>
                Solicitante {!isEdit && <span className="text-error">*</span>}
              </label>
              {isEdit ? (
                <div className="py-[11px] px-[14px] rounded-md border border-[rgba(20,17,13,0.14)] bg-bg-page text-fg-muted font-sans text-[14.5px]">
                  {values.requester}
                </div>
              ) : (
                <>
                  <input
                    className={fieldClass(!!errors.requester)}
                    value={values.requester}
                    onChange={(e) => set('requester', e.target.value)}
                    placeholder="Nombre del solicitante"
                  />
                  <FieldError message={errors.requester} />
                </>
              )}
            </div>

            {/* Category */}
            <div>
              <label className={LABEL_CLASS}>
                Categoría <span className="text-error">*</span>
              </label>
              <select
                className={`${fieldClass(!!errors.category)} cursor-pointer`}
                value={values.category}
                onChange={(e) => set('category', e.target.value)}
              >
                <option value="">Selecciona una categoría…</option>
                {FORM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <FieldError message={errors.category} />
            </div>
          </div>

          {/* Priority — button group */}
          <div>
            <label className={LABEL_CLASS}>
              Prioridad <span className="text-error">*</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {PRIORITY_ORDER.map((key) => {
                const cfg = PRIORITY_CONFIG[key];
                const active = values.priority === key;
                const bars = getPriorityBars(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => set('priority', key)}
                    className="inline-flex items-center gap-2 py-[9px] px-4 rounded-md cursor-pointer font-sans text-[13.5px] font-medium"
                    style={{
                      border: `1px solid ${active ? ACCENT : 'rgba(20,17,13,0.12)'}`,
                      background: active ? 'rgba(200,150,90,0.12)' : '#FFFFFF',
                      color: active ? '#161310' : '#57534A',
                    }}
                  >
                    <span className="inline-flex items-end gap-[2px] h-[13px]">
                      {bars.map((b, i) => (
                        <span key={i} className="w-[3px] rounded-[1px]" style={{ height: b.h, background: b.bg }} />
                      ))}
                    </span>
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status (edit only) */}
          {isEdit && (
            <div className="gs-grid-2 grid grid-cols-2 gap-[18px]">
              <div>
                <label className={LABEL_CLASS}>Estado</label>
                <select
                  className={`${fieldClass(false)} cursor-pointer`}
                  value={values.status}
                  onChange={(e) => set('status', e.target.value as Status)}
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Submit row */}
        <div className="flex gap-3 mt-[30px] pt-6 border-t border-[rgba(20,17,13,0.08)]">
          <button
            className="gs-pbtn inline-flex items-center gap-2 px-6 h-[46px] border-none rounded-md text-white font-sans text-[14px] font-semibold"
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              background: ACCENT,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {isEdit ? 'Guardar cambios' : 'Crear solicitud'}
          </button>
          <button
            onClick={onCancel}
            className="px-6 h-[46px] border border-[rgba(20,17,13,0.14)] rounded-md bg-bg-surface text-fg-secondary font-sans text-[14px] font-medium cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
