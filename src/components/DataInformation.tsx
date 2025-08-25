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
  onOpenChange = () => { },
}: DataInformationProps) => {
  const venueDataSources = [
    {
      venue: "Double-u Studio",
      area: "中予",
      dataSource: "未対応",
      method: "",
      frequency: "",
      conditions: "",
      reliability: "",
      lastUpdated: "",
    },
    {
      venue: "JEANDORE",
      area: "東予",
      dataSource: "Official WebSite",
      method: "Website Scraping https://www.jeandore.com/live/live.html にアクセスし更新情報を取得",
      frequency: "毎日12:00実行",
      conditions: "イベント識別方法：イベントタイトル名",
      reliability: "",
      lastUpdated: "2024-08-24",
    },
    {
      venue: "JamSounds",
      area: "東予",
      dataSource: "未対応",
      method: "",
      frequency: "",
      conditions: "",
      reliability: "",
      lastUpdated: "",
    },
    {
      venue: "MusicBoxHACO",
      area: "東予",
      dataSource: "Official WebSite",
      method: "Website Scraping https://www.musicboxhaco.com/schedule にアクセスし更新情報を取得",
      frequency: "毎日12:00実行",
      conditions: "イベント識別方法：イベントタイトル名",
      reliability: "",
      lastUpdated: "2024-08-24",
    },
    {
      venue: "necco",
      area: "中予",
      dataSource: "Official instagram",
      method: "instagram API 経由で情報を取得※実装予定",
      frequency: "毎時30分に更新情報確認※未実装",
      conditions:
        "・除外設定：タグが＃event以外は対象外とする・イベント識別方法：id",
      reliability: "",
      lastUpdated: "2024-07-25",
    },
    {
      venue: "oto-doke",
      area: "中予",
      dataSource: "Official WebSite",
      method: "未対応 ※一部手動で情報取得し追加",
      frequency: "",
      conditions: "",
      reliability: "",
      lastUpdated: "2024-07-22",
    },
    {
      venue: "SALONKITTY & KITTYHALL",
      area: "中予",
      dataSource: "Official WebSite",
      method: "RSS Feed Integration http://red.double-ustudio.com/feed にアクセスし更新情報を取得",
      frequency: "毎時30分に更新情報確認",
      conditions:
        "開催日はtitleとcontentから抽出し設定 理由：Rssの項目に開催日が無いため。除外設定：Rss categories が「お知らせ」のみの場合 イベント識別方法：guid",
      reliability: "",
      lastUpdated: "2025-08-24",
    },
    {
      venue: "WStudioRED",
      area: "中予",
      dataSource: "Official WebSite",
      method: "RSS Feed Integration http://red.double-ustudio.com/feed にアクセスし更新情報を取得",
      frequency: "毎時30分に更新情報確認",
      conditions: "イベント識別方法：guid",
      reliability: "",
      lastUpdated: "2025-08-24",
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
            各会場の情報を取得するためのデータソース情報、取得方法、取得条件について。
          </p>
          <p className="text-muted-foreground">
            共通処理：取得したデータをAI(gemini-2.0-flash)にて解析し、開催日(Date)、時間(time)、タイトル(title)、コンテンツ(Contest)、料金(fee)、チケット(Ticket)、リンク(Link)、会場(Venue)の情報に設定
          </p>
          <p className="text-muted-foreground text-sm">
            ※補足：会場並び順 A→Z
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
            <h3 className="font-semibold mb-2">AI 解析条件</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 入力データのみを解析対象とし、外部情報や推測による補完は行わない</li>
              <li>• 抽出項目はタイトル、日付、内容、時間、料金、チケットURL、画像URL、会場名</li>
              <li>• 入力に存在しない項目は必ず null(空文字) とする</li>
              <li>• HTML特殊文字や不要な空白は除去し、改行は \n で処理</li>
              <li>• 画像は、同一画像が複数ある場合は最初のURLのみ保持し、srcset がある場合は src を省く</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataInformation;