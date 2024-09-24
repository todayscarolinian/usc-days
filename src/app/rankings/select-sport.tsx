import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const selection = [
  {
    value: "basketball",
    name: "Basketball"
  },
  {
    value: "soccer",
    name: "Soccer"
  },
  {
    value: "tennis",
    name: "Tennis"
  },
  {
    value: "baseball",
    name: "Baseball"
  },
  {
    value: "football",
    name: "Football"
  },
  {
    value: "cricket",
    name: "Cricket"
  },
  {
    value: "hockey",
    name: "Hockey"
  },
  {
    value: "volleyball",
    name: "Volleyball"
  },
  {
    value: "rugby",
    name: "Rugby"
  },
  {
    value: "golf",
    name: "Golf"
  },
  {
    value: "swimming",
    name: "Swimming"
  },
  {
    value: "badminton",
    name: "Badminton"
  },
  {
    value: "boxing",
    name: "Boxing"
  },
  {
    value: "skiing",
    name: "Skiing"
  },
  {
    value: "cycling",
    name: "Cycling"
  }
];


export function SelectSportButton() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a game" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {
            selection.map((sport) => (
              <SelectItem key={sport.value} value={sport.value}>{sport.name}</SelectItem>
            ))
          }
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
