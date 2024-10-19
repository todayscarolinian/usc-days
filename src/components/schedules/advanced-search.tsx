"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FaFilter } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilterStore } from "@/stores/filter-store";

const FormSchema = z.object({
  date: z.date().optional(),
  game: z.string().optional(),
  team1: z.string().optional(),
  team2: z.string().optional(),
  status: z.boolean().optional()
});

export function AdvancedSearch() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { setFiltered } = useFilterStore();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    const formattedDate = data.date ? format(data.date, "MMMM d, yyyy") : ""; // gets only the Month day and year e.g (September 2, 2024)
    setFiltered({
      date: formattedDate,
      game: data.game,
      teams: {
        home: data.team1,
        away: data.team2,
      },
      finishedGame: data.status
    });

    // Reset the form fields once applied button is clicked
    form.reset({
      date: undefined,
      game: "",
      team1: "",
      team2: "",
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FaFilter />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-full flex flex-col justify-center">
        <DialogHeader>
          <DialogTitle>Show results by</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Date Picker */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Enter date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Game Selector - A dropdown list of all games found in db */}
            <FormField
              control={form.control}
              name="game"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Game" />
                      </SelectTrigger>
                    </FormControl>
                    {/* Select options to be adjusted to get from the DB */}
                    <SelectContent>
                      <SelectItem value="Lawn Tennis">Lawn Tennis</SelectItem>
                      <SelectItem value="Badminton">Badminton</SelectItem>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Team Selection (Home and Away) - drop down list of all teams found from the db */}
            <div className="flex flex-col gap-4">
              <Label>Teams</Label>
              <div className="flex border p-4 flex-col gap-3">
                <FormField
                  control={form.control}
                  name="team1"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Team 1" />
                          </SelectTrigger>
                        </FormControl>
                        {/* Select options to be adjusted to get from the DB */}
                        <SelectContent>
                          <SelectItem value="SHCP">SHCP</SelectItem>
                          <SelectItem value="SAFAD">SAFAD</SelectItem>
                          <SelectItem value="SAS">SAS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-center">vs</p>
                <FormField
                  control={form.control}
                  name="team2"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Team 2" />
                          </SelectTrigger>
                        </FormControl>
                        {/* Select options to be adjusted to get from the DB */}
                        <SelectContent>
                          <SelectItem value="SOE">SOE</SelectItem>
                          <SelectItem value="SLG">SLG</SelectItem>
                          <SelectItem value="SBE">SBE</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <Checkbox
                    onCheckedChange={field.onChange}
                    checked={field.value}
                  />
                  <FormLabel>Show finished games</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogClose asChild>
              <Button type="submit" className="w-full">
                Apply
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
