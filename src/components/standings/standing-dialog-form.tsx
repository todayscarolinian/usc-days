"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
import {
  EditChampionPayload,
  EditChampionSchema,
} from "@/src/types/champions.types";
import { SearchableSelect } from "../schedules/searchable-select";
import { Team } from "@/src/lib/prisma/generated/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import DatePicker from "../ui/date-picker";

type FormMode = "add" | "edit";

type StandingFormDialogProps = {
  open: boolean;
  mode: FormMode;
  initialData: EditChampionPayload;
  teams: Team[];
  onCloseAction: (dataChanged?: boolean) => void;
};

export default function StandingFormDialog({
  open,
  mode,
  initialData,
  teams,
  onCloseAction,
}: StandingFormDialogProps) {
  const form = useForm<EditChampionPayload>({
    resolver: zodResolver(EditChampionSchema),
    defaultValues: initialData,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
    setError,
  } = form;

  // Sync form with initialData when it changes
  useEffect(() => {
    const formattedData = {
      ...initialData,
      startDate: initialData.startDate.split("T")[0],
      endDate: initialData.endDate.split("T")[0],
    };
    reset(formattedData);
  }, [initialData, reset]);

  // Prevent dialog close during submission
  const handleOpenChange = (open: boolean) => {
    if (!open && !isSubmitting) {
      onCloseAction(false);
    }
  };

  const onSubmit = async (data: EditChampionPayload) => {
    try {
      // Validate team selection
      if (data.teamId === -1) {
        setError("teamId", {
          type: "manual",
          message: "Please select a team",
        });
        return;
      }

      // Format dates to ISO string with same date for start and end
      const selectedDate = new Date(data.startDate);
      const formattedData: EditChampionPayload = {
        ...data,
        startDate: selectedDate.toISOString(),
        endDate: selectedDate.toISOString(),
      };

      let response;
      if (mode === "add") {
        response = await axios.post(`/api/champions`, formattedData);
      } else {
        response = await axios.put(`/api/champions`, formattedData);
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(
          mode === "add"
            ? "Standing added successfully"
            : "Standing updated successfully"
        );
        onCloseAction(true);
      }
    } catch (error) {
      console.error("Error saving standing:", error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error?: string }>;
        const errorMessage =
          axiosError.response?.data?.error ||
          "Failed to save standing. Please try again.";
        toast.error(errorMessage);

        // Set form-level error
        setError("root", {
          type: "manual",
          message: errorMessage,
        });
      } else {
        toast.error("An unexpected error occurred");
        setError("root", {
          type: "manual",
          message: "An unexpected error occurred",
        });
      }
    }
  };

  const handleDelete = async () => {
    if (initialData.id === -1) return;

    try {
      const response = await axios.delete(`/api/champions`, {
        data: { id: initialData.id },
      });

      if (response.status === 200) {
        toast.success("Standing deleted successfully");
        onCloseAction(true);
      }
    } catch (error) {
      console.error("Error deleting standing:", error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error?: string }>;
        const errorMessage =
          axiosError.response?.data?.error ||
          "Failed to delete standing. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Standing" : "Edit Standing"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Root Error Message */}
            {errors.root && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {errors.root.message}
              </div>
            )}

            {/* Date Field */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      label=""
                      value={field.value ? new Date(field.value) : new Date()}
                      onChange={(date) =>
                        field.onChange(
                          date ? date.toISOString().split("T")[0] : ""
                        )
                      }
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Team Selection */}
            <FormField
              control={form.control}
              name="teamId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      placeholder="Select Team"
                      searchPlaceholder="Search teams..."
                      emptyMessage="No teams found."
                      options={teams.map((team) => ({
                        value: team.id.toString(),
                        label: team.teamName,
                      }))}
                      value={field.value !== -1 ? field.value.toString() : ""}
                      onChange={(value) =>
                        field.onChange(value ? Number(value) : -1)
                      }
                      disabled={
                        // teams.length === 0 ||
                        isSubmitting
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rank Selection */}
            <FormField
              control={form.control}
              name="rank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Standing</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Standing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Standing</SelectLabel>
                          <SelectItem value="1">Champion</SelectItem>
                          <SelectItem value="2">First Runner-Up</SelectItem>
                          <SelectItem value="3">Second Runner-Up</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              {mode === "edit" && initialData.id !== -1 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="mr-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => onCloseAction(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "add" ? "Adding..." : "Saving..."}
                  </>
                ) : mode === "add" ? (
                  "Add Standing"
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
