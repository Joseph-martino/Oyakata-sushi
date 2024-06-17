import { Component, OnInit } from '@angular/core';
import { Sushi } from '../../models/sushi';
import { SushiService } from '../../service/sushi.service';
import { Category } from '../../../models/Category';
import { CategoryService } from '../../../services/category.service';
import { Observable, catchError, map, throwError, timeout } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-sushis',
  templateUrl: './list-sushis.component.html',
  styleUrl: './list-sushis.component.scss'
})
export class ListSushisComponent implements OnInit{

  sushis!: Sushi[];
  categories!: Category[];
  pageNumber: number = 1;
  pageSize: number = 12;
  isSelectedCategory!: string;
  totalNumberOfSushis$!: Observable<number>;
  totalNumberOfpages$!: Observable<number>;
  currentPageNumber!: number;
  isLoading: boolean = true;

  constructor(private sushiService: SushiService, private categoryService: CategoryService, private router: Router){
    this.currentPageNumber = 1;
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.totalNumberOfSushis$ = this.sushiService.getTotalNumberOfSushis();
    
    this.totalNumberOfpages$ = this.totalNumberOfSushis$.pipe(
      map(totalNumberOfSushis => Math.ceil(totalNumberOfSushis/this.pageSize))
    );

    this.categoryService.getcategoriesForSushis().subscribe(
      listCategories => this.categories = listCategories
    );

    this.sushiService.getSushisListForPage(this.pageNumber, this.pageSize).pipe(
      timeout(7000),
      catchError((error) => {
        this.isLoading = false;
        this.router.navigateByUrl("/404-error")
        return throwError(() => new Error("A problem has occured, please try late"));
      })
    )
    .subscribe(listSushis => {
      this.sushis = listSushis,
      this.isLoading = false;
    });
  }

  onSelectByCategory(categoryName: string){
    this.isSelectedCategory = categoryName;
    this.sushiService.getSushisListByCategory(categoryName).subscribe(
      listSushis => this.sushis = listSushis
    );

    if(categoryName === "tous"){
      console.log("tous: " + categoryName);
      this.sushiService.getSushisListForPage(this.pageNumber, this.pageSize).pipe(
        timeout(7000),
        catchError((error) => {
          this.isLoading = false;
          this.router.navigateByUrl("/404-error")
          return throwError(() => new Error("A problem has occured, please try late"))
        })
      )
    .subscribe(listSushis => this.sushis = listSushis);
    }
  }

  onGetCurrentPageSushi(pageNumber: number){
    this.sushiService.getSushisListForPage(pageNumber, this.pageSize).pipe(
      timeout(7000),
      catchError((error) => {
        this.isLoading = false;
        this.router.navigateByUrl("/404-error")
        return throwError(() => new Error("A problem has occured, please try late"))
      })
    )
    .subscribe(listSushis => this.sushis = listSushis);
    }
}
