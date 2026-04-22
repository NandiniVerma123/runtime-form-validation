import React, { useState } from "react";
import "./App.css";
import { useFormEngine } from "./hooks/useFormEngine";
import DynamicForm from "./components/DynamicForm";
import AddFieldPanel from "./components/AddFieldPanel";
import SubmitResult from "./components/SubmitResult";
import { registrationSchema, jobApplicationSchema } from "./config/sampleSchemas";

// Tab definitions
const TABS = [
  { id: "registration", label: "📋 Registration", icon: "📋" },
  { id: "job", label: "💼 Job Application", icon: "💼" },
  { id: "builder", label: "🛠 Schema Builder", icon: "🛠" },
];

// Per-tab form metadata
const FORM_META = {
  registration: {
    title: "User Registration",
    description: "Create your account — all fields marked * are required.",
    schema: registrationSchema,
  },
  job: {
    title: "Job Application",
    description:
      "Apply for an open position. Conditional fields will appear based on your selections.",
    schema: jobApplicationSchema,
  },
  builder: {
    title: "Custom Form Builder",
    description:
      "Build your own form schema live. Use the panel on the right to add fields, then submit to see the JSON output.",
    schema: [],
  },
};

// FormPage — renders one form tab
function FormPage({ meta, showBuilder = false }) {
  const [dynamicNames, setDynamicNames] = useState([]);
  const [showPanel, setShowPanel] = useState(false);

  const {
    resolvedFields,
    values,
    errors,
    touched,
    isSubmitting,
    submitResult,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    addField,
    removeField,
    schema,
  } = useFormEngine(meta.schema, null);

  const handleAddField = (fieldConfig) => {
    addField(fieldConfig);
    setDynamicNames((n) => [...n, fieldConfig.name]);
  };

  const handleRemove = (name) => {
    removeField(name);
    setDynamicNames((n) => n.filter((x) => x !== name));
  };

  const handleFormReset = () => {
    handleReset();
    setDynamicNames([]);
  };

  // For non-builder tabs, all added fields are "dynamic" (removable)
  const removableNames = showBuilder
    ? dynamicNames
    : dynamicNames;

  return (
    <div className={`form-page${showBuilder ? " form-page--builder" : ""}`}>
      {/* Left: form */}
      <div className="form-page__left">
        {/* Schema builder toolbar */}
        {showBuilder && (
          <div className="builder-toolbar">
            <span className="builder-toolbar__badge">
              {schema.length} field{schema.length !== 1 ? "s" : ""}
            </span>
            <button
              type="button"
              className={`btn btn--outline btn--sm${showPanel ? " active" : ""}`}
              onClick={() => setShowPanel((p) => !p)}
            >
              {showPanel ? "✕ Close Panel" : "➕ Add Field"}
            </button>
          </div>
        )}

        {schema.length === 0 && showBuilder ? (
          <div className="empty-state">
            <div className="empty-state__icon">🧩</div>
            <h3>Your form is empty</h3>
            <p>Click <strong>Add Field</strong> to start building your schema.</p>
          </div>
        ) : (
          <DynamicForm
            resolvedFields={resolvedFields}
            values={values}
            errors={errors}
            touched={touched}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onReset={handleFormReset}
            onChange={handleChange}
            onBlur={handleBlur}
            onRemove={handleRemove}
            dynamicFieldNames={showBuilder ? schema.map((f) => f.name) : removableNames}
            title={meta.title}
            description={meta.description}
          />
        )}
      </div>

      {/* Right: add-field panel (builder tab) or floating button (other tabs) */}
      {showBuilder ? (
        showPanel && (
          <div className="form-page__right">
            <AddFieldPanel
              onAdd={handleAddField}
              existingNames={schema.map((f) => f.name)}
            />
          </div>
        )
      ) : (
        <div className="form-page__right form-page__right--static">
          {/* Add Extra Fields Panel — available on pre-defined forms too */}
          <div className="sidebar-card">
            <h3 className="sidebar-card__title">➕ Add Extra Fields</h3>
            <p className="sidebar-card__desc">
              Extend this form with custom fields at runtime.
            </p>
            <AddFieldPanel
              onAdd={handleAddField}
              existingNames={schema.map((f) => f.name)}
            />
          </div>

          {/* Live schema view */}
          <div className="sidebar-card sidebar-card--schema">
            <h3 className="sidebar-card__title">📄 Live Schema</h3>
            <pre className="schema-preview">
              {JSON.stringify(
                schema.map(({ _id, ...f }) => f),
                null,
                2
              )}
            </pre>
          </div>
        </div>
      )}

      {/* Submit result overlay */}
      {submitResult && (
        <SubmitResult data={submitResult} onClose={handleFormReset} />
      )}
    </div>
  );
}

// App root
export default function App() {
  const [activeTab, setActiveTab] = useState("registration");
  const meta = FORM_META[activeTab];

  return (
    <div className="app">
      {/* Top nav */}
      <header className="app-header">
        <div className="app-header__brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-name">FormForge</span>
          <span className="brand-tag">Runtime Validation Engine</span>
        </div>

        <nav className="tab-nav" role="tablist" aria-label="Form examples">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`tab-btn${activeTab === tab.id ? " tab-btn--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main className="app-main">
        <FormPage
          key={activeTab}
          meta={meta}
          showBuilder={activeTab === "builder"}
        />
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          FormForge · Dynamic Form Builder with Runtime Validation
        </p>
      </footer>
    </div>
  );
}
