import { Injectable } from '@angular/core';
import { Menu } from '../models/menu';
import { Observable, catchError, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  getMenuList(): Observable<Menu[]>{
    return this.http.get<Menu[]>('http://localhost:8080/core/rest/menus/').pipe(
      tap((menuList) => this.logInfo(menuList)),
      catchError((error) =>  this.handleError(error,[])
      )
    )
  }

  private logInfo(response: any){
    console.table(response);
  }

  private handleError(error: Error, errorValue: any){
    console.error(error);
    return of(errorValue);
  }
}
