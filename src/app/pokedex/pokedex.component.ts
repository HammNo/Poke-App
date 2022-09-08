import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { pokeList } from '../models/pokeApi.model';
import { PokeCV } from '../models/pokemon.model';
import { PokeapiService } from '../services/pokeapi.service';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        })
      ),
      transition('void => *', animate(500)),
    ]),
  ],
})
export class PokedexComponent implements OnInit {
  offset: number = 0;
  limit: number = 20;
  pokeList: PokeCV[] = [];
  displayPoke: boolean = false;
  pokeToSend!: PokeCV;

  constructor(private service: PokeapiService) {}

  ngOnInit(): void {
    this.printRange();
  }

  toggleShowPoke(display: boolean, pokeShort?: PokeCV) {
    this.displayPoke = display;
    if(pokeShort) this.pokeToSend = pokeShort;
  }

  printRange() {
    this.service.getRange(this.offset, this.limit).subscribe({
      next: (data: pokeList) => {
        this.buildPokeList(data);
      },
      error: (error) => console.log(error),
    });
  }

  async buildPokeList(list: any) {
    for (let pk of list.results) {
      this.pokeList.push(await this.service.getShortPoke(pk));
    }
  }

  moveList(next: boolean) {
    this.pokeList = [];
    if (next) this.offset += this.limit;
    else this.offset -= this.limit;
    this.printRange();
  }

}
