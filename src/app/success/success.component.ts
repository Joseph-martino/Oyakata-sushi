import { Component, OnInit } from '@angular/core';
import { Customer } from '../models/Customer';
import { CustomerService } from '../services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export class SuccessComponent implements OnInit{

  customer!: Customer|null;

  constructor(private customerService: CustomerService, private router: Router){

  }

  ngOnInit(): void {
      this.customer = this.customerService.getLoggedInCustomer();
      if(this.customer?.currentCommande){
        this.customer.currentCommande = undefined;
      }
      localStorage.setItem("customer", JSON.stringify(this.customer));
  }

  onGoToHomePage(){
    this.router.navigateByUrl("/");
  }
}
