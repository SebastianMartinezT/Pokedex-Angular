import { Component, OnInit } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-poke-detail',
  templateUrl: './poke-detail.component.html',
  styleUrls: ['./poke-detail.component.scss']
})
export class PokeDetailComponent implements OnInit {

  pokemon: any = '';
  pokemonImg = '';
  pokemonType = '';  
  pokemonEvolution:any = [];

  constructor(private activatedRouter: ActivatedRoute,
    private pokemonService: PokemonService) {

    this.activatedRouter.params.subscribe(
      params => {
        this.getPokemon(params['id']);
      }
    )
  }

  ngOnInit(): void {
  }

  getPokemon(id) {
    let pokemonData; 
    this.pokemonService.getPokemons(id).subscribe(
      res => {
        this.pokemonService.getEvolutionsSpecies(id).subscribe(
          resSpecies=>{
            this.pokemonService.getEvolutions(resSpecies.evolution_chain.url).subscribe(
              resEvolution=>{
                let evolutions="";
                let evoChain = [];
                let evoData = resEvolution.chain;                                                            
                do {                  
                  let urlE=evoData .species.url;
                  urlE=urlE.replace('pokemon-species', 'pokemon-form');                
                  evoChain.push({
                    "species_name": evoData .species.name,
                    "species_url":urlE
                  });                                                
                  evoData = evoData.evolves_to[0];                
                } while (evoData != undefined && evoData.hasOwnProperty('evolves_to'));     
                console.log(evoData);
                for(let e=1;e<evoChain.length;e++){
                  if(evoChain[e].species_name != res.name){
                    this.pokemonService.getEvolutions(evoChain[e].species_url).subscribe(
                      resFormImage=>{
                        console.log(resFormImage);
                        let Types="";                
                        resFormImage.types.forEach (function (type) {
                          Types += type['type']['name'] + " | ";                
                        });                        
                        pokemonData = {                  
                          name: resFormImage.name,
                          image: resFormImage.sprites.front_default,
                          type: Types                          
                        };                          
                        this.pokemonEvolution.push(pokemonData);
                      }
                    ); 
                    evolutions+=evoChain[e].species_name + " | ";
                  }
                }                
                let Types="";                
                res.types.forEach (function (type) {
                  Types += type['type']['name'] + " | ";                
                });
        
                this.pokemon = res;
                this.pokemonImg = this.pokemon.sprites.front_default;
                this.pokemonType = Types;                           
              },
              error=>{

              }
            )
          }
        );
                                     
      },
      err => {
        console.log(err);
      }
    )
  }

}
