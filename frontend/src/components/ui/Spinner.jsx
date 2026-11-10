const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
};

export default function Spinner({ size = 'md', fullScreen = false, label }) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizes[size]} border-crimson-600/30 border-t-crimson-600 rounded-full animate-spin`} />
      {label && <p className="text-sm text-text-secondary">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-12">{spinner}</div>;
}