"use client";

import SportSelector from "./sport-selector";

interface SportSelectorProps {
    onSelect: (id: number | null) => void;
    selected: number | null;
}

export default function DayNavigation({
    onSelect,
    selected,
}: SportSelectorProps) {
    return (
        <div className="sticky top-16 z-40 flex flex-col bg-white">
            <div className="flex flex-col gap-4 w-full px-4 py-8 sm:max-w-5xl mx-auto relative">
                <div className="flex justify-between">
                    <div className="flex flex-col">
                        <h2
                            className="text-2xl md:text-4xl font-semibold uppercase"
                            id="date-reference"
                        >
                            {new Date().toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </h2>
                        <span className="text-sm uppercase" id="day-reference">
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <div className="flex items-center gap-1">
                            <button
                                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                                id="previous-day"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            <button
                                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                                id="today"
                            >
                                TODAY
                            </button>
                            <button
                                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                                id="next-day"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <SportSelector onSelect={onSelect} selected={selected} />
            </div>
        </div>
    );
}
