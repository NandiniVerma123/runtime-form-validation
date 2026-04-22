import React, { useState } from "react";

/**
 * Panel used to create new form fields dynamically.
 * This updates the live schema when user adds a field.
 */

const FIELD_TYPES = [
  "text", "email", "password", "tel", "url",
  "number", "textarea", "select", "radio",
  "multiselect", "checkbox", "range", "date",
];

const DEFAULT_OPTION = { label: "", value: "" };

// Initial state for new field form
const empty = {
  type: "text",
  name: "",
  label: "",
  placeholder: "",
  defaultValue: "",
  hint: "",
  required: false,
  minLength: "",
  maxLength: "",
  min: "",
  max: "",
  pattern: "",
  options: [],
};

const AddFieldPanel = ({ onAdd, existingNames = [] }) => {
  const [form, setForm] = useState(empty);
  const [optionDraft, setOptionDraft] = useState(DEFAULT_OPTION);
  const [localError, setLocalError] = useState("");

  // Generic setter for form fields
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // Add new option (for select, radio, etc.)
  const addOption = () => {
    if (!optionDraft.label || !optionDraft.value) return;

    set("options", [...form.options, { ...optionDraft }]);
    setOptionDraft(DEFAULT_OPTION);
  };

  // Remove option by index
  const removeOption = (idx) =>
    set("options", form.options.filter((_, i) => i !== idx));

  // Main handler to add field into schema
  const handleAdd = () => {
    setLocalError("");

    // Basic validations
    if (!form.name.trim()) return setLocalError("Field name is required.");
    if (!form.label.trim()) return setLocalError("Label is required.");

    if (existingNames.includes(form.name.trim()))
      return setLocalError(`Field name "${form.name}" already exists.`);

    if (/\s/.test(form.name.trim()))
      return setLocalError("Field name must not contain spaces.");

    // Build validation object dynamically
    const validation = {};

    if (form.required) {
      validation.required = { message: "This field is required." };
    }

    if (form.minLength) {
      validation.minLength = {
        value: Number(form.minLength),
        message: `Min ${form.minLength} chars.`,
      };
    }

    if (form.maxLength) {
      validation.maxLength = {
        value: Number(form.maxLength),
        message: `Max ${form.maxLength} chars.`,
      };
    }

    if (form.min !== "") {
      validation.min = {
        value: Number(form.min),
        message: `Min value: ${form.min}.`,
      };
    }

    if (form.max !== "") {
      validation.max = {
        value: Number(form.max),
        message: `Max value: ${form.max}.`,
      };
    }

    if (form.pattern) {
      validation.pattern = {
        value: form.pattern,
        message: `Does not match pattern.`,
      };
    }

    // Final field object pushed to schema
    const field = {
      type: form.type,
      name: form.name.trim(),
      label: form.label.trim(),
      placeholder: form.placeholder,
      defaultValue: form.defaultValue,
      hint: form.hint,
      validation: Object.keys(validation).length ? validation : undefined,
      options: form.options.length ? form.options : undefined,
    };

    // Send field to parent (updates live schema)
    onAdd(field);

    // Reset panel form
    setForm(empty);
  };

  // Helpers to control UI rendering
  const needsOptions = ["select", "radio", "multiselect"].includes(form.type);
  const isText = ["text", "email", "password", "tel", "url", "textarea"].includes(form.type);
  const isNumeric = ["number", "range"].includes(form.type);

  return (
    <div className="add-field-panel">
      <h3 className="panel-title">➕ Add Custom Field</h3>

      {/* Field Type */}
      <div className="panel-row">
        <label className="panel-label">Type</label>
        <select
          className="panel-select"
          value={form.type}
          onChange={(e) => set("type", e.target.value)}
        >
          {FIELD_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Field Name */}
      <div className="panel-row">
        <label className="panel-label">
          Field Name <span className="required-star">*</span>
        </label>
        <input
          className="panel-input"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. middleName"
        />
      </div>

      {/* Label */}
      <div className="panel-row">
        <label className="panel-label">
          Label <span className="required-star">*</span>
        </label>
        <input
          className="panel-input"
          value={form.label}
          onChange={(e) => set("label", e.target.value)}
          placeholder="e.g. Middle Name"
        />
      </div>

      {/* Optional inputs */}
      <div className="panel-row">
        <label className="panel-label">Placeholder</label>
        <input
          className="panel-input"
          value={form.placeholder}
          onChange={(e) => set("placeholder", e.target.value)}
          placeholder="Optional"
        />
      </div>

      <div className="panel-row">
        <label className="panel-label">Default Value</label>
        <input
          className="panel-input"
          value={form.defaultValue}
          onChange={(e) => set("defaultValue", e.target.value)}
          placeholder="Optional"
        />
      </div>

      <div className="panel-row">
        <label className="panel-label">Hint Text</label>
        <input
          className="panel-input"
          value={form.hint}
          onChange={(e) => set("hint", e.target.value)}
          placeholder="Helper text shown below label"
        />
      </div>

      {/* Validation Section */}
      <div className="panel-section-title">Validation Rules</div>

      <div className="panel-row panel-row--inline">
        <input
          type="checkbox"
          id="af-required"
          checked={form.required}
          onChange={(e) => set("required", e.target.checked)}
        />
        <label htmlFor="af-required">Required</label>
      </div>

      {/* Text-specific validations */}
      {isText && (
        <>
          <div className="panel-row">
            <label className="panel-label">Min Length</label>
            <input
              className="panel-input"
              type="number"
              value={form.minLength}
              onChange={(e) => set("minLength", e.target.value)}
            />
          </div>

          <div className="panel-row">
            <label className="panel-label">Max Length</label>
            <input
              className="panel-input"
              type="number"
              value={form.maxLength}
              onChange={(e) => set("maxLength", e.target.value)}
            />
          </div>
        </>
      )}

      {/* Pattern validation */}
      {(isText || isNumeric) && (
        <div className="panel-row">
          <label className="panel-label">Pattern (RegExp)</label>
          <input
            className="panel-input"
            value={form.pattern}
            onChange={(e) => set("pattern", e.target.value)}
            placeholder="e.g. ^[A-Za-z]+$"
          />
        </div>
      )}

      {/* Numeric validations */}
      {isNumeric && (
        <>
          <div className="panel-row">
            <label className="panel-label">Min Value</label>
            <input
              className="panel-input"
              type="number"
              value={form.min}
              onChange={(e) => set("min", e.target.value)}
            />
          </div>

          <div className="panel-row">
            <label className="panel-label">Max Value</label>
            <input
              className="panel-input"
              type="number"
              value={form.max}
              onChange={(e) => set("max", e.target.value)}
            />
          </div>
        </>
      )}

      {/* Options section (for select, radio, etc.) */}
      {needsOptions && (
        <div className="panel-options">
          <div className="panel-section-title">Options</div>

          {form.options.map((opt, i) => (
            <div key={i} className="panel-option-row">
              <span className="panel-option-chip">
                {opt.label} ({opt.value})
              </span>
              <button
                type="button"
                className="option-remove-btn"
                onClick={() => removeOption(i)}
              >
                ✕
              </button>
            </div>
          ))}

          <div className="panel-option-add">
            <input
              className="panel-input"
              value={optionDraft.label}
              onChange={(e) =>
                setOptionDraft((o) => ({ ...o, label: e.target.value }))
              }
              placeholder="Label"
            />
            <input
              className="panel-input"
              value={optionDraft.value}
              onChange={(e) =>
                setOptionDraft((o) => ({ ...o, value: e.target.value }))
              }
              placeholder="Value"
            />
            <button
              type="button"
              className="btn btn--sm btn--outline"
              onClick={addOption}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Local error */}
      {localError && <p className="panel-error">{localError}</p>}

      <button
        type="button"
        className="btn btn--primary btn--full"
        onClick={handleAdd}
      >
        Add Field to Form
      </button>
    </div>
  );
};

export default AddFieldPanel;