export default function LoadingSpinner({ fullScreen = false }) {
  const spinner = (
    <div className="flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  
  if (fullScreen) {
    return <div className="min-h-screen flex items-center justify-center">{spinner}</div>;
  }
  
  return <div className="flex items-center justify-center py-12">{spinner}</div>;
}