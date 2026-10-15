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
      className="flex flex-row gap-2 sm:flex-col sm:gap-[11px]"
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
              "flex aspect-square w-[clamp(32px,8vw,94px)] cursor-pointer items-center justify-center rounded-md p-[14%] transition-shadow sm:w-[clamp(45px,6.5vw,94px)]",
            ].join(" ")}
          >
            <Image
              src={ranger.iconImage}
              alt=""
              draggable={false}
              sizes="94px"
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