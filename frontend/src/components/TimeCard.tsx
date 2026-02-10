import { useEffect, useState } from "react";

export const TimeCard = () => {
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const timeOptions: Intl.DateTimeFormatOptions = {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Manila'
            };
            const dateOptions: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'Asia/Manila'
            };
            const now = new Date();
            const formattedTime = now.toLocaleTimeString('en-US', timeOptions);
            const formattedDate = now.toLocaleDateString('en-US', dateOptions);
            setTime(formattedTime);
            setDate(formattedDate);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white rounded-2xl p-6">
            <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{time}</p>
                <p className="text-sm text-gray-500 mt-1">{date}</p>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <svg className="w-5 h-5 text-[#c41e3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Philippines</span>
            </div>
        </div>
    );
};
