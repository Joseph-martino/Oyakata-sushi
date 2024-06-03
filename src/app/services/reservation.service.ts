import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Reservation } from '../models/Reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  reservation!: Reservation;

  constructor(private http: HttpClient) { }


  createReservation(formValue: {firstName: string, familyName: string, email: string, numberOfPersons: number, reservationDateString: string} ){

    this.reservation = new Reservation();

    console.log( "format:" + formValue.reservationDateString);

    this.reservation.firstName = formValue.firstName;
    this.reservation.familyName = formValue.familyName;
    this.reservation.reservationNumber = "1";
    this.reservation.email = formValue.email;
    this.reservation.numberOfPersons = formValue.numberOfPersons;
        // Vérification de la validité de la chaîne de caractères de date
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateRegex.test(formValue.reservationDateString)) {
            // Conversion de la chaîne de caractères en objet Date
            this.reservation.reservationDate = new Date(formValue.reservationDateString);
        } else {
            console.error("Invalid date format: ", formValue.reservationDateString);
            // Gérer l'erreur de format de date ici
        }

    console.log(this.reservation);

    return this.http.post<Reservation>('http://localhost:8080/core/rest/reservation/create', this.reservation);

  }
}
