import { Injectable } from '@angular/core';
import { Menu } from '../models/menu';
import { Observable, catchError, of, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  getMenuById(id: number): Observable<Menu|undefined>{
    return this.http.get<Menu>(`http://localhost:8080/core/rest/menus/${id}`).pipe(
      tap((menu) => this.logInfo(menu)),
      catchError((error) => this.handleError(error, undefined))
    );
  }

  getMenuListForPage(pageNumber: number, pageSize: number): Observable<Menu[]>{
    let params = new HttpParams();
    params = params.set("pageNumber", pageNumber.toString());
    params = params.set("pageSize", pageSize.toString());

    return this.http.get<Menu[]>('http://localhost:8080/core/rest/menus/', { params: params }).pipe(
      tap((menuList) => this.logInfo(menuList)),
      catchError((error) =>  this.handleError(error,[])
      )
    );
  }

  getMenusListByCategory(categoryName: string): Observable<Menu[]>{
    return this.http.get<Menu[]>(`http://localhost:8080/core/rest/menus/category/${categoryName}`).pipe(
      tap((listMenus) => this.logInfo(listMenus)),
      catchError((error) => this.handleError(error, []))
    );
  }

  searchMenuListByName(term: string): Observable<Menu[]>{
    if(term.length <= 1){
      return of([]);
    }
    return this.http.get<Menu>(`http://localhost:8080/core/rest/menus/name/${term}`).pipe(
      tap((menuList) => this.logInfo(menuList)),
      catchError((error) => this.handleError(error, []))
    );
  }

  getNumberTotalOfMenus(): Observable<number>{
    return this.http.get<number>('http://localhost:8080/core/rest/menus/total').pipe(
      tap((totalMenuNumber) => this.logInfo(totalMenuNumber)),
      catchError((error) => this.handleError(error, undefined))
    );
  }

  private logInfo(response: any){
    console.table(response);
  }

  private handleError(error: Error, errorValue: any){
    console.error(error);
    return of(errorValue);
  }

}
