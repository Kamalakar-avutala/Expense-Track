import React from 'react';
import PropTypes from 'prop-types';

const Label = ({ htmlFor, children, className = '', ...props }) => {
  return (
    <label htmlFor={htmlFor} className={`label ${className}`} {...props}>
      {children}
    </label>
  );
};

// Label.propTypes = {
//   htmlFor: PropTypes.string.isRequired,
//   children: PropTypes.node.isRequired,
//   className: PropTypes.string,
// };

export default Label;
