import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastMessageService } from './toast-message.service';
import { ToastPosition, ToastType } from '@/enums/toast.enum';
import { LoaderService } from './loader.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpResponse } from '@/interfaces/http-response.interfaces';

@Injectable({
  providedIn: 'root'
})
export class HandleResponseService {

  private readonly toastMessageService = inject(ToastMessageService);
  private readonly loadingService = inject(LoaderService);
  private readonly translateService = inject(TranslateService);

  handleResposne(response : HttpResponse<any>, title: string = '' , fnClearForm:(() => void) | null = null ) : boolean {

    if(fnClearForm){
      fnClearForm();
    }

    this.loadingService.finishLoading();

    if(response.success){
        this.toastMessageService.addMessage({
        key: ToastPosition.TOP_RIGHT,
        severity: ToastType.SUCCESS,
        summary: this.translateService.instant(title),
      });
      return true;
    }else {
      this.toastMessageService.addMessage({
        key: ToastPosition.TOP_RIGHT,
        severity: ToastType.WARN,
        summary: this.translateService.instant('error.warning'),
      });

      return false;
    }


  }

  handleError(error : HttpErrorResponse, titleError: string = '' ,fnClearForm:(() => void) | null = null ): void{
    this.toastMessageService.addMessage({
      key: ToastPosition.TOP_RIGHT,
      severity: ToastType.ERROR,
      summary: this.translateService.instant(titleError),
      detail: error.error.message,
    });

    if(fnClearForm){
      fnClearForm();
    }

    this.loadingService.finishLoading();
  }

}
