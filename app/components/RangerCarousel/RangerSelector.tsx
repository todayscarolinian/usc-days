import Image from "next/image";

import type { Ranger } from "./rangerData";

interface RangerSelectorProps {
  rangers: Ranger[];
  activeId: string;
  onSelect: (id: string) => void;
}

export default function RangerSelector({
  rangers,
  activeId,
  onSelect,
}: RangerSelectorProps) {
  return (
    <div
      className="ranger-selector"
      role="group"
      aria-label="Rangers"
    >
      {rangers.map((ranger) => {
        const isActive = ranger.id === activeId;

        return (
          <button
            key={ranger.id}
            type="button"
            onClick={() => onSelect(ranger.id)}
            aria-label={ranger.name}
            aria-pressed={isActive}
            style={{
              backgroundColor: ranger.color,
              boxShadow: isActive
                ? `0 0 0 2px ${ranger.color}, 0 0 14px 4px color-mix(in srgb, ${ranger.color} 55%, transparent)`
                : undefined,
            }}
            className={[
              "ranger-selector-button flex aspect-square shrink-0 cursor-pointer items-center justify-center rounded-md transition-shadow duration-300 motion-reduce:transition-none",
            ].join(" ")}
          >
            <Image
              src={ranger.iconImage}
              alt=""
              draggable={false}
              sizes="84px"
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
