import Image from "next/image";

import type { Ranger } from "./rangerData";

interface RangerCardProps {
  ranger: Ranger;
  /** Position in the deck: 0 = front card */
  position: number;
  total: number;
}

export default function RangerCard({ ranger, position, total }: RangerCardProps) {
  return (
    <div
      className="ranger-card"
      data-ranger={ranger.id}
      data-pos={position}
      style={{
        zIndex: total - position,
        border: `2px solid ${ranger.color}`,
      }}
    >
      <Image
        src={ranger.cardImage}
        alt={`${ranger.name} card`}
        draggable={false}
        fill
        sizes="(min-width: 1520px) 940px, (min-width: 640px) 60vw, 80vw"
        className="scale-[1.04] object-cover"
        // Hide a missing asset instead of displaying the broken-image icon.
        onError={(e) => {
          e.currentTarget.style.visibility = "hidden";
        }}
      />
    </div>
  );
}
