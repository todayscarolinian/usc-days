import { useState, useCallback } from "react";
import { ZodSchema } from "zod";
import { AddGameSchema } from "@/src/types/games.types";
import { getValidationErrors } from "@/src/lib/error-handler";
import {
  getEventDayKey,
  getEventTimeOfDay,
  eventDateTimeToISO,
} from "../lib/time";
import { addHours } from "date-fns";

interface ScheduleInputs {
  gameTypeId: number;
  teamAId: number | null;
  teamBId: number | null;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location?: string;
  label: string;
}

interface UseScheduleFormOptions<T = any> {
  initialValues?: Partial<ScheduleInputs>;
  schema?: ZodSchema<T>;
  transformData?: (inputs: ScheduleInputs, additionalData?: any) => T;
}

const getDefaultInputs = (): ScheduleInputs => ({
  gameTypeId: -1,
  teamAId: null,
  teamBId: null,
  startDate: getEventDayKey(),
  endDate: getEventDayKey(),
  startTime: getEventTimeOfDay(),
  endTime: getEventTimeOfDay(addHours(new Date(), 1)),
  location: undefined,
  label: "",
});

export function useScheduleForm<T = any>(
  options: UseScheduleFormOptions<T> = {},
) {
  const { initialValues, schema = AddGameSchema, transformData } = options;

  const [inputs, setInputs] = useState<ScheduleInputs>({
    ...getDefaultInputs(),
    ...initialValues,
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

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
    [],
  );

  const validate = useCallback(
    (additionalData?: any): boolean => {
      try {
        // Use custom transform if provided, otherwise use default for AddGameSchema
        const dataToValidate = transformData
          ? transformData(inputs, additionalData)
          : {
              gameTypeId: inputs.gameTypeId,
              teamAId: inputs.teamAId,
              teamBId: inputs.teamBId,
              startDate: eventDateTimeToISO(inputs.startDate, inputs.startTime),
              endDate: eventDateTimeToISO(inputs.endDate, inputs.endTime),
              location: inputs.location,
              label: inputs.label,
            };

        schema.parse(dataToValidate);
        setValidationErrors({});
        return true;
      } catch (error) {
        const errors = getValidationErrors(error);
        setValidationErrors(errors);
        return false;
      }
    },
    [inputs, schema, transformData],
  );

  const reset = useCallback(() => {
    setInputs({
      ...getDefaultInputs(),
      ...initialValues,
    });
    setValidationErrors({});
  }, [initialValues]);

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
