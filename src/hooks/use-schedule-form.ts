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
  participants: ParticipantEntryInput[];
  bestOf: 3 | 5;
}

/**
 * One row of the multi-team entry form. `key` identifies the row on screen; `id` is set
 * for entries already saved. `teamId` is -1 until a team is chosen.
 */
export type ParticipantEntryInput = {
  key: string;
  id?: number;
  teamId: number;
  name: string;
};

let entryKeyCounter = 0;
export function newEntryKey() {
  entryKeyCounter += 1;
  return `entry-${entryKeyCounter}`;
}

/** Multi-team games send their entries; head-to-head games send team A and team B. */
export function scheduleTeamFields(inputs: ScheduleInputs, multiTeam: boolean) {
  return multiTeam
    ? {
        teamAId: null,
        teamBId: null,
        participants: inputs.participants.map(({ id, teamId, name }) => ({ id, teamId, name })),
      }
    : { teamAId: inputs.teamAId, teamBId: inputs.teamBId };
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
  participants: [],
  bestOf: 3,
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
      // Clear errors for this field, including its nested ones (e.g. "participants.0.teamId")
      setValidationErrors((prev) =>
        Object.fromEntries(
          Object.entries(prev).filter(([path]) => path !== key && !path.startsWith(`${key}.`)),
        ),
      );
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
              ...scheduleTeamFields(inputs, additionalData?.multiTeam === true),
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
