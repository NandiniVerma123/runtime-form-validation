import React, { useState } from "react";

/**
 * SubmitResult
 * Displays the structured JSON payload returned on a valid form submission.
 */
const SubmitResult = ({ data, onClose }) => {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="submit-result" role="dialog" aria-modal="true" aria-label="Submission result">
      <div className="submit-result__inner">
        {/* Header */}
        <div className="submit-result__header">
          <div className="submit-result__icon">✅</div>
          <div>
            <h3 className="submit-result__title">Form Submitted Successfully</h3>
            <p className="submit-result__subtitle">Structured JSON output below</p>
          </div>
          <button
            className="submit-result__close"
            onClick={onClose}
            aria-label="Close result"
          >
            ✕
          </button>
        </div>

        {/* JSON output */}
        <div className="submit-result__body">
          <pre className="submit-result__json">{json}</pre>
        </div>

        {/* Footer */}
        <div className="submit-result__footer">
          <button className="btn btn--ghost" onClick={onClose}>
            Close
          </button>
          <button className="btn btn--primary" onClick={handleCopy}>
            {copied ? "✓ Copied!" : "Copy JSON"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitResult;
