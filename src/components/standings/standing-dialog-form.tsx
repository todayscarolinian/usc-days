"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import StandingSchema from "@/lib/standings-validator";

type StandingFormData = z.input<typeof StandingSchema>;

type StandingFormDialogProps = {
  open: boolean;
  mode: "add" | "edit";
  initialData?: z.output<typeof StandingSchema> | null;
  onClose: () => void;
  onSubmit: (data: z.output<typeof StandingSchema>) => void;
  onDelete?: () => void;
};

export default function StandingFormDialog({
  open,
  mode,
  initialData,
  onClose,
  onSubmit,
  onDelete,
}: StandingFormDialogProps) {
  const form = useForm<StandingFormData>({
    resolver: zodResolver(StandingSchema),
    defaultValues: initialData || {
      team: "",
      wins: 0,
      losses: 0,
      winPct: "0%",
    },
  });

  // Reset form when editing a new record
  React.useEffect(() => {
    form.reset(initialData || {
      team: "",
      wins: 0,
      losses: 0,
      winPct: "0%",
    });
  }, [initialData, form]);

  const handleSubmit = (data: StandingFormData) => {
    const result = StandingSchema.parse(data);
    onSubmit(result);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Standing" : "Edit Standing"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 mt-2"
          >
            <FormField
              control={form.control}
              name="team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter team name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="wins"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Wins</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        {...field}
                        value={field.value?.toString() || "0"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="losses"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Losses</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        {...field}
                        value={field.value?.toString() || "0"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-4 flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" type="button" onClick={onClose}>
                  Cancel
                </Button>

                {mode === "edit" && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete?.();
                    }}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                )}

                <Button
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {mode === "edit" ? "Save" : "Add"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}