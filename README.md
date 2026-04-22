# Runtime Validation

A powerful React-based dynamic form validation engine with runtime schema evaluation, conditional field rendering, and a live schema builder.

## Features

- **Dynamic Form Generation** – Create forms from JSON schemas at runtime
- **Validation Engine** – Comprehensive validation rules (required, minLength, maxLength, pattern, custom validators, etc.)
- **Conditional Logic** – Show/hide fields based on other field values using conditional expressions
- **Schema Builder** – Live UI to construct custom form schemas
- **Sample Forms** – Pre-built examples (User Registration, Job Application)
- **Real-time Feedback** – Field-level error messages and validation status
- **Responsive Design** – Works seamlessly across different screen sizes

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will start at `http://localhost:5173` with hot module reloading.

### Build

```bash
npm build
```

### Lint

```bash
npm run lint
```

## Project Structure

```
src/
├── components/          # React UI components
│   ├── DynamicForm.jsx         # Main form renderer
│   ├── FieldRenderer.jsx       # Individual field rendering
│   ├── AddFieldPanel.jsx       # Schema builder panel
│   └── SubmitResult.jsx        # Result display
├── engine/              # Core validation logic
│   ├── validationEngine.js     # Field validation rules
│   └── conditionalEngine.js    # Conditional field logic
├── hooks/               # Custom React hooks
│   └── useFormEngine.js        # Form state management
├── config/
│   └── sampleSchemas.js        # Example form schemas
└── App.jsx              # Main application
```

## Usage

### Using Pre-built Forms

The application includes sample forms in the tabs:
- **Registration** – Standard user registration form
- **Job Application** – Form with conditional fields
- **Schema Builder** – Custom form creation tool

### Creating Custom Schemas

Define a schema as an array of field objects:

```javascript
const mySchema = [
  {
    type: "text",
    name: "username",
    label: "Username",
    placeholder: "Enter username",
    validation: {
      required: { message: "Username is required" },
      minLength: { value: 3, message: "At least 3 characters" },
    },
  },
  {
    type: "email",
    name: "email",
    label: "Email Address",
    validation: {
      required: { message: "Email is required" },
    },
  },
];
```

## Validation Rules

Supported validation rules:
- `required` – Field must have a value
- `minLength` – Minimum string length
- `maxLength` – Maximum string length
- `pattern` – Regular expression match
- `min` – Minimum numeric value
- `max` – Maximum numeric value
- Custom validators – Define your own validation logic

## Conditional Fields

Show fields conditionally based on other field values:

```javascript
{
  type: "checkbox",
  name: "hasExperience",
  label: "Do you have relevant experience?",
},
{
  type: "text",
  name: "yearsOfExperience",
  label: "Years of Experience",
  visible: "hasExperience === true", // Shown only when hasExperience is true
}
```

## Technology Stack

- **React 19** – UI framework
- **Vite** – Build tool with HMR
- **ESLint** – Code linting

## License

MIT
