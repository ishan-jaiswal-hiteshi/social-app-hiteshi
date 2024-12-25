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
