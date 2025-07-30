import React from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Database, Globe, Calendar, MapPin } from "lucide-react";

interface DataInformationProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DataInformation = ({
  open = true,
  onOpenChange = () => {},
}: DataInformationProps) => {
  const venueDataSources = [
    {
      venue: "necco",
      area: "中予",
      dataSource: "Official Website Scraping",
      method: "Automated web scraping from event calendar",
      frequency: "Daily at 6:00 AM JST",
      conditions: "Events with confirmed dates and ticket information",
      reliability: "High - Direct from venue",
      lastUpdated: "2024-01-15",
    },
    {
      venue: "oto-doke",
      area: "中予",
      dataSource: "RSS Feed Integration",
      method: "RSS feed parsing from venue's event system",
      frequency: "Every 4 hours",
      conditions: "Published events only, excludes private bookings",
      reliability: "High - Automated feed",
      lastUpdated: "2024-01-14",
    },
    {
      venue: "SALONKITTY",
      area: "中予",
      dataSource: "Social Media API",
      method: "Instagram and Twitter API integration",
      frequency: "Real-time monitoring",
      conditions: "Posts with #event hashtag and date information",
      reliability: "Medium - Depends on social media posts",
      lastUpdated: "2024-01-16",
    },
    {
      venue: "KITTYHALL",
      area: "中予",
      dataSource: "Manual Entry",
      method: "Staff manual input from venue communications",
      frequency: "Weekly updates",
      conditions: "Confirmed events with complete information",
      reliability: "High - Verified by staff",
      lastUpdated: "2024-01-12",
    },
    {
      venue: "WStudioRED",
      area: "中予",
      dataSource: "Email Newsletter Parsing",
      method: "Automated parsing of venue newsletters",
      frequency: "Upon newsletter receipt",
      conditions: "Events mentioned in official newsletters",
      reliability: "Medium - Depends on newsletter format",
      lastUpdated: "2024-01-13",
    },
    {
      venue: "Double-u Studio",
      area: "中予",
      dataSource: "API Integration",
      method: "Direct API connection with venue booking system",
      frequency: "Real-time synchronization",
      conditions: "Public events only, excludes rehearsals",
      reliability: "Very High - Direct system integration",
      lastUpdated: "2024-01-16",
    },
    {
      venue: "MusicBoxHACO",
      area: "東予",
      dataSource: "Website Monitoring",
      method: "Automated monitoring of event page changes",
      frequency: "Every 6 hours",
      conditions: "Events with ticket sales information",
      reliability: "High - Automated detection",
      lastUpdated: "2024-01-15",
    },
    {
      venue: "JEANDORE",
      area: "東予",
      dataSource: "Phone Call Verification",
      method: "Weekly phone calls to venue for event confirmation",
      frequency: "Weekly on Mondays",
      conditions: "Confirmed public events only",
      reliability: "Very High - Direct verification",
      lastUpdated: "2024-01-15",
    },
    {
      venue: "JamSounds",
      area: "東予",
      dataSource: "Collaborative Platform",
      method: "Venue staff directly input events via web portal",
      frequency: "As events are scheduled",
      conditions: "All public events and workshops",
      reliability: "Very High - Direct venue input",
      lastUpdated: "2024-01-16",
    },
  ];

  const getReliabilityColor = (reliability: string) => {
    if (reliability.includes("Very High"))
      return "text-green-600 dark:text-green-400";
    if (reliability.includes("High")) return "text-blue-600 dark:text-blue-400";
    if (reliability.includes("Medium"))
      return "text-yellow-600 dark:text-yellow-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const getMethodIcon = (method: string) => {
    if (method.includes("API") || method.includes("RSS"))
      return <Database className="h-4 w-4" />;
    if (method.includes("Website") || method.includes("Scraping"))
      return <Globe className="h-4 w-4" />;
    if (method.includes("Social Media"))
      return <Calendar className="h-4 w-4" />;
    return <MapPin className="h-4 w-4" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-gray-800 max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Information about the Data
          </DialogTitle>
          <p className="text-muted-foreground">
            Data source information for each venue, including retrieval methods
            and conditions
          </p>
        </DialogHeader>

        <div className="py-4">
          <div className="grid gap-6">
            {venueDataSources.map((source, index) => (
              <motion.div
                key={source.venue}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{source.venue}</h3>
                    <p className="text-sm text-muted-foreground">
                      {source.area} Area
                    </p>
                  </div>
                  <div
                    className={`text-sm font-medium ${getReliabilityColor(source.reliability)}`}
                  >
                    {source.reliability}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      {getMethodIcon(source.method)}
                      <div>
                        <h4 className="font-medium text-sm">Data Source</h4>
                        <p className="text-sm text-muted-foreground">
                          {source.dataSource}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-1">Method</h4>
                      <p className="text-sm text-muted-foreground">
                        {source.method}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-1">
                        Update Frequency
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {source.frequency}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Conditions</h4>
                      <p className="text-sm text-muted-foreground">
                        {source.conditions}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-1">Last Updated</h4>
                      <p className="text-sm text-muted-foreground">
                        {source.lastUpdated}
                      </p>
                    </div>
                  </div>
                </div>

                {index < venueDataSources.length - 1 && (
                  <Separator className="mt-6" />
                )}
              </motion.div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">Data Quality Notes</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• All data is processed and validated before display</li>
              <li>
                • Event information is cross-referenced when multiple sources
                are available
              </li>
              <li>
                • Manual verification is performed for high-profile events
              </li>
              <li>• Data retention period: 2 years for historical analysis</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataInformation;
