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
    <div className="ranger-carousel">
      <div className="ranger-carousel-layout">

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
