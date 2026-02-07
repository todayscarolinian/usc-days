import { useState, useCallback } from "react";
import { AddGameSchema } from "@/src/types/games.types";
import { getValidationErrors } from "@/src/lib/error-handler";
import { getTimezoneOffset } from "@/src/lib/utils";

interface ScheduleInputs {
  gameTypeId: number;
  teamAId: number;
  teamBId: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location?: string;
}

const getDefaultInputs = (): ScheduleInputs => ({
  gameTypeId: -1,
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

  const validate = useCallback((createdById: number): boolean => {
    try {
      // Transform inputs to match AddGameSchema format
      const dataToValidate = {
        gameTypeId: inputs.gameTypeId,
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