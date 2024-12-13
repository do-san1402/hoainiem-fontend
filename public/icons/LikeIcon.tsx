import React from 'react';

export const LikeIcon: React.FC<{ active?: boolean }> = ({ active = false }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={active ? 'red' : 'none'}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 9l1.5-4.5a2 2 0 00-2.5-2.5L7 7h-4v12h6l5.5 5.5a2 2 0 003-1.5V12m0-3.5a3.5 3.5 0 00-7 0"
            />
        </svg>
    );
};