// Atom: CalendarAtom.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'primereact/calendar';

const CalendarAtom = React.forwardRef(({ id, name, value, onChange, className, dateFormat, invalid, ...rest }, ref) => {
  return (
    <Calendar
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={`${className} ${invalid ? 'p-invalid' : ''}`}
      dateFormat={dateFormat}
      ref={ref}
      {...rest}
    />
  );
});

CalendarAtom.displayName = 'CalendarAtom';

CalendarAtom.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  dateFormat: PropTypes.string,
  invalid: PropTypes.bool
};

export default CalendarAtom;
