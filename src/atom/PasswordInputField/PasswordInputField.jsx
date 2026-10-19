import React from "react";
import { Password } from "primereact/password";

const PasswordInputField = React.forwardRef(
  ({
    id,
    name,
    label,
    placeholder,
    className = "",
    error,
    toggleMask = true,
    feedback = true,
    onChange,
    onBlur,
    value,
    required,
    ...props
  },
  ref
) => {
    const inputClassName = `${className} ${error ? "p-invalid" : ""}`.trim();

    return (
      <div className="field w-100">
        {label && (
          <label htmlFor={id} className="form-label">
            {label} {required && <span className="text-danger">*</span>}
          </label>
        )}
        <Password
          id={id}
          name={name}
          ref={ref}
          placeholder={placeholder}
          inputClassName={inputClassName}
          toggleMask={toggleMask}
          feedback={feedback}
          className="w-100"
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          required={required}
          {...props}
        />
        {error?.message && (
          <small className="p-error d-inline-block mt-1">{error.message}</small>
        )}
      </div>
    );
  }
);

PasswordInputField.displayName = "PasswordInputField";

export default PasswordInputField;
