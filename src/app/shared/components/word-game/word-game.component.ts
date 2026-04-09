import { ItemListInterface } from '@/interfaces/list.interface';
import { AuxiliarService } from '@/services/auxiliar.service';
import { GameService } from '@/services/game.service';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 's-word-game',
  imports: [TranslatePipe, NgClass],
  templateUrl: './word-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordGameComponent implements OnInit {

  private gameService = inject(GameService);
  private readonly auxiliarService = inject(AuxiliarService);

  game = computed(() => this.gameService.gameData);
  gameCategories = signal<ItemListInterface[]>([]);
  titleCategoryGame = computed<string>(() => this.gameCategories().find(x => x.value === this.game()?.category)?.label ?? '');
  titleWordGame = computed<string>(() => this.game()?.word ?? '');

  ngOnInit(): void {
    this.setGameCategories()
  }

  setGameCategories(){
    this.auxiliarService.getCategories().subscribe(categories => {
      this.gameCategories.update(() => categories)
    });
  }

}

