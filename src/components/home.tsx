import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Eye } from "lucide-react";
import EventForm from "@/components/EventForm";
import EventDetail from "@/components/EventDetail";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Define event type based on the database schema
type Event = Database["public"]["Tables"]["live_schedule"]["Row"];

const HomePage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<"date" | "venue">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Initialize Supabase client
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log("Supabase configuration:", {
    url: supabaseUrl ? "✓ Set" : "✗ Missing",
    key: supabaseAnonKey ? "✓ Set" : "✗ Missing",
    fullUrl: supabaseUrl,
  });

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Missing Supabase configuration. Please check environment variables.",
    );
  }

  const supabase = createClient<Database>(
    supabaseUrl || "",
    supabaseAnonKey || "",
  );

  // Fetch events from Supabase
  const fetchEvents = async () => {
    setIsLoading(true);
    console.log("Fetching events from live_schedule table...");
    console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("Sort field:", sortField, "Direction:", sortDirection);

    try {
      const { data, error } = await supabase
        .from("live_schedule")
        .select("*")
        .order(sortField, { ascending: sortDirection === "asc" });

      console.log("Supabase response:", { data, error });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Events fetched successfully:", data?.length || 0, "events");
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      // Show error in UI as well
      alert(
        `Error fetching events: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and refetch when sort changes
  useEffect(() => {
    fetchEvents();
  }, [sortField, sortDirection]);

  // Toggle sort direction or change sort field
  const handleSort = (field: "date" | "venue") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle event creation
  const handleCreateEvent = async (eventData: any) => {
    try {
      // Convert date to ISO string if it's a Date object
      const formattedData = {
        ...eventData,
        title: eventData.title || null,
        date:
          eventData.date instanceof Date
            ? eventData.date.toISOString().split("T")[0]
            : eventData.date,
        link: eventData.link || null,
        content: eventData.content || null,
        venue: eventData.venue || null,
        fee: eventData.fee || null,
        ticket: eventData.ticket || null,
        time: eventData.time || null,
      };

      console.log("Creating event with data:", formattedData);

      const { data, error } = await supabase
        .from("live_schedule")
        .insert([formattedData])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      console.log("Event created successfully:", data);
      setIsFormOpen(false);
      fetchEvents();
    } catch (error) {
      console.error("Error creating event:", error);
      alert(
        `Error creating event: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  // Handle event update
  const handleUpdateEvent = async (eventData: any) => {
    try {
      // Convert date to ISO string if it's a Date object
      const formattedData = {
        ...eventData,
        title: eventData.title || null,
        date:
          eventData.date instanceof Date
            ? eventData.date.toISOString().split("T")[0]
            : eventData.date,
        link: eventData.link || null,
        content: eventData.content || null,
        venue: eventData.venue || null,
        fee: eventData.fee || null,
        ticket: eventData.ticket || null,
        time: eventData.time || null,
      };

      console.log("Updating event with data:", formattedData);

      const { error } = await supabase
        .from("live_schedule")
        .update(formattedData)
        .eq("id", eventData.id);

      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }

      console.log("Event updated successfully");
      setIsFormOpen(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      alert(
        `Error updating event: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async (id: number) => {
    if (!confirm("このイベントを削除しますか？")) {
      return;
    }

    try {
      console.log("Deleting event with id:", id);

      const { error } = await supabase
        .from("live_schedule")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Supabase delete error:", error);
        throw error;
      }

      console.log("Event deleted successfully");
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      alert(
        `Error deleting event: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  // Open form for editing
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  // Open event details
  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">EVENT LIST</h1>
          <p className="text-muted-foreground text-lg">
            クールでアーティスティックなイベント管理
          </p>
        </header>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => handleSort("date")}
              className="flex items-center gap-2"
            >
              日付
              <ArrowUpDown
                size={16}
                className={
                  sortField === "date"
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSort("venue")}
              className="flex items-center gap-2"
            >
              会場
              <ArrowUpDown
                size={16}
                className={
                  sortField === "venue"
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              />
            </Button>
          </div>
          <Button
            onClick={() => {
              setEditingEvent(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            イベント追加
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full bg-background rounded-md border"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[250px] font-bold">Title</TableHead>
                <TableHead className="w-[150px] font-bold">Link</TableHead>
                <TableHead className="w-[250px] font-bold">Content</TableHead>
                <TableHead
                  className="w-[150px] font-bold cursor-pointer"
                  onClick={() => handleSort("venue")}
                >
                  <div className="flex items-center">
                    Venue
                    <ArrowUpDown
                      size={16}
                      className={
                        sortField === "venue"
                          ? "text-primary ml-2"
                          : "text-muted-foreground ml-2"
                      }
                    />
                  </div>
                </TableHead>
                <TableHead
                  className="w-[120px] font-bold cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Date
                    <ArrowUpDown
                      size={16}
                      className={
                        sortField === "date"
                          ? "text-primary ml-2"
                          : "text-muted-foreground ml-2"
                      }
                    />
                  </div>
                </TableHead>
                <TableHead className="w-[100px] font-bold">Fee</TableHead>
                <TableHead className="w-[150px] font-bold">Ticket</TableHead>
                <TableHead className="w-[120px] font-bold">Time</TableHead>
                <TableHead className="w-[120px] font-bold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    Loading events...
                  </TableCell>
                </TableRow>
              ) : events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div>
                      <p>No events found</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Check console for connection details
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <motion.tr
                    key={event.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`${hoveredRow === event.id.toString() ? "bg-accent" : ""}`}
                    onMouseEnter={() => setHoveredRow(event.id.toString())}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <TableCell className="font-medium">
                      {event.title || "No Title"}
                    </TableCell>
                    <TableCell className="text-blue-600 hover:underline">
                      {event.link && (
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {event.link.length > 20
                            ? `${event.link.substring(0, 20)}...`
                            : event.link}
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[250px] truncate">
                      {event.content || ""}
                    </TableCell>
                    <TableCell>{event.venue || ""}</TableCell>
                    <TableCell>
                      {event.date
                        ? new Date(event.date).toLocaleDateString()
                        : ""}
                    </TableCell>
                    <TableCell>{event.fee || ""}</TableCell>
                    <TableCell>{event.ticket || ""}</TableCell>
                    <TableCell>{event.time || ""}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewEvent(event)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditEvent(event)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </motion.div>
      </motion.div>

      {/* Event Form Modal */}
      <EventForm
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) {
            setEditingEvent(null);
          }
        }}
        onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
        initialData={
          editingEvent
            ? {
                id: editingEvent.id,
                title: editingEvent.title || "",
                link: editingEvent.link || "",
                content: editingEvent.content || "",
                venue: editingEvent.venue || "",
                date: editingEvent.date
                  ? new Date(editingEvent.date)
                  : new Date(),
                fee: editingEvent.fee || "",
                ticket: editingEvent.ticket || "",
                time: editingEvent.time || "",
              }
            : {}
        }
        mode={editingEvent ? "edit" : "create"}
      />

      {/* Event Detail Modal */}
      <EventDetail
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        event={selectedEvent}
      />
    </div>
  );
};

export default HomePage;
