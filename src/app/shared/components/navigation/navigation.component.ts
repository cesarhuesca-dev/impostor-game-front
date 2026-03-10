import { AfterViewInit, ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, OnInit, signal, untracked, viewChild } from '@angular/core';
import { TieredMenu, TieredMenuModule } from 'primeng/tieredmenu';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';

import urls from '@/assets/urls/pages.json';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from "@angular/router";
import { MenuItem } from 'primeng/api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { NavigationPages } from '@/interfaces/navigation-pages.interfaces';

@Component({
  selector: 's-navigation',
  imports: [TieredMenuModule, TieredMenu,  ButtonModule, TranslatePipe, RouterLink],
  templateUrl: './navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host : {
    class : 's-navigation-component'
  }
})
export class NavigationComponent implements OnInit {

  router = inject(Router)
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  private URLS: NavigationPages[] = urls as NavigationPages[];

  items = signal(this.URLS);
  classMenuIcon = signal<string>('');


  ngOnInit(): void {
    this.setUrlListerner();
  }

  setUrlListerner(){
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setLoadIcon(event.urlAfterRedirects);
      }
    });
  }

  setLoadIcon(urlString: string){
    const find = this.items().find( x => x.routerLink === urlString ) as MenuItem;

    if(!find) return;

    this.changeIcon(find);
  }

  changeIcon(item: MenuItem) {
    this.classMenuIcon.update(() => item.icon! )
  }
}




