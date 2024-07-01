import { Injectable } from '@angular/core';
import { Address } from '../models/Address';
import { addAriaReferencedId } from '@angular/cdk/a11y';
import { Customer } from '../models/Customer';
import { Observable, catchError, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  customer!: Customer;

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

    //test
    getById(id: number): Observable<Customer>{

      return this.http.get<Customer>(`http://localhost:8080/core/rest/customer/${id}`).pipe(
        tap((customer) => this.logInfo(customer)),
        catchError((error) => this.handleError(error, undefined))
      );
    }
    //fin test

    private logInfo(response: any){
      console.table(response);
    }
  
    private handleError(error: Error, errorValue: any){
      console.error(error);
      return of(errorValue);
    }
}
