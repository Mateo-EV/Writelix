import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateForChat(date: Date) {
  const dateDifferenceInTime = new Date().getTime() - date.getTime();
  const dateDifferenceInDays = dateDifferenceInTime / (1000 * 60 * 60 * 24);

  if (dateDifferenceInDays < 1) return dayjs(date).format("h:mm a");

  if (dateDifferenceInDays < 2)
    return "Yesterday · " + dayjs(date).format("h:mm a");

  if (dateDifferenceInDays <= 6) return dayjs(date).format("dddd · h:mm a");

  return dayjs(date).format("DD/MM/YYYY · h:mm a");
}

export function formatDate(date: Date) {
  return dayjs(date).format("DD/MM/YYYY");
}
