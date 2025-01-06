export interface Event {
  id: number;
  userId: number;
  name: string;
  description: string;
  eventDate: string;
  location: string;
  mediaUrls: string[] | null;
  status: "upcoming" | "today" | "past";
  createdAt: string;
}
