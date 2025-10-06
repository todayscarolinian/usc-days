"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function StandingsCardsSkeleton() {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
            {Array.from({ length: 3 }).map((_, index) => (
                <Card
                    key={index}
                    className="h-[191px] overflow-hidden flex flex-col"
                >
                    <CardContent
                        className={cn(
                            "flex-1 flex items-center justify-between",
                            "!p-6 !pb-0 !pt-0 !mb-0"
                        )}
                    >
                        <div className="flex-1">
                            {/* Team name */}
                            <Skeleton className="h-9 w-3/4 mb-2" />

                            <div className="flex gap-6">
                                <div>
                                    {/* Games won label */}
                                    <Skeleton className="h-4 w-20 mb-1" />
                                    {/* Games won value */}
                                    <Skeleton className="h-6 w-8" />
                                </div>
                                <div>
                                    {/* Win % label */}
                                    <Skeleton className="h-4 w-12 mb-1" />
                                    {/* Win % value */}
                                    <Skeleton className="h-6 w-10" />
                                </div>
                            </div>
                        </div>

                        <div className="ml-4">
                            {/* Team logo */}
                            <Skeleton className="w-20 h-20 mt-3 rounded-full" />
                        </div>
                    </CardContent>

                    <CardFooter
                        className={cn(
                            "flex items-center justify-between flex-shrink-0",
                            "!h-[40px] !px-6 !py-4 !mt-4 !mb-0"
                        )}
                        style={{
                            backgroundColor: "#C4C4C4",
                            borderBottomLeftRadius: "inherit",
                            borderBottomRightRadius: "inherit",
                        }}
                    >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            {/* Sport icon */}
                            <Skeleton className="w-6 h-6 bg-white/20" />
                            {/* Sport name */}
                            <Skeleton className="h-4 w-20 bg-white/20" />
                        </div>
                        {/* Rank title */}
                        <Skeleton className="h-4 w-24 bg-white/20 flex-shrink-0 ml-2" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
