"use server";

import { JSDOM } from "jsdom";
import { utapi } from "../api/uploadthing/core";

export const getLogoFromUrl = async (url: string) => {
  if (url.length == 0) return null;

  const urlFormatted = new URL(url);

  const request = await fetch(url);
  const html = await request.text();

  const parser = new JSDOM(html);
  const htmlDocument = parser.window.document;
  const iconsLinks = htmlDocument.querySelectorAll("link");

  const filteredLinks:
    | Element[]
    | { getAttribute: (arg0: string) => string | null }[] = [];

  iconsLinks.forEach((iconElement) => {
    if (!iconElement.getAttribute("href")) return;
    if (
      !iconElement.getAttribute("href")!.includes("android") &&
      !iconElement.getAttribute("href")!.includes("apple") &&
      iconElement.getAttribute("rel")?.includes("icon")
    ) {
      filteredLinks.push(iconElement);
    }
  });

  const link = filteredLinks[0]?.getAttribute("href");
  const urlImage = link
    ? link.startsWith("http")
      ? link
      : urlFormatted.origin + link
    : null;

  return {
    urlImage,
    title: htmlDocument.title,
    description:
      htmlDocument
        .querySelector("meta[name='description']")
        ?.getAttribute("content") ??
      htmlDocument
        .querySelector("meta[property='og//:description']")
        ?.getAttribute("content"),
  };
};

export const getUrlFromFileId = async (fileId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const [file] = await utapi.getFileUrls(fileId, { keyType: "customId" });

  return file?.url;
};
