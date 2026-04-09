import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { TieredMenu, TieredMenuModule } from 'primeng/tieredmenu';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';

import urls from '@/assets/urls/pages.json';
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { MenuItem } from 'primeng/api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { NavigationPages } from 'src/app/core/interfaces/navigation-pages.interfaces';
import { PlayerService } from '@/services/player.service';

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

  private readonly router = inject(Router)
  private readonly destroyRef = inject(DestroyRef);
  private readonly playerService = inject(PlayerService);

  private readonly URLS: NavigationPages[] = urls as NavigationPages[];

  navigationItems = signal<NavigationPages[]>([]);
  classMenuIcon = signal<string>('');

  isLogged = computed(() => this.playerService.isLogged);
  isHost = computed(() => this.playerService.playerData?.host ? true : false);
  overlay = computed(() => this.playerService.playerData?.game.overlay ? true : false);

  constructor(){
    effect(() => {
      this.setNavigationData();
    });
  }

  ngOnInit(): void {
    this.setNavigationData()
    this.setUrlListerner();
  }

  setNavigationData(){

    const filteredNav = this.URLS.filter(item => {

      // Items que siempre aparece
      if(item.login === undefined && item.needHost === undefined) return true;

      // Si no requiere loguien y lo esta  → fuera
      if (!item.login && this.isLogged()) return false;

      // Si requiere login y no esta logueado → fuera
      if (item.login && !this.isLogged()) return false;

      // Si requiere host y no lo es → fuera
      if (item.needHost && !this.isHost()) return false;

      // Si requiere host y no lo es → fuera
      if (item.needHost && !this.isHost()) return false;

      // Si es el overlay y no lo quiere → fuera
      if(item.overlay && !this.overlay()) return false;

      return true;
    });

    this.navigationItems.update(() => [...filteredNav]);
  }

  setUrlListerner(){
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setLoadIcon(event.urlAfterRedirects);
      }
    });
  }

  setLoadIcon(urlString: string){
    const find = this.URLS.find( x => x.routerLink === urlString ) as MenuItem;

    if(!find) return;

    this.changeIcon(find);
  }

  changeIcon(item: MenuItem) {
    this.classMenuIcon.update(() => item.icon! );
  }
}




