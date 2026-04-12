import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/assets/environments/environment';
import { delay, map, Observable } from 'rxjs';
import { ItemListInterface } from '@/interfaces/utilities/list.interface';
import { HttpResponse } from '@/interfaces/response/http-response.interfaces';

@Injectable({ providedIn: 'root' })
export class AuxiliarService {
  private readonly httpClient = inject(HttpClient);

  private readonly apiAuxiliarTopic: string = '/auxiliar';

  getCategories(): Observable<ItemListInterface[]> {
    return this.httpClient.get<HttpResponse<ItemListInterface>>(`${environment.URL_API}${this.apiAuxiliarTopic}/categories`).pipe(
      map((res) => {
        if (!res.success) {
          return [];
        }

        return res.data!;
      }),
      delay(1000),
    );
  }
}
