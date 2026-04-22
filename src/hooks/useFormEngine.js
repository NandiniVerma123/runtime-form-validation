import { useState, useCallback, useRef } from "react";
import { validateField, validateAll, isFormValid } from "../engine/validationEngine";
import { resolveVisibility } from "../engine/conditionalEngine";

/**
 * useFormEngine
 * Central hook that manages form state, validation, and conditional visibility.
 */

export function useFormEngine(initialSchema, onSubmit) {
  // schema (fields list)
  const [schema, setSchema] = useState(() => normaliseSchema(initialSchema));

  // values
  const [values, setValues] = useState(() => buildInitialValues(initialSchema));

  // errors
  const [errors, setErrors] = useState({});

  // touched (validate-on-change only after first touch)
  const [touched, setTouched] = useState({});

  // submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  // Keep a stable ref for schema so callbacks don't go stale
  const schemaRef = useRef(schema);
  schemaRef.current = schema;

  // resolved fields (with hidden flags)
  const resolvedFields = resolveVisibility(schema, values);

  // handlers

  /** Called when a field value changes */
  const handleChange = useCallback(
    (name, value) => {
      setValues((prev) => {
        const next = { ...prev, [name]: value };

        // Re-validate changed field if it was already touched
        setTouched((t) => {
          if (t[name]) {
            const field = schemaRef.current.find((f) => f.name === name);
            const err = field
              ? validateField(value, field.validation, next)
              : null;
            setErrors((e) => ({ ...e, [name]: err }));
          }
          return { ...t, [name]: true };
        });

        return next;
      });
    },
    []
  );

  /** Called when a field loses focus */
  const handleBlur = useCallback(
    (name) => {
      setTouched((t) => ({ ...t, [name]: true }));
      setValues((prev) => {
        const field = schemaRef.current.find((f) => f.name === name);
        const err = field
          ? validateField(prev[name], field.validation, prev)
          : null;
        setErrors((e) => ({ ...e, [name]: err }));
        return prev;
      });
    },
    []
  );

  /** Form submit handler */
  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault();
      setIsSubmitting(true);
      setSubmitResult(null);

      const visible = resolveVisibility(schemaRef.current, values);
      const allErrors = validateAll(visible, values, values);

      setErrors(allErrors);
      setTouched(
        visible.reduce((acc, f) => ({ ...acc, [f.name]: true }), {})
      );

      if (!isFormValid(allErrors)) {
        setIsSubmitting(false);
        return;
      }

      // Build output — only visible fields
      const output = {};
      visible.forEach((f) => {
        if (!f.hidden) output[f.name] = values[f.name] ?? "";
      });

      setSubmitResult(output);
      if (typeof onSubmit === "function") await onSubmit(output);
      setIsSubmitting(false);
    },
    [values, onSubmit]
  );

  /** Reset the form to initial state */
  const handleReset = useCallback(() => {
    setSchema(normaliseSchema(initialSchema));
    setValues(buildInitialValues(initialSchema));
    setErrors({});
    setTouched({});
    setSubmitResult(null);
  }, [initialSchema]);

  // field management (add / remove)

  /** Add a new field to the schema */
  const addField = useCallback((fieldConfig) => {
    const field = { ...fieldConfig, _id: crypto.randomUUID() };
    setSchema((prev) => [...prev, field]);
    setValues((prev) => ({
      ...prev,
      [field.name]: field.defaultValue ?? defaultValueForType(field.type),
    }));
  }, []);

  /** Remove a field by its name */
  const removeField = useCallback((name) => {
    setSchema((prev) => prev.filter((f) => f.name !== name));
    setValues((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  /** Update an existing field's config */
  const updateField = useCallback((name, updates) => {
    setSchema((prev) =>
      prev.map((f) => (f.name === name ? { ...f, ...updates } : f))
    );
  }, []);

  return {
    // state
    schema,
    resolvedFields,
    values,
    errors,
    touched,
    isSubmitting,
    submitResult,
    // handlers
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    // field management
    addField,
    removeField,
    updateField,
  };
}

// utilities

function normaliseSchema(schema) {
  return schema.map((f) => ({ _id: f._id || crypto.randomUUID(), ...f }));
}

function buildInitialValues(schema) {
  return schema.reduce((acc, field) => {
    acc[field.name] =
      field.defaultValue !== undefined
        ? field.defaultValue
        : defaultValueForType(field.type);
    return acc;
  }, {});
}

function defaultValueForType(type) {
  switch (type) {
    case "checkbox":
      return false;
    case "multiselect":
      return [];
    case "number":
    case "range":
      return "";
    default:
      return "";
  }
}
