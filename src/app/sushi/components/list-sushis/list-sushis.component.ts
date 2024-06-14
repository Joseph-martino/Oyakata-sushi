import { Component, OnInit } from '@angular/core';
import { Sushi } from '../../models/sushi';
import { SushiService } from '../../service/sushi.service';
import { Category } from '../../../models/Category';
import { CategoryService } from '../../../services/category.service';
import { Observable, map } from 'rxjs';

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

  constructor(private sushiService: SushiService, private categoryService: CategoryService){
    this.currentPageNumber = 1;
  }

  ngOnInit(): void {

    this.totalNumberOfSushis$ = this.sushiService.getTotalNumberOfSushis();
    
    this.totalNumberOfpages$ = this.totalNumberOfSushis$.pipe(
      map(totalNumberOfSushis => Math.ceil(totalNumberOfSushis/this.pageSize))
    );

    this.categoryService.getcategories().subscribe(
      listCategories => this.categories = listCategories
    );

    this.sushiService.getSushisListForPage(this.pageNumber, this.pageSize)
    .subscribe(listSushis => this.sushis = listSushis);

    console.log(this.sushis);
  }

  onSelectByCategory(categoryName: string){
    this.isSelectedCategory = categoryName;
    this.sushiService.getSushisListByCategory(categoryName).subscribe(
      listSushis => this.sushis = listSushis
    );

    if(categoryName === "tous"){
      console.log("tous: " + categoryName);
      this.sushiService.getSushisListForPage(this.pageNumber, this.pageSize)
    .subscribe(listSushis => this.sushis = listSushis);
    }
  }

  onGetCurrentPageSushi(pageNumber: number){
    this.sushiService.getSushisListForPage(pageNumber, this.pageSize)
    .subscribe(listSushis => this.sushis = listSushis);
    }
}
