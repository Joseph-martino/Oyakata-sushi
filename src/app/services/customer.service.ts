import { Injectable } from '@angular/core';
import { Address } from '../models/Address';
import { addAriaReferencedId } from '@angular/cdk/a11y';
import { Customer } from '../models/Customer';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { LoginRequest } from '../models/LoginRequest';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  customer!: Customer;
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private datePipe: DatePipe) { }


  createCustomer(formValue: {firstName: string, familyName: string, email: string, password: string, 
    addressLine: string, zipCode: string, city: string}): Observable<Customer> {

      this.customer = new Customer();
      this.customer.firstName = formValue.firstName;
      this.customer.familyName = formValue.familyName;
      this.customer.email = formValue.email;
      this.customer.password = formValue.password;
      const date: Date = new Date();
      const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      this.customer.createdAt = formattedDate;
      
    
      this.customer.addressLine = formValue.addressLine;
      this.customer.zipCode = formValue.zipCode;
      this.customer.city = formValue.city;

      console.log(this.customer);

      return this.http.post<Customer>('http://localhost:8080/core/rest/customer/create', this.customer);

    }

  
    getById(id: number): Observable<Customer>{

      return this.http.get<Customer>(`http://localhost:8080/core/rest/customer/${id}`).pipe(
        tap((customer) => this.logInfo(customer)),
        catchError((error) => this.handleError(error, undefined))
      );
    }

    login(formValue: {email: string, password: string}): Observable<Customer>{
      const loginRequest = new LoginRequest();
      loginRequest.email = formValue.email;
      loginRequest.password = formValue.password;

      return this.http.post<Customer>('http://localhost:8080/core/rest/customer/login', loginRequest).pipe(
        tap((customer) => {
          this.logInfo(customer),
          localStorage.setItem('authToken', customer.token);
          this.loggedIn.next(true);
          console.log("token: " + customer.token);
      }),
        catchError((error) => this.handleError(error, undefined))
      );
    }

    private hasToken(): boolean {
      return !!localStorage.getItem('authToken');
    }

    isLoggedIn(): Observable<boolean> {
      return this.loggedIn.asObservable();
    }

    logout():void{
      console.log("logout service");
      localStorage.removeItem('authToken');
      this.loggedIn.next(false);
      console.log("isLoggedIn: " + this.isLoggedIn);
    }

    private logInfo(response: any){
      console.table(response);
    }
  
    private handleError(error: Error, errorValue: any){
      console.error(error);
      return of(errorValue);
    }
}
