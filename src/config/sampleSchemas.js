/**
 * Sample Form Configurations
 * Demonstrates all supported field types, validation rules, and conditional logic.
 */

// helpers
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[\d\s\-()]{7,15}$/;

// 1. User Registration Form
export const registrationSchema = [
  {
    type: "text",
    name: "firstName",
    label: "First Name",
    placeholder: "John",
    defaultValue: "",
    validation: {
      required: { message: "First name is required." },
      minLength: { value: 2, message: "At least 2 characters." },
      maxLength: { value: 30, message: "Max 30 characters." },
    },
  },
  {
    type: "text",
    name: "lastName",
    label: "Last Name",
    placeholder: "Doe",
    defaultValue: "",
    validation: {
      required: { message: "Last name is required." },
      minLength: { value: 2, message: "At least 2 characters." },
    },
  },
  {
    type: "email",
    name: "email",
    label: "Email Address",
    placeholder: "john.doe@example.com",
    defaultValue: "",
    validation: {
      required: { message: "Email is required." },
      pattern: {
        value: emailRegex,
        message: "Enter a valid email address.",
      },
    },
  },
  {
    type: "password",
    name: "password",
    label: "Password",
    placeholder: "Min 8 characters",
    defaultValue: "",
    validation: {
      required: { message: "Password is required." },
      minLength: { value: 8, message: "Password must be at least 8 characters." },
      pattern: {
        value: /(?=.*[A-Z])(?=.*\d)/,
        message: "Must contain at least one uppercase letter and one number.",
      },
    },
  },
  {
    type: "password",
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Re-enter password",
    defaultValue: "",
    validation: {
      required: { message: "Please confirm your password." },
      customValidator: (value, allValues) =>
        value !== allValues.password ? "Passwords do not match." : null,
    },
  },
  {
    type: "select",
    name: "accountType",
    label: "Account Type",
    defaultValue: "",
    options: [
      { label: "Individual", value: "individual" },
      { label: "Business", value: "business" },
      { label: "Non-Profit", value: "nonprofit" },
    ],
    validation: {
      required: { message: "Please select an account type." },
    },
  },
  {
    type: "text",
    name: "companyName",
    label: "Company / Organisation Name",
    placeholder: "Acme Corp",
    defaultValue: "",
    showWhen: { field: "accountType", operator: "neq", value: "individual" },
    validation: {
      required: { message: "Company name is required for business accounts." },
      minLength: { value: 2, message: "At least 2 characters." },
    },
  },
  {
    type: "tel",
    name: "phone",
    label: "Phone Number",
    placeholder: "+1 555 000 0000",
    defaultValue: "",
    validation: {
      pattern: {
        value: phoneRegex,
        message: "Enter a valid phone number.",
      },
    },
  },
  {
    type: "checkbox",
    name: "agreeTerms",
    label: "I agree to the Terms and Conditions",
    defaultValue: false,
    validation: {
      required: { message: "You must accept the terms to continue." },
    },
  },
];

// 2. Job Application Form
export const jobApplicationSchema = [
  {
    type: "text",
    name: "fullName",
    label: "Full Name",
    placeholder: "Jane Smith",
    defaultValue: "",
    validation: {
      required: { message: "Full name is required." },
      minLength: { value: 3, message: "At least 3 characters." },
    },
  },
  {
    type: "email",
    name: "applicantEmail",
    label: "Email",
    placeholder: "jane@example.com",
    defaultValue: "",
    validation: {
      required: { message: "Email is required." },
      pattern: { value: emailRegex, message: "Enter a valid email." },
    },
  },
  {
    type: "select",
    name: "position",
    label: "Position Applied For",
    defaultValue: "",
    options: [
      { label: "Frontend Engineer", value: "frontend" },
      { label: "Backend Engineer", value: "backend" },
      { label: "Full-Stack Engineer", value: "fullstack" },
      { label: "Designer", value: "designer" },
      { label: "Product Manager", value: "pm" },
    ],
    validation: {
      required: { message: "Please select a position." },
    },
  },
  {
    type: "number",
    name: "yearsExperience",
    label: "Years of Experience",
    placeholder: "3",
    defaultValue: "",
    validation: {
      required: { message: "Required." },
      min: { value: 0, message: "Cannot be negative." },
      max: { value: 50, message: "Please enter a realistic value." },
    },
  },
  {
    type: "multiselect",
    name: "techStack",
    label: "Tech Stack (select all that apply)",
    defaultValue: [],
    options: [
      { label: "React", value: "react" },
      { label: "Vue", value: "vue" },
      { label: "Angular", value: "angular" },
      { label: "Node.js", value: "node" },
      { label: "Python", value: "python" },
      { label: "Go", value: "go" },
      { label: "Figma", value: "figma" },
    ],
    showWhen: {
      any: [
        { field: "position", operator: "eq", value: "frontend" },
        { field: "position", operator: "eq", value: "backend" },
        { field: "position", operator: "eq", value: "fullstack" },
        { field: "position", operator: "eq", value: "designer" },
      ],
    },
  },
  {
    type: "url",
    name: "portfolioUrl",
    label: "Portfolio / GitHub URL",
    placeholder: "https://github.com/janedoe",
    defaultValue: "",
    showWhen: {
      any: [
        { field: "position", operator: "eq", value: "frontend" },
        { field: "position", operator: "eq", value: "fullstack" },
        { field: "position", operator: "eq", value: "designer" },
      ],
    },
    validation: {
      pattern: {
        value: /^https?:\/\/.+/,
        message: "Enter a valid URL starting with http:// or https://",
      },
    },
  },
  {
    type: "range",
    name: "salaryExpectation",
    label: "Salary Expectation (₹ LPA)",
    defaultValue: 10,
    min: 3,
    max: 100,
    step: 1,
    validation: {
      min: { value: 3, message: "Minimum ₹3 LPA." },
      max: { value: 100, message: "Maximum ₹100 LPA." },
    },
  },
  {
    type: "textarea",
    name: "coverLetter",
    label: "Cover Letter",
    placeholder: "Tell us why you'd be a great fit…",
    defaultValue: "",
    rows: 5,
    validation: {
      required: { message: "Cover letter is required." },
      minLength: { value: 50, message: "Please write at least 50 characters." },
      maxLength: { value: 1000, message: "Max 1000 characters." },
    },
  },
  {
    type: "radio",
    name: "workMode",
    label: "Preferred Work Mode",
    defaultValue: "",
    options: [
      { label: "Remote", value: "remote" },
      { label: "On-site", value: "onsite" },
      { label: "Hybrid", value: "hybrid" },
    ],
    validation: {
      required: { message: "Please select a work mode." },
    },
  },
];

// 3. Blank / Empty schema (used by the Schema Builder tab)
export const blankSchema = [];
