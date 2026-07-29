const StatCard = ({ icon: Icon, label, value, accent = 'text-brand-600 bg-brand-50' }) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-card p-5 flex items-center gap-4">
    <div className={`h-11 w-11 rounded-lg flex items-center justify-center shrink-0 ${accent}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

export default StatCard;
