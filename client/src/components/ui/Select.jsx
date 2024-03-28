import React from 'react';

export default function Select({ options, ...rest }) {
  return (
    <select {...rest}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
}
