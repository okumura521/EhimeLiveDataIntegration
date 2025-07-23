import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface Event {
  id: string;
  title: string;
  link: string;
  content: string;
  venue: string;
  date: string;
  fee: string;
  ticket: string;
  time: string;
}

interface EventTableProps {
  events?: Event[];
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
  onView?: (event: Event) => void;
  onSort?: (column: string) => void;
}

const EventTable = ({
  events = [
    {
      id: "1",
      title: "Summer Music Festival",
      link: "https://example.com/summer-fest",
      content: "Annual summer music celebration featuring local artists",
      venue: "Central Park",
      date: "2023-07-15",
      fee: "¥3,000",
      ticket: "Available online",
      time: "12:00 - 20:00",
    },
    {
      id: "2",
      title: "Art Exhibition Opening",
      link: "https://example.com/art-exhibit",
      content: "Contemporary art showcase featuring international artists",
      venue: "Modern Gallery",
      date: "2023-08-05",
      fee: "¥1,500",
      ticket: "At the door",
      time: "18:00 - 21:00",
    },
    {
      id: "3",
      title: "Jazz Night",
      link: "https://example.com/jazz-night",
      content: "Evening of classic and modern jazz performances",
      venue: "Blue Note Club",
      date: "2023-06-30",
      fee: "¥2,500",
      ticket: "Reservation required",
      time: "19:30 - 23:00",
    },
  ],
  onEdit = () => {},
  onDelete = () => {},
  onView = () => {},
  onSort = () => {},
}: EventTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <div className="w-full bg-background rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[250px] font-bold">Title</TableHead>
            <TableHead className="w-[150px] font-bold">Link</TableHead>
            <TableHead className="w-[250px] font-bold">Content</TableHead>
            <TableHead
              className="w-[150px] font-bold cursor-pointer"
              onClick={() => onSort("venue")}
            >
              <div className="flex items-center">
                Venue
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead
              className="w-[120px] font-bold cursor-pointer"
              onClick={() => onSort("date")}
            >
              <div className="flex items-center">
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
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
          {events.map((event) => (
            <motion.tr
              key={event.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`${hoveredRow === event.id ? "bg-accent" : ""}`}
              onMouseEnter={() => setHoveredRow(event.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell className="text-blue-600 hover:underline">
                <a href={event.link} target="_blank" rel="noopener noreferrer">
                  {event.link.length > 20
                    ? `${event.link.substring(0, 20)}...`
                    : event.link}
                </a>
              </TableCell>
              <TableCell className="max-w-[250px] truncate">
                {event.content}
              </TableCell>
              <TableCell>{event.venue}</TableCell>
              <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
              <TableCell>{event.fee}</TableCell>
              <TableCell>{event.ticket}</TableCell>
              <TableCell>{event.time}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(event)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(event)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(event)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventTable;
