/**
 * Conditional Logic Engine
 * Resolves which fields should be visible / active based on `showWhen` rules.
 */

/**
 * Evaluate a single condition object against current form values.
 * Condition shape: { field, operator, value }
 * Supported operators: eq, neq, gt, lt, gte, lte, includes, notEmpty
 */
function evaluateCondition(condition, values) {
  const { field, operator = "eq", value: expected } = condition;
  const actual = values[field];

  switch (operator) {
    case "eq":
      return String(actual) === String(expected);
    case "neq":
      return String(actual) !== String(expected);
    case "gt":
      return Number(actual) > Number(expected);
    case "lt":
      return Number(actual) < Number(expected);
    case "gte":
      return Number(actual) >= Number(expected);
    case "lte":
      return Number(actual) <= Number(expected);
    case "includes":
      return Array.isArray(actual)
        ? actual.includes(expected)
        : String(actual).includes(expected);
    case "notEmpty":
      return actual !== undefined && actual !== null && actual !== "";
    default:
      return true;
  }
}

/**
 * Determine whether a field should be visible.
 * `showWhen` can be:
 *   - undefined/null  → always visible
 *   - a single condition object
 *   - an array of conditions (all must pass — AND logic)
 *   - { any: [conditions] }  (OR logic)
 *   - { all: [conditions] }  (AND logic – same as array)
 */
export function isFieldVisible(field, values) {
  const { showWhen } = field;
  if (!showWhen) return true;

  // OR logic
  if (showWhen.any) {
    return showWhen.any.some((c) => evaluateCondition(c, values));
  }

  // AND logic (explicit object)
  if (showWhen.all) {
    return showWhen.all.every((c) => evaluateCondition(c, values));
  }

  // Array → AND logic
  if (Array.isArray(showWhen)) {
    return showWhen.every((c) => evaluateCondition(c, values));
  }

  // Single condition object
  return evaluateCondition(showWhen, values);
}

/**
 * Resolve visibility for every field and attach a `hidden` flag.
 * Returns a new array of field configs (does not mutate originals).
 */
export function resolveVisibility(fields, values) {
  return fields.map((field) => ({
    ...field,
    hidden: !isFieldVisible(field, values),
  }));
}
