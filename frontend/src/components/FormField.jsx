import React from 'react';

export default function FormField({ label, required, children, className = '' }) {
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      {children}
    </div>
  );
}
