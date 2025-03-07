export interface AuthFormProps {
  formData: {
    email: string;
    fullName: string;
    userName: string;
    otp: string;
  };
  loading: boolean;
  error: string | null;
  isNewUser: boolean | null;
  emailSubmitted: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEmailSubmit: (e: React.FormEvent) => void;
  handleSubmit: (e: React.FormEvent) => void;
}
export interface User {
  id: number;
  username: string;
  email?: string;
  full_name: string;
  profile_picture?:
    | string
    | "https://i.pinimg.com/736x/1a/09/3a/1a093a141eeecc720c24543f2c63eb8d.jpg";

  cover_picture?: string | null;
  location?: string | null;
  job_title?: string | null;
  university?: string | null;
  bio?: string | null;
  friends?: number;
  follow_status?: string | "none";
  followings?: number;
  posts?: number;
  otp?: number | null;
  role?: string | "user";
  permissions?: {
    can_create_post: boolean;
    can_create_event: boolean;
    [key: string]: any;
  };
  other_data?: Record<string, any> | null;
  createdAt?: string;
  updatedAt?: string;
}
