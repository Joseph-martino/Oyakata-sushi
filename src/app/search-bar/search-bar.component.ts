import { Component, OnInit } from '@angular/core';
import { Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Menu } from '../menu/models/menu';
import { MenuService } from '../menu/services/menu.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent implements OnInit{


  searchTerms = new Subject<string>; // ==>  { ..."a"..."ab"..."abv"..."ab"..."abc"......} flux tapé par l'utilisateur
  menu$!: Observable<Menu[]>;

  constructor(private menuService: MenuService, private router: Router){

  }

  ngOnInit(): void {

    // recuperer les valeurs de l'input qui sont emises par le subject ==> [..."a"..."ab".."abv"."ab"..."abc"] et les mettre dans l'observable menu$
    this.menu$ = this.searchTerms.pipe(
      // ==> 1er filtrage: récupérer les emissions qui sont emises à plus de 300ms d'intervale, pas plus
      //==> [..."a"..."ab".."abv"."ab"..."abc"]
      debounceTime(300),
      //[..."a"..."ab"..."ab"..."abc"]
      //faire une emission que si la valeur de l'emission est différente de la précédente, si c'est la même on le la prend pas
      distinctUntilChanged(),
      //==> [..."a"..."ab"..."abc"]
      //faire la recherche avec le terme reçu, pour cela on utilise une methode du service qui demandera ua backend de faire un getMenuByName / term
      //On ne veut garder que la dernière emission, si une émission est passée et qu'une autre arrive, on ne veut faire la recherche qu'avec la dernière (on annule donc
      //précedente)
      //[..."abc"]
      //pour cela, on utiliise l'opérateur SwitchMap
      switchMap(term => this.menuService.searchMenuListByName(term))
    )
      
    //chercher menu par terme passé dans l'input: 
  }

  onSearch(term: string){
    this.searchTerms.next(term);
  }

  onGoToMenu(menu: Menu){
    this.router.navigateByUrl(`list-menus/${menu.id}`)
  }

}
