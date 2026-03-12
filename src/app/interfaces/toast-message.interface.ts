import { ToastPosition, ToastType } from "@/enums/toast.enum";
import { ToastMessageOptions } from "primeng/api";

export interface ToastMessage extends ToastMessageOptions {
  key?: ToastPosition;
  severity?: ToastType;
}
