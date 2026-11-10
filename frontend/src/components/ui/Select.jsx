import { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  error,
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <select
        ref={ref}
        className={`input ${error ? 'input-error' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-crimson-500">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;