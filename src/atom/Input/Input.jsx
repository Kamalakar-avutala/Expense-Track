import React from 'react';
import { InputText } from 'primereact/inputtext';

const Input = React.forwardRef(({
  id,
  placeholder,
  className = '',
  error,
  type,
  ...props
}, ref) => {
  const inputClassName = `${className} ${error ? 'p-invalid' : ''}`.trim();

  return (
    <div className="field w-100">
      <InputText
        id={id}
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`${inputClassName} w-100`}
        {...props}
      />
      {error?.message && <small className="p-error d-inline-block mt-1">{error.message}</small>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
