const variants = {
  matte: 'card',
  elevated: 'card-elevated',
  glass: 'glass-card',
  interactive: 'glass-card-hover cursor-pointer',
};

export default function Card({
  children,
  variant = 'matte',
  className = '',
  padding = 'p-6',
  ...props
}) {
  return (
    <div className={`${variants[variant]} ${padding} ${className}`} {...props}>
      {children}
    </div>
  );
}