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
import { Label } from "../ui/label";
import { useFilter } from "@/contexts/FilterContext";
import { FaFilter } from "react-icons/fa";

const FormSchema = z.object({
  date: z.date({
    required_error: "A date is required.",
  }),
  game: z.string(),
  team1: z.string(),
  team2: z.string(),
  location: z.string().optional(),
});

export function AdvancedSearch() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { setFiltered } = useFilter();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setFiltered({
      date: data.date.toISOString(), // Convert date to string if necessary
      game: data.game,
      teams: {
        home: data.team1,
        away: data.team2,
      },
    });
    console.log(data);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FaFilter />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Advanced Search</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Date Picker */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
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

            {/* Game Selector */}
            <FormField
              control={form.control}
              name="game"
              render={({ field }) => (
                <FormItem>
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

            {/* Location Filter */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                    </FormControl>
                    {/* Select options to be adjusted to get from the DB */}
                    <SelectContent>
                      <SelectItem value="location1">Location 1</SelectItem>
                      <SelectItem value="location2">Location 2</SelectItem>
                      <SelectItem value="location3">Location 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Team Selection */}
            <div className="border p-4 flex flex-col gap-4">
              <Label>Select Teams</Label>
              <div className="flex flex-col gap-3">
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
                          <SelectItem value="teamB">Team B</SelectItem>
                          <SelectItem value="teamC">Team C</SelectItem>
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
                          <SelectItem value="SAS">SAS</SelectItem>
                          <SelectItem value="teamE">Team E</SelectItem>
                          <SelectItem value="teamF">Team F</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogClose asChild>
              <Button type="submit" className="w-full">
                Search
              </Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
