import { ToastPosition, ToastType } from 'src/app/core/enums/toast.enum';
import { ToastMessageOptions } from 'primeng/api';

export interface ToastMessage extends ToastMessageOptions {
  key?: ToastPosition;
  severity?: ToastType;
}
