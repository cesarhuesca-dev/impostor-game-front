import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastMessageService } from './toast-message.service';
import { ToastPosition, ToastType } from 'src/app/core/enums/toast.enum';
import { LoaderService } from './loader.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpResponse } from 'src/app/core/interfaces/http-response.interfaces';

@Injectable({
  providedIn: 'root'
})
export class HandleResponseService {

  private readonly toastMessageService = inject(ToastMessageService);
  private readonly loadingService = inject(LoaderService);
  private readonly translateService = inject(TranslateService);

  handleResposne(response : HttpResponse<any>, title: string = '' , stopLoading: boolean = true, fnClearForm:(() => void) | null = null ) : boolean {

    if(fnClearForm){
      fnClearForm();
    }

    if(stopLoading){
      this.loadingService.finishLoading();
    }

    if(response.success){
      this.setToastSuccess(title);
      return true;
    }else {
      this.setToastWarning();
      return false;
    }


  }

  handleError(error : HttpErrorResponse, titleError: string = '', fnClearForm:(() => void) | null = null ): void{

    this.setToastError(error, titleError);

    if(fnClearForm){
      fnClearForm();
    }

    this.loadingService.finishLoading();
  }

  private setToastSuccess(title: string = ''){

    if(title.length === 0 ){
      return;
    }

    this.toastMessageService.addMessage({
      key: ToastPosition.TOP_RIGHT,
      severity: ToastType.SUCCESS,
      summary: this.translateService.instant(title),
    });
  }

  private setToastWarning(){
    this.toastMessageService.addMessage({
      key: ToastPosition.TOP_RIGHT,
      severity: ToastType.WARN,
      summary: this.translateService.instant('error.warning'),
    });
  }

  private setToastError(error : HttpErrorResponse, titleError: string = ''){

    if(titleError.length === 0 ){
      return
    }

    this.toastMessageService.addMessage({
      key: ToastPosition.TOP_RIGHT,
      severity: ToastType.ERROR,
      summary: this.translateService.instant(titleError),
      detail: error.error.message,
    });
  }

}
