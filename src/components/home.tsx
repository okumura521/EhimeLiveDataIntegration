import React, { useState, useEffect } from "react";
import { parse, endOfMonth, format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2, Eye } from "lucide-react";
import EventForm from "@/components/EventForm";
import EventDetail from "@/components/EventDetail";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Define event type based on the database schema
type Event = Database["public"]["Tables"]["live_schedule"]["Row"];

// Define area-venue mapping
const AREA_VENUES = {
  "中予": [
    "necco",
    "oto-doke",
    "SALONKITTY",
    "KITTYHALL",
    "WStudioRED",
    "Double-u Studio",
  ],
  "東予": ["MusicBoxHACO", "JEANDORE", "JamSounds"],
  "南予": [],
};

const AREAS = Object.keys(AREA_VENUES);

const HomePage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedVenue, setSelectedVenue] = useState<string>("all");
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [availableVenues, setAvailableVenues] = useState<string[]>([]);
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

  // Initialize current month and year
  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0");

    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
  }, []);

  // Fetch all events to get available years and months
  const fetchAvailableYearsAndMonths = async () => {
    try {
      const { data, error } = await supabase
        .from("live_schedule")
        .select("date")
        .not("date", "is", null);

      if (error) {
        console.error("Error fetching dates:", error);
        return;
      }

      const years = new Set<string>();
      const months = new Set<string>();

      data?.forEach((event) => {
        if (event.date) {
          const date = new Date(event.date);
          const year = date.getFullYear().toString();
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          years.add(year);
          months.add(month);
        }
      });

      setAvailableYears(Array.from(years).sort());
      setAvailableMonths(Array.from(months).sort());
    } catch (error) {
      console.error("Error fetching available dates:", error);
    }
  };

  // Fetch available venues based on year, month, and area
  const fetchAvailableVenues = async () => {
    if (!selectedYear || !selectedMonth) return;

    try {

      // 年・月文字列から Date オブジェクトを作成
      const baseDate = parse(
        `${selectedYear}-${selectedMonth}`,
        "yyyy-MM",
        new Date()
      );
      // 月初: 常に "01"
      const startDate = format(baseDate, "yyyy-MM-01");
      // 月末: endOfMonth で正しい最終日を取得
      const endDate   = format(endOfMonth(baseDate), "yyyy-MM-dd");

      let query = supabase
        .from("live_schedule")
        .select("venue")
        .gte("date", startDate)
        .lte("date", endDate)
        .not("venue", "is", null);

      // Filter by area if selected
      if (
        selectedArea &&
        selectedArea !== "all" &&
        AREA_VENUES[selectedArea as keyof typeof AREA_VENUES]
      ) {
        const venues = AREA_VENUES[selectedArea as keyof typeof AREA_VENUES];
        if (venues.length > 0) {
          query = query.in("venue", venues);
        } else {
          // If area has no venues, set empty array
          setAvailableVenues([]);
          return;
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching venues:", error);
        return;
      }

      const uniqueVenues = Array.from(
        new Set(data?.map((item) => item.venue).filter(Boolean)),
      ).sort();

      setAvailableVenues(uniqueVenues as string[]);
    } catch (error) {
      console.error("Error fetching available venues:", error);
    }
  };

  // Fetch events from Supabase with year/month/area/venue filter
  const fetchEvents = async () => {
    if (!selectedYear || !selectedMonth) return;

    setIsLoading(true);
    console.log("Fetching events from live_schedule table...");
    console.log(
      "Selected year:",
      selectedYear,
      "Selected month:",
      selectedMonth,
      "Selected area:",
      selectedArea,
      "Selected venue:",
      selectedVenue,
    );

    try {
        // 年・月文字列から Date オブジェクトを作成
      const baseDate = parse(
        `${selectedYear}-${selectedMonth}`,
        "yyyy-MM",
        new Date()
      );
      // 月初: 常に "01"
      const startDate = format(baseDate, "yyyy-MM-01");
      // 月末: endOfMonth で正しい最終日を取得
      const endDate   = format(endOfMonth(baseDate), "yyyy-MM-dd");

      let query = supabase
        .from("live_schedule")
        .select("*")
        .gte("date", startDate)
        .lte("date", endDate);

      // Filter by area if selected
      if (
        selectedArea &&
        selectedArea !== "all" &&
        AREA_VENUES[selectedArea as keyof typeof AREA_VENUES]
      ) {
        const venues = AREA_VENUES[selectedArea as keyof typeof AREA_VENUES];
        if (venues.length > 0) {
          query = query.in("venue", venues);
        } else {
          // If area has no venues, return empty results
          setEvents([]);
          setIsLoading(false);
          return;
        }
      }

      // Filter by venue if selected
      if (selectedVenue && selectedVenue !== "all") {
        query = query.eq("venue", selectedVenue);
      }

      const { data, error } = await query.order("date", { ascending: true });

      console.log("Supabase response:", { data, error });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Events fetched successfully:", data?.length || 0, "events");
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      alert(
        `Error fetching events: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch of available years and months
  useEffect(() => {
    fetchAvailableYearsAndMonths();
  }, []);

  // Fetch available venues when year, month, or area changes
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      fetchAvailableVenues();
      // Reset venue selection when area changes
      setSelectedVenue("all");
    }
  }, [selectedYear, selectedMonth, selectedArea]);

  // Fetch events when year, month, area, or venue changes
  useEffect(() => {
    if (selectedYear && selectedMonth) {
      fetchEvents();
    }
  }, [selectedYear, selectedMonth, selectedArea, selectedVenue]);

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
      fetchAvailableYearsAndMonths();
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
        .eq("id", editingEvent?.id);

      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }

      console.log("Event updated successfully");
      setIsFormOpen(false);
      setEditingEvent(null);
      fetchAvailableYearsAndMonths();
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
      fetchAvailableYearsAndMonths();
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
          <h1 className="text-4xl font-bold tracking-tight mb-2">EhimeLive&ClubEventDataIntegration</h1>
          <p className="text-muted-foreground text-lg">
            Sortable by year, month, area, and venue.
          </p>
        </header>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Year:</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                  {availableYears.length === 0 && (
                    <SelectItem value="no-years" disabled>
                      No years available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Month:</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                  {availableMonths.length === 0 && (
                    <SelectItem value="no-months" disabled>
                      No months available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Area:</label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Areas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Areas</SelectItem>
                  {AREAS.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Venue:</label>
              <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Venues" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Venues</SelectItem>
                  {availableVenues.map((venue) => (
                    <SelectItem key={venue} value={venue}>
                      {venue}
                    </SelectItem>
                  ))}
                  {availableVenues.length === 0 && (
                    <SelectItem value="no-venues" disabled>
                      No venues available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={() => {
              setEditingEvent(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            NewEvent
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full bg-background rounded-md border overflow-x-auto"
        >
          <div className="min-w-[1200px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[250px] font-bold">Title</TableHead>
                  <TableHead className="w-[150px] font-bold">Link</TableHead>
                  <TableHead className="w-[250px] font-bold">Content</TableHead>
                  <TableHead className="w-[150px] font-bold">Venue</TableHead>
                  <TableHead className="w-[120px] font-bold">Date</TableHead>
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
          </div>
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
                id: editingEvent.id,
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
