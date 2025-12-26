// https://news.google.com/rss/search?q=onlyfans+after:2025-12-01+before:2025-12-15&hl=en-US&gl=US&ceid=US:en

import Parser from "rss-parser";

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  contentSnippet: string;
  source: string;
}

export class GoogleNewsService {
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  async searchNews(
    keyword: string,
    lang: string = "en",
    country: string = "US"
  ): Promise<NewsItem[]> {
    try {
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=${lang}&gl=${country}&ceid=${country}:${lang}`;

      const feed = await this.parser.parseURL(url);

      return feed.items.map((item) => ({
        title: item.title || "",
        link: item.link || "",
        pubDate: item.pubDate || "",
        content: item.content || "",
        contentSnippet: item.contentSnippet || "",
        source: item.source?.title || "Unknown",
      }));
    } catch (error) {
      console.error("Error fetching news:", error);
      throw error;
    }
  }
}

// const newsService = new GoogleNewsService();
// const news = await newsService.searchNews("artificial intelligence");
