import { useState, useEffect } from 'react';

const CountdownTimer = ({ endDate, label = "Хямдрал дуусахад" }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = new Date(endDate) - new Date();

        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return null;
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [endDate]);

    if (!timeLeft) {
        return null;
    }

    return (
        <div className="flex items-center gap-2 text-sm">
            <span className="text-red-600 font-semibold">{label}</span>
            <div className="flex items-center gap-1">
                <span className="bg-red-600 text-white px-2 py-1 rounded font-bold">
                    {timeLeft.days}
                </span>
                <span className="text-gray-600">өдөр</span>
            </div>
        </div>
    );
};

export default CountdownTimer;