interface StatusChartProps {
    data: { label: string; value: number; color: string }[];
}

export const StatusChart = ({ data }: StatusChartProps) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const sortedData = [...data].sort((a, b) => b.value - a.value);

    // Calculate chart dimensions
    const size = 150;
    const center = size / 2;
    const baseRadius = 65;
    const strokeWidth = 10;
    const spacing = 4;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-5 shadow-sm border border-gray-100 dark:border-black h-full flex flex-col">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Status Overview</h3>
            <div className="flex flex-row items-center justify-center gap-2 flex-1">
                {/* Activity Rings Chart */}
                <div className="relative w-36 h-36 flex-shrink-0">
                    <svg
                        width={size}
                        height={size}
                        viewBox={`0 0 ${size} ${size}`}
                        className="transform -rotate-90 w-full h-full"
                    >
                        {sortedData.map((item, i) => {
                            const radius = baseRadius - (i * (strokeWidth + spacing));
                            const circumference = 2 * Math.PI * radius;
                            const percentage = (item.value / total) * 100;
                            const offset = circumference - (percentage / 100) * circumference;

                            return (
                                <g key={i}>
                                    {/* Track (Background) */}
                                    <circle
                                        cx={center}
                                        cy={center}
                                        r={radius}
                                        fill="transparent"
                                        stroke={item.color}
                                        strokeWidth={strokeWidth}
                                        className="opacity-10"
                                    />
                                    {/* Progress Ring */}
                                    <circle
                                        cx={center}
                                        cy={center}
                                        r={radius}
                                        fill="transparent"
                                        stroke={item.color}
                                        strokeWidth={strokeWidth}
                                        strokeDasharray={circumference}
                                        strokeDashoffset={offset}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Pill Legend */}
                <div className="flex-1 grid grid-cols-1 gap-y-2 w-full min-w-0">
                    {sortedData.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div
                                className="w-6 h-2 rounded-full flex-shrink-0 shadow-sm"
                                style={{ backgroundColor: item.color }}
                            ></div>
                            <div className="min-w-0 overflow-hidden">
                                <p className="text-gray-900 dark:text-white font-bold text-[10px] truncate uppercase tracking-tight leading-none">{item.label}</p>
                                <p className="text-slate-400 dark:text-gray-400 font-semibold text-[9px] leading-none">{item.value} Units</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
