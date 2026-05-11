import type { User, UserProfile } from "./types";

export async function fetchCurrentUser(): Promise<User | null> {
  // TODO: Implement with Auth integration
  return null;
}

export async function fetchUserProfile(username: string): Promise<UserProfile | null> {
  // TODO: Implement with API integration
  return null;
}

export async function updateUserProfile(data: Partial<User>): Promise<User> {
  // TODO: Implement with API integration
  throw new Error("Not implemented");
}