/**
 * Validation Engine
 * Evaluates each field's rules and returns an error message or null.
 */

export function validateField(value, rules = {}, allValues = {}) {
  if (!rules) return null;

  // required
  if (rules.required) {
    const empty =
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0);
    if (empty) return rules.required.message || "This field is required.";
  }

  // Skip remaining rules when value is empty (not required or passed required)
  const isEmpty =
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "");
  if (isEmpty) return null;

  // minLength
  if (rules.minLength !== undefined) {
    const { value: min, message } = normaliseRule(rules.minLength);
    if (String(value).length < min)
      return message || `Minimum ${min} characters required.`;
  }

  // maxLength
  if (rules.maxLength !== undefined) {
    const { value: max, message } = normaliseRule(rules.maxLength);
    if (String(value).length > max)
      return message || `Maximum ${max} characters allowed.`;
  }

  // min (numeric)
  if (rules.min !== undefined) {
    const { value: min, message } = normaliseRule(rules.min);
    if (Number(value) < Number(min))
      return message || `Minimum value is ${min}.`;
  }

  // max (numeric)
  if (rules.max !== undefined) {
    const { value: max, message } = normaliseRule(rules.max);
    if (Number(value) > Number(max))
      return message || `Maximum value is ${max}.`;
  }

  // pattern
  if (rules.pattern !== undefined) {
    const { value: pattern, message } = normaliseRule(rules.pattern);
    const regex =
      pattern instanceof RegExp ? pattern : new RegExp(pattern);
    if (!regex.test(String(value)))
      return message || "Value does not match the required pattern.";
  }

  // customValidator — receives (value, allValues) and returns string|null
  if (typeof rules.customValidator === "function") {
    const result = rules.customValidator(value, allValues);
    if (result) return result;
  }

  return null;
}

/**
 * Validate every field in a schema against a values map.
 * @param {Array}  fields     — Array of field config objects
 * @param {Object} values     — { [name]: value }
 * @param {Object} allValues  — Same as values; passed for cross-field access
 * @returns {Object}          — { [name]: errorString | null }
 */
export function validateAll(fields, values, allValues) {
  const errors = {};
  for (const field of fields) {
    if (field.hidden) continue; // skip hidden conditional fields
    errors[field.name] = validateField(
      values[field.name],
      field.validation,
      allValues || values
    );
  }
  return errors;
}

/**
 * Returns true if an errors map contains zero non-null entries.
 */
export function isFormValid(errors) {
  return Object.values(errors).every((e) => e === null || e === undefined);
}

// helpers

/** Normalise a rule that may be a plain value or { value, message }. */
function normaliseRule(rule) {
  if (rule !== null && typeof rule === "object" && "value" in rule) {
    return rule;
  }
  return { value: rule, message: undefined };
}
