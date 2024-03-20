import "server-only";

import { env } from "@/env";

type YoutubeVideoJson = {
  kind: string;
  etag: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: {
    kind: string;
    etag: string;
    id: string;
  }[];
};

export const getYoutubeVideoByKey = async (key: string) => {
  try {
    const api = `https://www.googleapis.com/youtube/v3/videos?part=id&id=${key}&key=${env.GOOGLE_API_KEY}`;
    const req = await fetch(api);

    const result = (await req.json()) as YoutubeVideoJson;

    if (!result.pageInfo.totalResults || result.pageInfo.totalResults !== 1)
      return null;
    if (!result.items[0] || result.items[0].kind !== "youtube#video")
      return null;

    return result.items[0];
  } catch (error) {
    return null;
  }
};
