import Image from "next/image";
import type { KeyboardEvent, MouseEvent } from "react";

import type { Ranger } from "./rangerData";

interface RangerCardProps {
  ranger: Ranger;
  /** Position in the deck: 0 = front card */
  position: number;
  total: number;
  /** Hides the card while its maximized copy is shown in the overlay */
  hidden?: boolean;
  /** Only passed to the front card; makes it clickable */
  onExpand?: (originRect: DOMRect) => void;
}

export default function RangerCard({
  ranger,
  position,
  total,
  hidden = false,
  onExpand,
}: RangerCardProps) {
  const expand = (e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) =>
    onExpand?.(e.currentTarget.getBoundingClientRect());

  return (
    <div
      className="ranger-card"
      data-ranger={ranger.id}
      data-pos={position}
      data-interactive={onExpand ? "" : undefined}
      role={onExpand ? "button" : undefined}
      tabIndex={onExpand ? 0 : undefined}
      aria-label={onExpand ? `View ${ranger.name} card` : undefined}
      onClick={onExpand ? expand : undefined}
      onKeyDown={
        onExpand
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                expand(e);
              }
            }
          : undefined
      }
      style={{
        zIndex: total - position,
        border: `2px solid ${ranger.color}`,
        visibility: hidden ? "hidden" : undefined,
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
