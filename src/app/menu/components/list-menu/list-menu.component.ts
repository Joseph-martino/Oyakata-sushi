import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { Menu } from '../../models/menu';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-list-menu',
  templateUrl: './list-menu.component.html',
  styleUrl: './list-menu.component.scss'
})
export class ListMenuComponent implements OnInit{

  menus!: Menu[];
  totalNumberOfMenus$!: Observable<number>;
  totalNumberOfPages$!: Observable<number>;
  currentPageNumber!: number;
  pageNumber: number = 1;
  pageSize: number = 6;


  constructor(private menuService: MenuService, private router: Router){
    this.currentPageNumber = 1;
  }
  
  ngOnInit(): void {
    
    this.totalNumberOfMenus$ = this.menuService.getNumberTotalOfMenus();

    this.totalNumberOfPages$ = this.totalNumberOfMenus$.pipe(
      map(numberOfMenus  => Math.ceil(numberOfMenus /this.pageSize))
    );

    this.menuService.getMenuListForPage(this.pageNumber, this.pageSize)
    .subscribe(menuList => this.menus = menuList);
      
  }

  onGetCurrentPageMenus(pageNumber: number){
    this.menuService.getMenuListForPage(pageNumber, this.pageSize)
    .subscribe(menuList => this.menus = menuList);
  }

  onGoToDetailMenu(id: number){
    this.router.navigateByUrl(`list-menus/${id}`);
  }
}
