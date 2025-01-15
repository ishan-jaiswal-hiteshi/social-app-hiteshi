export interface User {
  id: number;
  username: string;
  full_name: string;
  profile_picture: string | null;
}

export interface Event {
  id: number;
  userId: number;
  name: string;
  description: string;
  eventDate: string;
  location: string;
  mediaUrls: string[] | null;
  createdAt: string;
  user: User;
}
