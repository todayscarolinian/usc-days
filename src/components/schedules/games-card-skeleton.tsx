import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function GamesCardSkeleton() {
  return (
    <Card className="w-full p-0 overflow-hidden">
      <div className="grid grid-cols-[1fr_auto_auto] md:grid-cols-[1fr_auto_1fr] p-4 mt-4">
        <CardHeader className="col-span-1 flex items-center p-0">
          <CardTitle className="flex items-end gap-2">
            <Skeleton className="h-6 w-12 md:h-8 md:w-16" />
            <Skeleton className="h-3 w-8" />
          </CardTitle>
        </CardHeader>

        <CardContent className="col-span-1 flex justify-center items-center p-0">
          <div className="flex justify-center gap-2 sm:gap-6 items-center text-center">
            <div className="flex justify-center gap-3 md:gap-4 items-center text-sm md:text-base">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="size-6 rounded-full" />
            </div>

            <div className="flex gap-2 items-center">
              <Skeleton className="h-4 w-5" />
              <span><b>/</b></span>
              <Skeleton className="h-4 w-5" />
            </div>

            <div className="flex justify-center gap-1 md:gap-2 items-center text-sm md:text-base">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="grid grid-cols-[auto_auto_1fr] md:grid-cols-[1fr_auto_1fr] bg-[#C02D2D] text-xs text-white py-2 px-2">
        <div className="col-span-1 flex items-center gap-2">
          <Skeleton className="size-6 rounded bg-white/20" />
          <Skeleton className="h-3 w-24 rounded bg-white/20" />
        </div>
        <div className="col-span-2 md:col-span-1 md:text-center flex justify-end md:justify-center">
          <Skeleton className="h-3 w-24 rounded bg-white/20" />
        </div>
      </CardFooter>
    </Card>
  )
}