interface ChartCardProps {
  title: string;
  data: { label: string; value: number }[];
  unit?: string;
}

export default function ChartCard({ title, data, unit = 'kali' }: ChartCardProps) {
  const max = data.length > 0 ? Math.max(...data.map((d) => d.value), 1) : 1;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      {data.length === 0 ? (
        <p className="text-sm text-gray-500 py-6 text-center">Belum ada data.</p>
      ) : (
        <ul className="space-y-4">
          {data.map((item, index) => (
            <li key={`${item.label}-${index}`}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-700 truncate pr-2">{item.label}</span>
                <span className="text-gray-500 flex-shrink-0">
                  {item.value} {unit}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${Math.max((item.value / max) * 100, 4)}%` }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}