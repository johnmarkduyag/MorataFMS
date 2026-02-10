import { useState, useEffect } from "react";

export const CalendarCard = () => {
    const [currentDate] = useState(new Date());
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    useEffect(() => {
        const monthName = currentDate.toLocaleString('en-US', { month: 'long' });
        const yearNum = currentDate.getFullYear();
        setMonth(monthName);
        setYear(yearNum.toString());
    }, [currentDate]);

    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const days = [];

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                day: daysInPrevMonth - i,
                isCurrentMonth: false,
                isToday: false,
            });
        }

        // Current month days
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday =
                i === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();

            days.push({
                day: i,
                isCurrentMonth: true,
                isToday,
            });
        }

        // Next month days to fill the grid
        const remainingDays = 42 - days.length; // 6 rows x 7 days
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                day: i,
                isCurrentMonth: false,
                isToday: false,
            });
        }

        return days;
    };

    const days = getDaysInMonth();

    return (
        <div className="bg-white rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">{month}, {year}</h3>
                <button className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-700">
                    Today
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <span key={day} className="text-gray-400 py-1">{day}</span>
                ))}

                {/* Day cells */}
                {days.map((dayObj, index) => (
                    <span
                        key={index}
                        className={`py-1 ${!dayObj.isCurrentMonth
                            ? 'text-gray-300'
                            : dayObj.isToday
                                ? 'bg-[#c41e3a] text-white rounded-full'
                                : 'text-gray-900'
                            }`}
                    >
                        {dayObj.day}
                    </span>
                ))}
            </div>
        </div>
    );
};
