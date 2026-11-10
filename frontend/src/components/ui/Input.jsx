import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  hint,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <input
        ref={ref}
        className={`input ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-crimson-500">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;