export interface SignUpDTO {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
  newsletter: boolean;
  turnstileToken: string;
}

export interface LoginDTO {
  email: string;
  password: string;
  turnstileToken: string;
}
