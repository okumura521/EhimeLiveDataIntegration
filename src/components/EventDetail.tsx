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
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
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
  onEdit?: (event: any) => void;
  onDelete?: (id: number) => void;
  isAuthenticated?: boolean;
  event?: {
    id: number;
    title: string | null;
    link: string | null;
    content: string | null;
    venue: string | null;
    date: string | null;
    fee: string | null;
    ticket: string | null;
    time: string | null;
    image_url: string | null;
    created_at?: string;
    guid?: string | null;
    pubData?: string | null;
  } | null;
}

const EventDetail = ({
  open = true,
  onOpenChange = () => {},
  onEdit = () => {},
  onDelete = () => {},
  isAuthenticated = false,
  event,
}: EventDetailProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

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
    image_url:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80",
  };

  // Use provided event or default event
  const displayEvent = event || defaultEvent;
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

  // Parse image URLs (assuming comma-separated if multiple)
  const imageUrls = displayEvent.image_url
    ? displayEvent.image_url
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url)
    : [];

  // Reset image errors when event changes
  React.useEffect(() => {
    setImageErrors({});
    setCurrentImageIndex(0);
  }, [displayEvent.id]);

  const nextImage = () => {
    if (imageUrls.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
    }
  };

  const prevImage = () => {
    if (imageUrls.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + imageUrls.length) % imageUrls.length,
      );
    }
  };

  const handleEdit = () => {
    onEdit(displayEvent);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (confirm("このイベントを削除しますか？")) {
      onDelete(displayEvent.id);
      onOpenChange(false);
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
            {/* Image Display */}
            {imageUrls.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Images</h3>
                <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  {imageErrors[currentImageIndex] ? (
                    <div className="w-full min-h-64 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-center p-4">
                      <p className="text-red-500 font-medium mb-2">
                        Failed to retrieve image data from the following image
                        URL
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 break-all">
                        {imageUrls[currentImageIndex]}
                      </p>
                    </div>
                  ) : (
                    <img
                      src={imageUrls[currentImageIndex]}
                      alt={`Event image ${currentImageIndex + 1}`}
                      className="w-full h-auto max-h-96 object-contain"
                      onError={() => {
                        setImageErrors((prev) => ({
                          ...prev,
                          [currentImageIndex]: true,
                        }));
                      }}
                    />
                  )}
                  {imageUrls.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {imageUrls.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex
                                ? "bg-white"
                                : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

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

          <div className="mt-8 flex justify-between">
            {isAuthenticated && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  className="flex items-center gap-2 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-medium ml-auto"
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
