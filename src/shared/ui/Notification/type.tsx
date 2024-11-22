export interface NotificationType {
  status: number | null;
  message?: string;
  visible: boolean;
  passport?: PasswordInfo;
}

export interface PasswordInfo {
  document_type: string;
  country: string;
  first_name: string;
  last_name: string;
  document_number: string;
  nationality: string;
  birth_date: string;
  sex: string;
  expiry_date: string;
  inn: string;
  check_hash: boolean;
}
