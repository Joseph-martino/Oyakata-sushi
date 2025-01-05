import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Menu } from '../../models/menu';
import { MenuService } from '../../services/menu.service';
import { CustomerService } from '../../../services/customer.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-menu-details',
  templateUrl: './menu-details.component.html',
  styleUrl: './menu-details.component.scss'
})
export class MenuDetailsComponent implements OnInit{

  menu!: Menu|undefined;
  isLoggedIn = false;
  quantity: number = 0;

  constructor(
    private route: ActivatedRoute, 
    private menuService: MenuService, 
    private router: Router,
    private customerService: CustomerService,
    private orderService: OrderService){}

  ngOnInit(): void {
    this.customerService.isLoggedIn().subscribe(
      (isLoggedIn) => this.isLoggedIn = isLoggedIn
    );

    const menuId: number = +this.route.snapshot.params['id'];
  
    this.menuService.getMenuById(menuId).subscribe(
      menu => this.menu = menu);
  }

  onGoToMenusList(){
    this.router.navigateByUrl('/list-menus');
  }
  
  onIncreaseQuantity(){
    this.quantity++;
    if(this.quantity > 10) {
      this.quantity = 10;
    }
  }

  onDecreaseQuantity(){
    this.quantity--;
    if(this.quantity < 0){
      this.quantity = 0;
    }
  }

  onValidateOrder() {
    if (this.quantity > 0) {
      console.log("commande ok quantité: " + this.quantity);
      if (this.menu) {
        this.orderService.addMenuToOrderOrCreateOrder(this.quantity, this.menu).subscribe({
          next: (response) => {
            console.log('order created successfully', response);
          },
          error: (error) => {
            console.error('Error logging customer', error);
          }
        });
      }
    }
  }
}
