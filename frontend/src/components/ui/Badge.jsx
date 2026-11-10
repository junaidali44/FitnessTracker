const variants = {
  primary: 'badge-primary',
  success: 'badge-success',
  warning: 'badge-warning',
  neutral: 'badge-neutral',
};

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span className={`${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}