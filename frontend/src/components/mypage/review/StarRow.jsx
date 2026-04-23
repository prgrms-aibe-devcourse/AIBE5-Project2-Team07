import React from 'react';

export default function StarRow({ rating = 0 }) {
    const rounded = Math.round(Number(rating) || 0);

    return (
        <div className="flex text-primary">
            {[1, 2, 3, 4, 5].map((num) => (
                <span
                    key={num}
                    className="material-symbols-outlined text-sm"
                    style={num <= rounded ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
          star
        </span>
            ))}
        </div>
    );
}