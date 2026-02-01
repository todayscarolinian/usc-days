import { useState, useCallback } from "react";
import { AddGameSchema } from "@/src/types/games.types";
import { getValidationErrors } from "@/src/lib/error-handler";

// Helper to get the current timezone offset in ISO 8601 format (e.g., "+08:00" or "-05:00")
function getTimezoneOffset(): string {
  const offset = -new Date().getTimezoneOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? "+" : "-";
  return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

interface ScheduleInputs {
  teamAId: number;
  teamBId: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location?: string;
}

const getDefaultInputs = (): ScheduleInputs => ({
  teamAId: -1,
  teamBId: -1,
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date().toISOString().split("T")[0],
  startTime: new Date().toISOString().split("T")[1].substring(0, 5),
  endTime: new Date(new Date().getTime() + 60 * 60 * 1000)
    .toISOString()
    .split("T")[1]
    .substring(0, 5),
  location: undefined,
});

export function useScheduleForm() {
  const [inputs, setInputs] = useState<ScheduleInputs>(getDefaultInputs());
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const updateInput = useCallback(
    <K extends keyof ScheduleInputs>(key: K, value: ScheduleInputs[K]) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
      // Clear error for this field when user makes changes
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    },
    []
  );

  const validate = useCallback((gameTypeId: number, createdById: number): boolean => {
    try {
      // Transform inputs to match AddGameSchema format
      const dataToValidate = {
        gameTypeId,
        teamAId: inputs.teamAId,
        teamBId: inputs.teamBId,
        startDate: `${inputs.startDate}T${inputs.startTime}:00${getTimezoneOffset()}`,
        endDate: `${inputs.endDate}T${inputs.endTime}:00${getTimezoneOffset()}`,
        location: inputs.location,
        createdById,
      };

      AddGameSchema.parse(dataToValidate);
      setValidationErrors({});
      return true;
    } catch (error) {
      const errors = getValidationErrors(error);
      setValidationErrors(errors);
      return false;
    }
  }, [inputs]);

  const reset = useCallback(() => {
    setInputs(getDefaultInputs());
    setValidationErrors({});
  }, []);

  const clearErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  const hasErrors = Object.keys(validationErrors).length > 0;
  const firstError = hasErrors ? Object.values(validationErrors)[0] : null;

  return {
    inputs,
    setInputs,
    updateInput,
    validationErrors,
    hasErrors,
    firstError,
    validate,
    reset,
    clearErrors,
  };
}