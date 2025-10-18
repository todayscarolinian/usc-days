"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AddChampionSchema, EditChampionSchema } from "@/types/champions.types";

type FormMode = "add" | "edit";

type ChampionFormData =
  | z.infer<typeof AddChampionSchema>
  | (z.infer<typeof EditChampionSchema> & { id?: number });

type StandingFormDialogProps = {
  open: boolean;
  mode: FormMode;
  initialData?: ChampionFormData | null;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof AddChampionSchema>) => void;
  onDelete?: () => void;
  sports?: { id: number; name: string }[];
  teams?: { id: number; name: string }[];
};

export default function StandingFormDialog({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
  onDelete,
}: StandingFormDialogProps) {
  const schema = mode === "add" ? AddChampionSchema : EditChampionSchema;
  const today = new Date().toISOString().split("T")[0];

  const form = useForm<z.infer<typeof AddChampionSchema>>({
    resolver: zodResolver(mode === "add" ? AddChampionSchema : EditChampionSchema),
    defaultValues:
      mode === "edit" && initialData
        ? initialData
        : {
            gameTypeId: 0,
            teamId: 0,
            startDate: today,
            endDate: today,
            rank: 1,
          },
  });

  useEffect(() => {
    if (mode === "add") {
      form.reset({
        gameTypeId: 0,
        teamId: 0,
        startDate: today,
        endDate: today,
        rank: 1,
      });
    } else if (initialData) {
      form.reset(initialData);
    }
  }, [mode, initialData, form, today]);

  const handleSubmit = (data: z.infer<typeof schema>) => {
    const payload: z.infer<typeof AddChampionSchema> = {
      gameTypeId: data.gameTypeId,
      teamId: data.teamId,
      startDate: data.startDate,
      endDate: data.endDate,
      rank: data.rank,
    };
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Standing" : "Edit Standing"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="gameTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sport ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter sport ID"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="teamId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team ID</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter team ID"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="rank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rank (1–3)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={3}
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number(e.target.value) || 1)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              {mode === "edit" && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onDelete}
                  className="mr-auto"
                >
                  Delete
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {mode === "add" ? "Add Standing" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
