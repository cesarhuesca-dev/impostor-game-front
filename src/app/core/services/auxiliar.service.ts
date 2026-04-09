import { ToastMessage } from 'src/app/core/interfaces/toast-message.interface';
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/assets/environments/environment';
import { delay, map, Observable } from 'rxjs';
import { HandleResponseService } from './handle-response.service';
import { ItemListInterface } from '@/interfaces/list.interface';
import { HttpResponse } from '@/interfaces/http-response.interfaces';

@Injectable({providedIn: 'root'})
export class AuxiliarService {

  private readonly httpClient = inject(HttpClient);

  private readonly apiAuxiliarTopic: string = '/auxiliar';

  getCategories(): Observable<ItemListInterface[]>{
    return this.httpClient.get<HttpResponse<ItemListInterface[]>>(`${environment.URL_API}${this.apiAuxiliarTopic}/categories`)
    .pipe(
      map(res => {

        if(!res.success){
          return []
        }

        return res.data!

      }),
      delay(1000)
    );
  }
}


