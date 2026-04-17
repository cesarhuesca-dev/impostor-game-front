import { inject, Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, Observable, shareReplay } from 'rxjs';
import { DeviceType } from '@/enums/device-type.enum';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private breakpointObserver = inject(BreakpointObserver);

  getDeviceType(): Observable<DeviceType> {
    return this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web]).pipe(
      map((result) => {
        if (
          result.breakpoints[Breakpoints.Handset] ||
          result.breakpoints[Breakpoints.HandsetLandscape] ||
          result.breakpoints[Breakpoints.HandsetPortrait]
        ) {
          return DeviceType.mobile;
        } else if (
          result.breakpoints[Breakpoints.Tablet] ||
          result.breakpoints[Breakpoints.TabletLandscape] ||
          result.breakpoints[Breakpoints.TabletPortrait]
        ) {
          return DeviceType.tablet;
        } else {
          return DeviceType.desktop;
        }
      }),
      shareReplay(1),
    );
  }
}
