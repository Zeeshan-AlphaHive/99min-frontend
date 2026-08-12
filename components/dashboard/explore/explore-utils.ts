import type { ApiTask } from "@/utils/api/tasks.api";
import type { TaskDetailsData } from "@/components/dashboard/TaskDetails";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface ExploreTask extends TaskDetailsData {
  createdBy: string;
  posterUserId: string;
}

export function buildMediaUrl(path?: string): string {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http")) return path;
  return `${API_URL}/${path.replace(/^\//, "")}`;
}

export function formatTimeLeft(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

export function formatPrice(min: number, max: number, currency = "USD"): string {
  const symbol = currency === "USD" ? "$" : `${currency} `;
  if (min === max) return `${symbol}${min}`;
  return `${symbol}${min}–${max}`;
}

export function mapApiTask(task: ApiTask): ExploreTask {
  return {
    _id: task._id,
    image: buildMediaUrl(task.media?.[0]),
    title: task.title,
    description: task.description,
    price:
      task.budget.min === task.budget.max
        ? `${task.budget.min}`
        : `${task.budget.min}-${task.budget.max}`,
    location: task.location.label,
    timeLeft: formatTimeLeft(task.expiresAt),
    interest: task.interestCount ?? 0,
    urgent: task.urgent,
    category: task.category,
    postedTime: `Posted ${timeAgo(task.createdAt)}`,
    tags: task.tags?.map((t) => `#${t}`) ?? [],
    createdBy: task.posterUserId._id,
    posterUserId: task.posterUserId._id,
  };
}

export const isVideoUrl = (url: string): boolean =>
  /\.(mp4|webm|ogg|mov|avi|mkv)(\?.*)?$/i.test(url);
