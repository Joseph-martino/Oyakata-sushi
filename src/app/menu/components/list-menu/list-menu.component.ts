import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { Menu } from '../../models/menu';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Category } from '../../../models/Category';
import { CategoryService } from '../../../services/category.service';

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
  categories!: Category[];
  isSelectedCategory!: string;


  constructor(private menuService: MenuService, private router: Router, private categoryService :CategoryService){
    this.currentPageNumber = 1;
  }
  
  ngOnInit(): void {
    
    this.totalNumberOfMenus$ = this.menuService.getNumberTotalOfMenus();

    this.totalNumberOfPages$ = this.totalNumberOfMenus$.pipe(
      map(numberOfMenus  => Math.ceil(numberOfMenus /this.pageSize))
    );

    this.categoryService.getcategoriesForMenus().subscribe(
      listCategories => this.categories = listCategories
    );

    this.menuService.getMenuListForPage(this.pageNumber, this.pageSize)
    .subscribe(menuList => this.menus = menuList);
      
  }

  onGetCurrentPageMenus(pageNumber: number){
    this.menuService.getMenuListForPage(pageNumber, this.pageSize)
    .subscribe(menuList => this.menus = menuList);
  }

  onSelectByCategory(categoryName: string){
    this.isSelectedCategory = categoryName;
    this.menuService.getMenusListByCategory(categoryName).subscribe(
      listMenus => this.menus = listMenus
    );

    if(categoryName === "Tous les menus"){
      console.log("tous les menus: " + categoryName);
      this.menuService.getMenuListForPage(this.pageNumber, this.pageSize)
    .subscribe(listMenus => this.menus = listMenus);
    }
  }

  onGoToDetailMenu(id: number){
    this.router.navigateByUrl(`list-menus/${id}`);
  }
}
