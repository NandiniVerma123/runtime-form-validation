import React from "react";

/**
 * FieldRenderer
 * Renders the correct HTML control for a given field config.
 */
const FieldRenderer = ({ field, value, error, touched, onChange, onBlur, onRemove }) => {
  if (field.hidden) return null;

  const hasError = touched && error;

  const baseProps = {
    id: `field-${field.name}`,
    name: field.name,
    "aria-invalid": hasError ? "true" : "false",
    "aria-describedby": hasError ? `error-${field.name}` : undefined,
    onBlur: () => onBlur(field.name),
    className: `field-input${hasError ? " field-input--error" : ""}`,
  };

  const renderControl = () => {
    switch (field.type) {
      //Text-like inputs
      case "text":
      case "email":
      case "password":
      case "tel":
      case "url":
        return (
          <input
            {...baseProps}
            type={field.type}
            value={value ?? ""}
            placeholder={field.placeholder || ""}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        );

      // Number
      case "number":
        return (
          <input
            {...baseProps}
            type="number"
            value={value ?? ""}
            placeholder={field.placeholder || ""}
            min={field.min}
            max={field.max}
            step={field.step || 1}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        );

      // Textarea
      case "textarea":
        return (
          <textarea
            {...baseProps}
            value={value ?? ""}
            placeholder={field.placeholder || ""}
            rows={field.rows || 4}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        );

      // Select
      case "select":
        return (
          <select
            {...baseProps}
            value={value ?? ""}
            onChange={(e) => onChange(field.name, e.target.value)}
          >
            <option value="">— Select —</option>
            {(field.options || []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      // Multi-select (checkboxes)
      case "multiselect": {
        const selected = Array.isArray(value) ? value : [];
        return (
          <div className="multiselect-group" role="group" aria-label={field.label}>
            {(field.options || []).map((opt) => (
              <label key={opt.value} className="multiselect-option">
                <input
                  type="checkbox"
                  checked={selected.includes(opt.value)}
                  onChange={(e) => {
                    const next = e.target.checked
                      ? [...selected, opt.value]
                      : selected.filter((v) => v !== opt.value);
                    onChange(field.name, next);
                  }}
                  onBlur={() => onBlur(field.name)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );
      }

      // Radio group
      case "radio":
        return (
          <div className="radio-group" role="radiogroup" aria-label={field.label}>
            {(field.options || []).map((opt) => (
              <label key={opt.value} className="radio-option">
                <input
                  type="radio"
                  name={field.name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={() => onChange(field.name, opt.value)}
                  onBlur={() => onBlur(field.name)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );

      // Checkbox (single boolean) 
      case "checkbox":
        return (
          <label className="checkbox-label">
            <input
              type="checkbox"
              id={baseProps.id}
              name={field.name}
              checked={!!value}
              onChange={(e) => onChange(field.name, e.target.checked)}
              onBlur={() => onBlur(field.name)}
            />
            <span>{field.label}</span>
          </label>
        );

      // Range slider
      case "range":
        return (
          <div className="range-wrapper">
            <input
              {...baseProps}
              type="range"
              value={value ?? field.min ?? 0}
              min={field.min ?? 0}
              max={field.max ?? 100}
              step={field.step ?? 1}
              onChange={(e) => onChange(field.name, Number(e.target.value))}
            />
            <span className="range-value">{value ?? field.min ?? 0}</span>
          </div>
        );

      // Date Picker
      case "date":
        return (
          <input
            {...baseProps}
            type="date"
            value={value ?? ""}
            onChange={(e) => onChange(field.name, e.target.value)}
          />
        );

      default:
        return (
          <p className="field-unsupported">Unsupported field type: {field.type}</p>
        );
    }
  };

  return (
    <div className={`field-wrapper${field.type === "checkbox" ? " field-wrapper--inline" : ""}`}>
      {/* Label — skip for checkbox (rendered inside control) */}
      {field.type !== "checkbox" && (
        <label htmlFor={`field-${field.name}`} className="field-label">
          {field.label}
          {field.validation?.required && <span className="required-star">*</span>}
          {field.type === "range" && field.showWhen && <span className="conditional-badge">conditional</span>}
        </label>
      )}

      {/* Hint text */}
      {field.hint && <p className="field-hint">{field.hint}</p>}

      {/* The actual input */}
      {renderControl()}

      {/* Error message */}
      {hasError && (
        <p id={`error-${field.name}`} className="field-error" role="alert">
          {error}
        </p>
      )}

      {/* Remove button (only shown for dynamically-added fields) */}
      {onRemove && (
        <button
          type="button"
          className="field-remove-btn"
          onClick={() => onRemove(field.name)}
          aria-label={`Remove ${field.label} field`}
        >
          ✕ Remove field
        </button>
      )}
    </div>
  );
};

export default FieldRenderer;
