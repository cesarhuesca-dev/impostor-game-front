export interface HttpResponse<T> {
  status:    number;
  error:     string;
  message:   string[];
  data?: T[];
  timestamp: Date;
  success:   boolean;
}
