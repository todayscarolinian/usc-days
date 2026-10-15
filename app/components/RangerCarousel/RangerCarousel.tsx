"use client";

import { useState } from "react";
import RangerCard from "./RangerCard";
import RangerSelector from "./RangerSelector";
import { RANGERS } from "./rangerData";
import "./RangerCarousel.css";

export default function RangerCarousel() {
  const [activeId, setActiveId] = useState(RANGERS[0].id);

  const orderedRangers = [
    ...RANGERS.filter((ranger) => ranger.id === activeId),
    ...RANGERS.filter((ranger) => ranger.id !== activeId),
  ];

  return (
    <div className="w-full overflow-x-clip">
      <div className="mx-auto flex max-w-[1500px] flex-col items-center gap-8 px-4 py-8 sm:flex-row sm:items-start sm:justify-center sm:gap-[clamp(16px,4vw,60px)]">

        <div className="ranger-deck" aria-label="Ranger cards">
          {RANGERS.map((ranger) => {
            const position = orderedRangers.findIndex(
              (item) => item.id === ranger.id
            );

            return (
              <RangerCard
                key={ranger.id}
                ranger={ranger}
                position={position}
                total={RANGERS.length}
              />
            );
          })}
        </div>

        <RangerSelector
          rangers={RANGERS}
          activeId={activeId}
          onSelect={setActiveId}
        />

      </div>
    </div>
  );
}