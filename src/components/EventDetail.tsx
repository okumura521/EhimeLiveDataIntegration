import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Calendar,
  MapPin,
  Clock,
  Ticket,
  DollarSign,
  Link as LinkIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export interface EventDetailProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  event?: {
    id: number;
    title: string | null;
    link?: string | null;
    content?: string | null;
    venue?: string | null;
    date?: string | null;
    fee?: string | null;
    ticket?: string | null;
    time?: string | null;
    created_at?: string;
    guid?: string | null;
    pubData?: string | null;
  };
}

const EventDetail = ({
  open = true,
  onOpenChange = () => {},
  event,
}: EventDetailProps) => {
  // Default event data if no event is provided
  const defaultEvent = {
    id: 1,
    title: "Sample Event",
    link: "https://example.com",
    content:
      "This is a sample event description with details about what to expect.",
    venue: "Sample Venue",
    date: "2023-12-31",
    fee: "¥3,000",
    ticket: "Available online",
    time: "19:00-22:00",
  };

  // Use provided event or default event
  const displayEvent = event || defaultEvent;

  // Don't render if no event and open is false
  if (!event && !open) {
    return null;
  }
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-gray-800 max-w-2xl overflow-hidden p-0">
        <div className="bg-black text-white p-6">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {displayEvent.title || "No Title"}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {displayEvent.link && (
              <DialogDescription className="text-gray-400 flex items-center mt-2">
                <LinkIcon className="h-4 w-4 mr-2" />
                <a
                  href={displayEvent.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {displayEvent.link}
                </a>
              </DialogDescription>
            )}
          </DialogHeader>
        </div>

        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {displayEvent.content && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {displayEvent.content}
                </p>
              </div>
            )}

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayEvent.date && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start space-x-3"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Date
                    </h4>
                    <p className="font-medium">
                      {formatDate(displayEvent.date)}
                    </p>
                  </div>
                </motion.div>
              )}

              {displayEvent.venue && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start space-x-3"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Venue
                    </h4>
                    <p className="font-medium">{displayEvent.venue}</p>
                  </div>
                </motion.div>
              )}

              {displayEvent.time && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start space-x-3"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Time
                    </h4>
                    <p className="font-medium">{displayEvent.time}</p>
                  </div>
                </motion.div>
              )}

              {displayEvent.fee && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start space-x-3"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Fee
                    </h4>
                    <p className="font-medium">{displayEvent.fee}</p>
                  </div>
                </motion.div>
              )}

              {displayEvent.ticket && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start space-x-3 col-span-1 md:col-span-2"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
                    <Ticket className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Ticket
                    </h4>
                    <p className="font-medium">{displayEvent.ticket}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          <div className="mt-8 flex justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-medium"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetail;
