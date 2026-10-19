// Atom: DropdownAtom.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'primereact/dropdown';

const DropdownAtom = React.forwardRef(({ id, name, value, options, optionLabel, optionValue, onChange, placeholder, className = '', disabled = false, error = false }, ref) => {
  return (
    <Dropdown
      id={id}
      name={name}
      value={value}
      options={options}
      optionLabel={optionLabel}
      optionValue={optionValue}
      placeholder={placeholder}
      className={`${className} ${error ? 'p-invalid' : ''}`}
      disabled={disabled}
      onChange={onChange}
      ref={ref}
      checkmark={false}
    />
  );
});

DropdownAtom.displayName = 'DropdownAtom';

Dropdown.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  options: PropTypes.array.isRequired,
  optionLabel: PropTypes.string,
  optionValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool
};

export default DropdownAtom;
