"use client";

export default function DayNavigation() {
    return (
        <div className="sticky top-16 z-40 flex h-12 items-center bg-white">
            <div className="flex justify-between w-full p-4 sm:py-10 sm:max-w-5xl mx-auto relative">
                <div className="flex flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {new Date().toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </h2>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                    <span className="text-sm text-gray-600">
                        This is a sticky navigation component that scrolls with
                        the navbar
                    </span>
                </div>
            </div>
        </div>
    );
}
