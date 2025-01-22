export interface PostData {
  id: number;
  userId: number;
  User: {
    id: number;
    name: string;
    username: string;
    full_name: string;
    profile_picture: string;
  };
  content: string;
  mediaUrls: string[];
  reactionIds: number[];
  createdAt: string;
  timestamp: string;
  likesCount: number;
  commentsCount: number;
  PostLikes: { userId: number; reactionId: number }[];
}
