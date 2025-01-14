import { Component, OnInit } from '@angular/core';
import { Customer } from '../models/Customer';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { Commande } from '../models/Commande';
import { Observable, tap } from 'rxjs';
import { Reservation } from '../models/Reservation';
import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{

  customer: Customer|null = null;
  customerOrders$!: Observable<Commande[]>;
  customerReservations$!: Observable<Reservation[]>;
  customerhasOrder!: boolean;
  customerHasReservations!: boolean;



  constructor(private router: Router, 
              private orderService: OrderService,
              private reservationService: ReservationService){

  }
  

  ngOnInit(): void {
      
    const customerJson = localStorage.getItem('customer');
    console.log("profile cutomerJson" + customerJson);
    if(customerJson){
      this.customer = JSON.parse(customerJson) as Customer;
    };

    if(this.customer){
      this.customerOrders$ = this.orderService.getCustomerOrders(this.customer.customerId);
      this.customerReservations$ = this.reservationService.getCustomerReservations(this.customer.customerId);

      this.orderService.getCustomerOrders(this.customer.customerId).subscribe(
        orders => {
          if(orders.length > 0){
            this.customerhasOrder = true;
            console.log(this.customerhasOrder);
          } else {
            this.customerhasOrder = false;
            console.log(this.customerhasOrder);
          }
        }
      );

      this.reservationService.getCustomerReservations(this.customer.customerId).subscribe(
        reservations => {
          if(reservations.length > 0){
            this.customerHasReservations = true;
            console.log(this.customerHasReservations);
          } else {
            this.customerHasReservations = false;
            console.log(this.customerHasReservations);
          }
        }
      );


    }


    console.table(this.customer);
  }

  onGoToHomePage(){
    this.router.navigateByUrl("/");
  }



}
