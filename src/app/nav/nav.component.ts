import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements OnInit{

  isLoggedIn = false;

  constructor(private router: Router, private customerService: CustomerService){

  }

  ngOnInit(): void {
    this.customerService.isLoggedIn().subscribe(
      (isLoggedIn) => this.isLoggedIn = isLoggedIn
    );  
  }

  onGoToHomePage(){
    this.router.navigateByUrl('/');
  }

  onGoToMenuPage(){
    this.router.navigateByUrl('list-menus');
  }

  onGoToReservationPage(){
    this.router.navigateByUrl('reservation');
  }

  onGoToSushiListPage(){
    this.router.navigateByUrl('list-sushis');
  }

  onGoToLogInPage(){
    this.router.navigateByUrl('login');
  }

  logout(){
    console.log("nav logout");
    console.log("isLoggedIn: " + this.isLoggedIn);
    this.customerService.logout();
    console.log("isLoggedIn: " + this.isLoggedIn);
  }
}
