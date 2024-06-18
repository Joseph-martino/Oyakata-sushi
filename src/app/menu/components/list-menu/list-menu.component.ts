import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { Menu } from '../../models/menu';
import { Router } from '@angular/router';
import { Observable, catchError, map, throwError, timeout } from 'rxjs';
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
  isLoading:boolean = true;


  constructor(private menuService: MenuService, private router: Router, private categoryService :CategoryService){
    this.currentPageNumber = 1;
  }
  
  ngOnInit(): void {
    this.isLoading = true;
    
    this.totalNumberOfMenus$ = this.menuService.getNumberTotalOfMenus();

    this.totalNumberOfPages$ = this.totalNumberOfMenus$.pipe(
      map(numberOfMenus  => Math.ceil(numberOfMenus /this.pageSize))
    );

    this.categoryService.getcategoriesForMenus().subscribe(
      listCategories => this.categories = listCategories
    );

    this.menuService.getMenuListForPage(this.pageNumber, this.pageSize).pipe(
      timeout(9000),
      catchError((error) => {
        this.isLoading = false,
        this.router.navigateByUrl("/404-error")
        return throwError(() => new Error("A problem has occured, please try late"))
      })
    )
    .subscribe(menuList => {this.menus = menuList,
      this.isLoading = false;
      }
    ); 
  }

  onGetCurrentPageMenus(pageNumber: number){
    this.menuService.getMenuListForPage(pageNumber, this.pageSize).pipe(
      timeout(9000),
      catchError((error) => {
        this.isLoading = false,
        this.router.navigateByUrl("/404-error")
        return throwError(() => new Error("A problem has occured, please try late"))
      })
    )
    .subscribe(menuList => this.menus = menuList);
  }

  onSelectByCategory(categoryName: string){
    this.isSelectedCategory = categoryName;
    this.menuService.getMenusListByCategory(categoryName).subscribe(
      listMenus => this.menus = listMenus
    );

    if(categoryName === "Tous les menus"){
      this.menuService.getMenuListForPage(this.pageNumber, this.pageSize).pipe(
        timeout(9000),
        catchError((error) => {
          this.isLoading = false,
          this.router.navigateByUrl("/404-error")
          return throwError(() => new Error("A problem has occured, please try late"))
        })
      )
    .subscribe(listMenus => this.menus = listMenus);
    }
  }

  onGoToDetailMenu(id: number){
    this.router.navigateByUrl(`list-menus/${id}`);
  }
}
