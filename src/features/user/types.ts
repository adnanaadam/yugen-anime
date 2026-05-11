export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
}

export interface UserProfile extends User {
  totalAnime: number;
  totalEpisodes: number;
  level: number;
  xp: number;
  joinDate: string;
}