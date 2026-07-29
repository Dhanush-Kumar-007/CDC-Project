const ProfileCompletionMeter = ({ percentage = 0 }) => {
  const color = percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-gray-700">Profile Completion</span>
        <span className="text-sm font-semibold text-gray-900">{percentage}%</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${percentage}%` }} />
      </div>
      {percentage < 100 && (
        <p className="text-xs text-gray-500 mt-1.5">Complete your profile to improve your job matches.</p>
      )}
    </div>
  );
};

export default ProfileCompletionMeter;
