export interface AuthSession {
  user: {
    id: string;
    email: string;
    username: string;
    image: string | null;
  } | null;
  expires: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  username: string;
  password: string;
}