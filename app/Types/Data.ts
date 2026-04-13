// =========== Data start =================== //

export interface Task {
  id: number;
  name: string;
  description: string;
  endDate?: string;
  status?: string;
  isCompleted?: boolean;
}

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
};

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: any;
}

export type UserDetail = {
  name: string | null;
  email: string | null;
  image: string | null;
};

export type AllUsersResponse = {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  gender: string;
  email: string;
  phone: string;
  dob: string;
};

export type UserData = {
  created_at: string;
  email: string;
  email_verified_at: null | string;
  id: number;
  name: string;
  updated_at: string;
};

export interface AllUsersDetailsData extends UserDetailsData {
  user: UserData;
}

export interface UserDetailsData {
  street: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  created_at: string;
  dob: string | null;
  email: string | null;
  gender: string | null;
  id: number;
  name: string;
  phone: string | null;
  updated_at: string;
  user_id: number;
  role: number;
  profile_image: string | null;
}

export interface AddUserResponse {
  data: UserData & {
    detail: UserDetailsData;
  };
  message: string;
}
export interface TaskData {
  id: number;
  name: string;
  status: string;
  end_date: string;
  notes: string;
  priority: string;
  assigned_to: { id: number; name: string; email: string } | null;
  assigned_to_user_name?: string;
  created_at?: string;
  updated_at?: string;
  fileCount: number;
  file_url: string[];
}

export interface TaskFormData {
  name: string;
  status: string;
  end_date: string;
  notes: string;
  priority: string;
  assigned_to: number | null;
  documents?: string[];
}

export interface TaskApiResponse {
  data: TaskData;
  message: string;
}

export interface CommentData {
  id: number;
  task_id: number;
  user_id: number;
  user_name: string;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface CommentPayload {
  comment: string;
  task_id: number;
  user_id: number;
}

// =========== Data end =================== //

// =========== Custom component start =================== //

// Input element
export interface InputProps {
  label: string;
  error?: string | string[];
  type?: string;
  layout?: string;
}

// Select element
export interface Option {
  label: string;
  value: string | number;
}

export interface SelectProps {
  label?: string;
  options: Option[];
  error?: string | string[];
  layout?: string;
  placeholder?: string;
  height?: string;
  variant?:
    | "outlined"
    | "filled"
    | "plain"
    | "solo"
    | "solo-filled"
    | "solo-inverted"
    | "underlined";
  density?: "default" | "comfortable" | "compact";
}

export type onlineType = {
  id: number;
  name: string;
};

export type SearchUserResponse = {
  id: number;
  name: string;
  type: string;
};

// =========== Custom component end =================== //
