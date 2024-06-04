import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation } from '../models/Reservation';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  reservation!: Reservation;
  reservationNumber!: number;

  constructor(private http: HttpClient) { }


  createReservation(formValue: {firstName: string, familyName: string, email: string, numberOfPersons: number, reservationDateString: string}): Observable<Reservation> {
    return this.getNumberTotalOfReservations().pipe(
        switchMap(reservationNumber => {
            this.reservationNumber = reservationNumber +1;
            console.log(this.reservationNumber);

            this.reservation = new Reservation();
            this.reservation.firstName = formValue.firstName;
            this.reservation.familyName = formValue.familyName;
            this.reservation.reservationNumber = `N°${this.reservationNumber.toString()}`;
            this.reservation.email = formValue.email;
            this.reservation.numberOfPersons = formValue.numberOfPersons;

            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (dateRegex.test(formValue.reservationDateString)) {
                this.reservation.reservationDate = new Date(formValue.reservationDateString);
            } else {
                console.error("Invalid date format: ", formValue.reservationDateString);
            }

            console.log(this.reservation);

            return this.http.post<Reservation>('http://localhost:8080/core/rest/reservation/create', this.reservation);
        })
    );
}


  getNumberTotalOfReservations(): Observable<number>{
    return this.http.get<number>('http://localhost:8080/core/rest/reservation/total').pipe(
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
