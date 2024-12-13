import React from 'react';

export const UnlikeIcon: React.FC<{ active?: boolean }> = ({ active = false }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={active ? 'blue' : 'none'}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 15l-1.5 4.5a2 2 0 002.5 2.5l4.5-4.5h4V7h-6l-5.5-5.5a2 2 0 00-3 1.5V12m0 3.5a3.5 3.5 0 107 0"
            />
        </svg>
    );
};