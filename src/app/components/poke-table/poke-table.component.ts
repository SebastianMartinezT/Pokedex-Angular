import { Component, OnInit, ViewChild } from '@angular/core';
import { PokemonService } from 'src/app/services/pokemon.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { Router } from '@angular/router';


@Component({
  selector: 'app-poke-table',
  templateUrl: './poke-table.component.html',
  styleUrls: ['./poke-table.component.scss']
})
export class PokeTableComponent implements OnInit {

  displayedColumns: string[] = ['position', 'image', 'name','type','evolution'];
  data: any[] = [];
  dataSource = new MatTableDataSource<any>(this.data);


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  pokemons = [];  

  constructor(private pokemonService: PokemonService, private router: Router) { 
    
  }

  ngOnInit(): void {
    this.getPokemons();    
    this.setSort('1','asc');
  }

  getPokemons() {
    let pokemonData; 
    this.pokemonService.getAllPokemons().subscribe(
      resPokemons=>{        
        for (let i = 1; i <= resPokemons.results.length; i++) {
          this.pokemonService.getPokemons(i).subscribe(
            res => {      
              this.pokemonService.getEvolutionsSpecies(i).subscribe(
                resSpecies=>{
                  this.pokemonService.getEvolutions(resSpecies.evolution_chain.url).subscribe(
                    resEvolution=>{
                      let evolutions="";
                      let evoChain = [];
                      let evoData = resEvolution.chain;                                              
                      do {
                        let numberOfEvolutions = evoData.evolves_to.length;  
          
                        evoChain.push({
                          "species_name": evoData .species.name
                        });                        
          
                        if(numberOfEvolutions > 1) {
                          for (let i = 1;i < numberOfEvolutions; i++) { 
                            evoChain.push({
                              "species_name": evoData.evolves_to[i].species.name
                            });                    
                          }
                        }   
                        evoData = evoData.evolves_to[0];                
                      } while (evoData != undefined && evoData.hasOwnProperty('evolves_to'));              
                      for(let e=1;e<evoChain.length;e++){
                        if(evoChain[e].species_name != res.name){
                          evolutions+=evoChain[e].species_name + " | ";
                        }
                      }
                      
                      let Types="";              
                      res.types.forEach (function (type) {
                        Types += type['type']['name'] + " | ";                
                      });
                      
                      pokemonData = {
                        position: i,
                        image: res.sprites.front_default,
                        name: res.name,
                        type: Types,// res.types[0].type.name,
                        evolution: evolutions
                      };                
                      this.data.push(pokemonData);
                      this.dataSource = new MatTableDataSource<any>(this.data);                           
                      this.dataSource.paginator = this.paginator;                       
                      this.dataSource.sort = this.sort;   
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
          );
        }
      }
    );
    
  }

  public setSort(id: string, start?: 'asc' | 'desc') {
    start = start || 'asc';
    const matSort = this.dataSource.sort;
    const toState = 'active';
    const disableClear = false;

    //reset state so that start is the first sort direction that you will see
    matSort.sort({ id: null, start, disableClear });
    matSort.sort({ id, start, disableClear });        
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  getRow(row){
    //console.log(row);
    this.router.navigateByUrl(`/pokeDetail/${row.position}`)
  }

}
