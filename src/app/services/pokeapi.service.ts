import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PokeComplete, PokeCV } from '../models/pokemon.model';
import { pokeList } from '../models/pokeApi.model';

@Injectable({
  providedIn: 'root',
})
export class PokeapiService {
  pokeListUrl: string = 'https://pokeapi.co/api/v2/pokemon?';
  pokeTrl: string = 'https://pokeapi.co/api/v2/pokemon-species/';

  constructor(private client: HttpClient) {}

  getRange(offset: number, limit: number): Observable<pokeList> {
    return this.client.get<pokeList>(
      this.pokeListUrl + 'offset=' + offset + '&limit=' + limit
    );
  }

  getFrName(pkName: string): Observable<any> {
    return this.client.get<any>(this.pokeTrl + pkName);
  }

  getProps(url: string): Observable<PokeComplete> {
    return this.client.get<PokeComplete>(url);
  }

  getTypes(url: string): Observable<any> {
    return this.client.get<any>(url);
  }

  async getShortPoke(pkView: any) {
    let poke : PokeCV = {
      engName: pkView.name,
    };

    const frNameSearch = this.getFrName(poke.engName);
    let frNameData = await lastValueFrom(frNameSearch);
    poke.frName = frNameData.names
                          .find((n: { language: { name: string } }) => n.language.name == 'fr').name;

    poke.url = pkView.url;
    const fullPropSearch = this.getProps(pkView.url);
    let fullPropData = await lastValueFrom(fullPropSearch);
    poke.id = fullPropData.id;

    poke.spriteFD = fullPropData.sprites?.front_default;

    return poke;
  }


  async getFullPoke(pokeShort : PokeCV) {
    const fullPropSearch = this.getProps(pokeShort.url ?? "");
    let poke : PokeComplete = await lastValueFrom(fullPropSearch);

    const frNameSearch = this.getFrName(poke.name);
    let frNameData = await lastValueFrom(frNameSearch);
    poke.frName = frNameData.names.find(
      (n: { language: { name: string } }) => n.language.name == 'fr'
    ).name;
    poke.frDescription = frNameData.flavor_text_entries.find(
      (d: { language: { name: string } }) => d.language.name == 'fr'
    ).flavor_text;

    poke.frTypes = [];
    if(poke.types){
      for (let type of poke.types) {
        const typeTrl = this.getTypes(type.type.url);
        let typeTrlData = await lastValueFrom(typeTrl);
        console.log(typeTrlData);
        poke.frTypes.push(
          typeTrlData.names.find(
            (n: { language: { name: string } }) => n.language.name == 'fr'
          ).name
        );
      }
    }

    poke.totalStats = 0;
    for (let stat of poke.stats) {
      poke.totalStats += stat.base_stat;
    }

    return poke;
  }
}
