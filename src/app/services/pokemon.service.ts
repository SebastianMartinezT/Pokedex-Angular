import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  //Obtiene pokemon
  getPokemons(index){
    return this.http.get<any>(`${this.baseUrl}/pokemon/${index}`);
  }

  getEvolutions(url){
    return this.http.get<any>(`${url}`);
  }

  getEvolutionsSpecies(index){
    return this.http.get<any>(`${this.baseUrl}/pokemon-species/${index}`);
  }

  getAllPokemons(){
    return this.http.get<any>(`${this.baseUrl}/pokemon?limit=2000&offset=200`);    
  }
  
}
