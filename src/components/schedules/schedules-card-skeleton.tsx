import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import GamesCardSkeleton from "./games-card-skeleton"

type Props = {
  rows?: number
}

export default function SchedulesCardSkeleton({ rows = 2 }: Props) {
  return (
    <Card className="w-full py-4">
      <CardHeader className="flex flex-row md:flex-col">
        <CardTitle className="flex-1 text-lg md:text-2xl">
          <Skeleton className="h-6 w-40" />
        </CardTitle>
        <div className="flex-1 flex justify-end md:justify-start">
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <GamesCardSkeleton key={i} />
        ))}
      </CardContent>
    </Card>
  )
}