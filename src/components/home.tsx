import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventTable from "@/components/EventTable";
import EventForm from "@/components/EventForm";
import EventDetail from "@/components/EventDetail";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Define event type based on the database schema
type Event = {
  id: number;
  title: string;
  link: string | null;
  content: string | null;
  venue: string | null;
  date: string | null;
  fee: string | null;
  ticket: string | null;
  time: string | null;
  created_at: string;
};

const HomePage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<"date" | "venue">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Initialize Supabase client
  const supabase = createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL || "",
    import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  );

  // Fetch events from Supabase
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order(sortField, { ascending: sortDirection === "asc" });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
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
  const handleCreateEvent = async (
    eventData: Omit<Event, "id" | "created_at">,
  ) => {
    try {
      const { data, error } = await supabase
        .from("events")
        .insert([eventData])
        .select();

      if (error) throw error;
      setIsFormOpen(false);
      fetchEvents();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  // Handle event update
  const handleUpdateEvent = async (
    eventData: Partial<Event> & { id: number },
  ) => {
    try {
      const { error } = await supabase
        .from("events")
        .update(eventData)
        .eq("id", eventData.id);

      if (error) throw error;
      setIsFormOpen(false);
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async (id: number) => {
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);

      if (error) throw error;
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
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
        >
          <EventTable
            events={events}
            isLoading={isLoading}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            onView={handleViewEvent}
          />
        </motion.div>
      </motion.div>

      {/* Event Form Modal */}
      <EventForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
        event={editingEvent}
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
