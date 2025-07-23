import React, { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  link: z
    .string()
    .url({ message: "Must be a valid URL" })
    .optional()
    .or(z.literal("")),
  content: z.string().min(1, { message: "Content is required" }),
  venue: z.string().min(1, { message: "Venue is required" }),
  date: z.date({ required_error: "Date is required" }),
  fee: z.string().optional(),
  ticket: z.string().optional(),
  time: z.string().optional(),
});

export type EventFormData = z.infer<typeof formSchema>;

interface EventFormProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: EventFormData) => void;
  initialData?: Partial<EventFormData>;
  mode?: "create" | "edit";
}

const EventForm = ({
  open = true,
  onOpenChange = () => {},
  onSubmit = () => {},
  initialData = {},
  mode = "create",
}: EventFormProps) => {
  const form = useForm<EventFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title || "",
      link: initialData.link || "",
      content: initialData.content || "",
      venue: initialData.venue || "",
      date: initialData.date || new Date(),
      fee: initialData.fee || "",
      ticket: initialData.ticket || "",
      time: initialData.time || "",
    },
  });

  const handleSubmit = (data: EventFormData) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-gray-800 sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {mode === "create" ? "Create New Event" : "Edit Event"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Event title"
                      {...field}
                      className="border-gray-700 focus:border-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      {...field}
                      className="border-gray-700 focus:border-gray-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Event description"
                      {...field}
                      className="border-gray-700 focus:border-gray-500 min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Venue</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Event venue"
                        {...field}
                        className="border-gray-700 focus:border-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-semibold">Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={
                              "w-full pl-3 text-left font-normal border-gray-700 focus:border-gray-500"
                            }
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Fee</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Entry fee"
                        {...field}
                        className="border-gray-700 focus:border-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ticket"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Ticket</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ticket info"
                        {...field}
                        className="border-gray-700 focus:border-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Time</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Event time"
                        {...field}
                        className="border-gray-700 focus:border-gray-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-gray-700 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gray-800 hover:bg-gray-700 text-white"
              >
                {mode === "create" ? "Create Event" : "Update Event"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
