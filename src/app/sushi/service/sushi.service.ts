import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, of, tap } from 'rxjs';
import { Sushi } from '../models/sushi';
import { Category } from '../../models/Category';

@Injectable({
  providedIn: 'root'
})
export class SushiService {

  constructor(private http: HttpClient) { }

  getSushisListForPage(pageNumber: number, pageSize: number): Observable<Sushi[]>{
    let params = new HttpParams();
    params = params.set("pageNumber", pageNumber.toString());
    params = params.set("pageSize", pageSize.toString());

    return this.http.get<Sushi[]>('http://localhost:8080/core/rest/sushis/', { params: params }).pipe(
      tap((listSushi) => this.logInfo(listSushi)),
      catchError((error) => this.logError(error, []))
    );
  }

  getSushisListByCategory(categoryName: string): Observable<Sushi[]>{
    return this.http.get<Sushi[]>(`http://localhost:8080/core/rest/sushis/category/${categoryName}`).pipe(
      tap((listSushi) => this.logInfo(listSushi)),
      catchError((error) => this.logError(error, []))
    );
  }

  getTotalNumberOfSushis(): Observable<number>{
    return this.http.get<number>('http://localhost:8080/core/rest/sushis/total').pipe(
      tap((totalNumber) => this.logInfo(totalNumber)),
      catchError((error) => this.logError(error, undefined))
    );
  }

  searchSushisListByTerm(term: string){
    console.log("service sushi by term");
    return this.http.get<Sushi[]>(`http://localhost:8080/core/rest/sushis/name/${term}`).pipe(
      tap((listSushis) => this.logInfo(listSushis)),
      catchError((error) => this.logError(error, []))
    );
  }

  private logInfo(response: any){
    console.table(response);
  }

  private logError(error: Error, errorValue: any){
    console.error(error);
    return of(errorValue);
  }
}
