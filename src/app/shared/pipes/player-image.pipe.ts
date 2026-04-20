import { environment } from '@/assets/environments/environment';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'playerImage',
  standalone: true,
})
export class PlayerImagePipe implements PipeTransform {
  private baseUrl = `${environment.URL_API}/game/player/image`;

  transform(value: string | null | undefined): string {
    return `${this.baseUrl}/${value}`;
  }
}
