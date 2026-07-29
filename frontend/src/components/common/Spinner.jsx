const Spinner = ({ label = 'Loading…', size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-gray-500">
      <span className={`${sizeClass} animate-spin rounded-full border-2 border-gray-300 border-t-brand-600`} />
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default Spinner;
