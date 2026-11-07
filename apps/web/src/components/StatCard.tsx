interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  yellow: 'bg-yellow-50 text-yellow-600',
  red: 'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-600',
};

export default function StatCard({ title, value, icon, color = 'blue' }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-5 flex items-center">
      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="ml-4 min-w-0">
        <p className="text-sm text-gray-500 truncate">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}