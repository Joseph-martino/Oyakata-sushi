import { Component, Input } from '@angular/core';
import { Reservation } from '../models/Reservation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation-success-message',
  templateUrl: './reservation-success-message.component.html',
  styleUrl: './reservation-success-message.component.scss'
})
export class ReservationSuccessMessageComponent {

  constructor(private router: Router){

  }

  goToHomePage(){
    this.router.navigateByUrl('/');
  }

}
