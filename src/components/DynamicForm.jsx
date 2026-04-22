import React from "react";
import FieldRenderer from "./FieldRenderer";

/**
 * Main form wrapper.
 * Takes resolved schema + state and renders the full form.
 */
const DynamicForm = ({
  resolvedFields,
  values,
  errors,
  touched,
  isSubmitting,
  onSubmit,
  onReset,
  onChange,
  onBlur,
  onRemove,
  dynamicFieldNames = [],
  title,
  description,
}) => {
  // Check if any field currently has an error
  const hasErrors = Object.values(errors).some(
    (e) => e !== null && e !== undefined
  );

  return (
    <form
      className="dynamic-form"
      onSubmit={onSubmit}
      noValidate
      aria-label={title || "Dynamic Form"}
    >
      {/* Header (optional) */}
      {(title || description) && (
        <div className="form-header">
          {title && <h2 className="form-title">{title}</h2>}
          {description && (
            <p className="form-description">{description}</p>
          )}
        </div>
      )}

      {/* Render all fields from schema */}
      <div className="form-fields">
        {resolvedFields.map((field) => (
          <FieldRenderer
            key={field._id || field.name}
            field={field}
            value={values[field.name]}
            error={errors[field.name]}
            touched={touched[field.name]}
            onChange={onChange}
            onBlur={onBlur}
            // Allow remove only for dynamically added fields
            onRemove={
              dynamicFieldNames.includes(field.name)
                ? onRemove
                : undefined
            }
          />
        ))}
      </div>

      {/* Top-level error message */}
      {hasErrors && Object.keys(touched).length > 0 && (
        <div className="validation-summary" role="alert">
          <span className="summary-icon">⚠️</span>
          <span>
            Please fix the highlighted errors before submitting.
          </span>
        </div>
      )}

      {/* Form actions */}
      <div className="form-actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={onReset}
          disabled={isSubmitting}
        >
          Reset
        </button>

        <button
          type="submit"
          className="btn btn--primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? <span className="btn-spinner" /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;