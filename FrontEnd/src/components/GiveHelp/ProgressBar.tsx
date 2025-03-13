import React from 'react';

interface ProgressBarProps {
    progress: number;
    text: string;
    color?: 'blue' | 'green' | 'yellow';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, text, color = "blue" }) => {
    const colorClasses = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        yellow: "bg-yellow-500",
    };

    return (
        <div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full ${colorClasses[color]}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="text-sm text-gray-600 mt-1">{text}</p>
        </div>
    );
};

export default ProgressBar;