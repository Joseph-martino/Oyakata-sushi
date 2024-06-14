import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { Category } from '../models/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getcategories(): Observable<Category[]> {
    return this.http.get<Category[]>('http://localhost:8080/core/rest/category/').pipe(
      tap((categoriesList) => this.logInfo(categoriesList)),
      catchError((error) => this.handleError(error, []))
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`http://localhost:8080/core/rest/category/${id}`).pipe(
      tap((category) => this.logInfo(category)),
      catchError((error) => this.handleError(error, undefined))
    );
  }

  private logInfo(response: any){
    console.table(response);
  }

  private handleError(error: Error, errorValue:any){
    console.error(error);
    return of(errorValue);
  }
}
