"use server";

import { JSDOM } from "jsdom";

export const getLogoFromUrl = async (url: string) => {
  if (url.length == 0) return null;

  const urlFormatted = new URL(url);

  const request = await fetch(url);
  const html = await request.text();

  const parser = new JSDOM(html);
  const htmlDocument = parser.window.document;
  const iconsLinks = htmlDocument.querySelectorAll("link[rel='icon']");

  const filteredLinks:
    | Element[]
    | { getAttribute: (arg0: string) => string | null }[] = [];

  iconsLinks.forEach((iconElement) => {
    if (!iconElement.getAttribute("href")) return;
    if (
      !iconElement.getAttribute("href")!.includes("android") &&
      !iconElement.getAttribute("href")!.includes("android")
    ) {
      filteredLinks.push(iconElement);
    }
  });

  const urlImage =
    urlFormatted.origin + filteredLinks[0]?.getAttribute("href") ?? null;

  return {
    urlImage,
    title: htmlDocument.title,
    description: htmlDocument
      .querySelector("meta[name='description']")
      ?.getAttribute("content"),
  };
};
