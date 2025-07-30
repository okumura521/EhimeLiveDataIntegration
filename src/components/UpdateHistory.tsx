import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

type Event = Database["public"]["Tables"]["live_schedule"]["Row"];

interface UpdateHistoryProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const UpdateHistory = ({
  open = true,
  onOpenChange = () => {},
}: UpdateHistoryProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [groupedEvents, setGroupedEvents] = useState<Record<string, Event[]>>(
    {},
  );

  // Initialize Supabase client
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabase = createClient<Database>(
    supabaseUrl || "",
    supabaseAnonKey || "",
  );

  useEffect(() => {
    if (open) {
      fetchUpdateHistory();
    }
  }, [open]);

  const fetchUpdateHistory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("live_schedule")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching update history:", error);
        return;
      }

      setEvents(data || []);

      // Group events by created_at date
      const grouped = (data || []).reduce(
        (acc, event) => {
          const createdDate = format(new Date(event.created_at), "yyyy-MM-dd");
          if (!acc[createdDate]) {
            acc[createdDate] = [];
          }
          acc[createdDate].push(event);
          return acc;
        },
        {} as Record<string, Event[]>,
      );

      setGroupedEvents(grouped);
    } catch (error) {
      console.error("Error fetching update history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (e) {
      return dateString;
    }
  };

  const formatEventDate = (dateString?: string | null) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-gray-800 max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Update History
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="text-center py-8">Loading update history...</div>
          ) : Object.keys(groupedEvents).length === 0 ? (
            <div className="text-center py-8">No update history found</div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedEvents).map(([createdDate, events]) => (
                <motion.div
                  key={createdDate}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    {formatDate(createdDate)}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="text-left py-2 px-3 font-medium">
                            Created Date
                          </th>
                          <th className="text-left py-2 px-3 font-medium">
                            Title
                          </th>
                          <th className="text-left py-2 px-3 font-medium">
                            Date
                          </th>
                          <th className="text-left py-2 px-3 font-medium">
                            Venue
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((event) => (
                          <tr
                            key={event.id}
                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <td className="py-2 px-3">
                              {format(
                                new Date(event.created_at),
                                "yyyy-MM-dd HH:mm",
                              )}
                            </td>
                            <td className="py-2 px-3 font-medium">
                              {event.title || "No Title"}
                            </td>
                            <td className="py-2 px-3">
                              {formatEventDate(event.date)}
                            </td>
                            <td className="py-2 px-3">{event.venue || ""}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateHistory;
