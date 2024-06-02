import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {

  @Input() totalNumberOfPages!: number|null;
  @Input() currentPageNumber!: number|null;
  @Output() selectedPage = new EventEmitter<number>;
  

  onGoToPage(pageNumber: number){
    this.selectedPage.emit(pageNumber);
  }

  createLeftAndRightSidePagesNumberOfCurrentPageNumber(){

    const pageNumbers: number[] = [];
    const sideSize: number = 2;
    if(this.currentPageNumber != null && this.totalNumberOfPages != null){
      const leftNumber = Math.max(1, this.currentPageNumber - sideSize);
      const rightNumber = Math.min(this.totalNumberOfPages, this.currentPageNumber + sideSize);


      for(let i = leftNumber; i <= rightNumber; i++){
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  }
}
