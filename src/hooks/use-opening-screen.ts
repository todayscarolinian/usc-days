"use client";

import { useSyncExternalStore } from "react";

const INTRO_KEY = "usc-days-intro-seen";
let seenInMemory = false;
let revealStarted = false;
let heroPlayed = false;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function hasSeenIntro() {
  try { return seenInMemory || sessionStorage.getItem(INTRO_KEY) === "1"; }
  catch { return seenInMemory; }
}
export function markOpeningScreenSeen() {
  seenInMemory = true;
  try { sessionStorage.setItem(INTRO_KEY, "1"); } catch { /* Retain the in-memory state. */ }
  listeners.forEach(listener => listener());
}
export function useOpeningScreenSeen() {
  return useSyncExternalStore(subscribe, hasSeenIntro, () => false);
}
export function startOpeningReveal() {
  revealStarted = true;
  listeners.forEach(listener => listener());
}
export function useOpeningRevealStarted() {
  return useSyncExternalStore(subscribe, () => revealStarted || hasSeenIntro(), () => false);
}
function hasHeroPlayed() {
  try { return heroPlayed || sessionStorage.getItem("usc-days-hero-seen") === "1"; }
  catch { return heroPlayed; }
}
export function markHeroEntrancePlayed() {
  heroPlayed = true;
  try { sessionStorage.setItem("usc-days-hero-seen", "1"); } catch { /* Use memory when storage is unavailable. */ }
  listeners.forEach(listener => listener());
}
export function useHeroEntrancePlayed() {
  return useSyncExternalStore(subscribe, hasHeroPlayed, () => false);
}
