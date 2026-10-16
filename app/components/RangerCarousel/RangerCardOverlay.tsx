"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/src/components/ui/dialog";
import type { Ranger } from "./rangerData";

const CARD_ASPECT = 842 / 542;

export interface ExpandedCard {
  ranger: Ranger;
  /** Where the card sat on screen when clicked; the overlay animates from here */
  originRect: DOMRect;
}

interface RangerCardOverlayProps {
  open: boolean;
  card: ExpandedCard | null;
  onOpenChange: (open: boolean) => void;
}

/**
 * Mirrors the CSS sizing of .ranger-card-overlay so the FLIP offsets line up
 * with where the maximized card actually lands.
 */
function getOriginOffsets(originRect: DOMRect) {
  const width = Math.min(
    window.innerWidth * 0.94,
    window.innerHeight * 0.88 * CARD_ASPECT
  );
  const height = width / CARD_ASPECT;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  return {
    "--from-x": `${originRect.left - left}px`,
    "--from-y": `${originRect.top - top}px`,
    "--from-scale": originRect.width / width,
  } as CSSProperties;
}

export default function RangerCardOverlay({
  open,
  card,
  onOpenChange,
}: RangerCardOverlayProps) {
  if (!card) return null;

  const { ranger, originRect } = card;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/70 duration-300" />
        <DialogPrimitive.Content
          className="ranger-card-overlay"
          aria-describedby={undefined}
          style={{
            ...getOriginOffsets(originRect),
            border: `2px solid ${ranger.color}`,
          }}
        >
          <DialogTitle className="sr-only">{ranger.name} card</DialogTitle>
          <Image
            src={ranger.cardImage}
            alt={`${ranger.name} card`}
            draggable={false}
            fill
            sizes="94vw"
            className="scale-[1.04] object-cover"
          />
          <DialogClose className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none">
            <XIcon className="size-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
