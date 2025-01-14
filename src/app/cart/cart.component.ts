import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { Customer } from '../models/Customer';
import { OrderService } from '../services/order.service';
import { CommandLine } from '../models/CommandLine';
import { CustomerService } from '../services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  customer!: Customer;
  shippingCost!: number;
  totalOrderPriceWithShippingCost!: number;

  constructor(private orderService: OrderService, 
              private customerService:CustomerService,
              private router:Router){
  }

  ngOnInit(): void {

    const customerJson = localStorage.getItem("customer");
    console.log(customerJson);
    if(customerJson){
      this.customer = JSON.parse(customerJson);
    } 
    if(this.customer.currentCommande){
      this.onGetShippingCost(this.customer.currentCommande.totalPrice);
      this.customer.currentCommande.totalPriceWithDeliveryFee = this.customer.currentCommande.totalPrice + this.shippingCost;
      console.log("ngOnInit total avec frais de port: " + this.customer.currentCommande.totalPriceWithDeliveryFee);
    }
  }

  onGoToMenuPage(menuId: number):void{
    this.router.navigateByUrl(`list-menus/${menuId}`);
  }

  // updateDeliveryFee(): number {
  //   if (this.customer.currentCommande) {
  //     if(this.customer.currentCommande.totalPrice >= 100){
  //       return 0;
  //     }
  //   }
  //   return this.deliveryFee;
  // }

  updateQuantity(commandeLine: CommandLine, updateQuantity: number): void {
    const newQuantity = commandeLine.quantity + updateQuantity;
    
    if (newQuantity < 1) {
      console.warn("La quantité ne peut pas être inférieure à 1.");
      return;
    }
  
    commandeLine.quantity = newQuantity;
  
    // Mise à jour du prix total pour cette ligne
    commandeLine.lineTotalPrice = commandeLine.quantity * commandeLine.menu.price;

    this.calculateOrderTotalPrice();
  
    // Optionnel : mettre à jour le stockage local si nécessaire
    const customer = this.customerService.getLoggedInCustomer();
    if (customer) {
      localStorage.setItem("customer", JSON.stringify(customer));
    }
  }

  calculateOrderTotalPrice():void{
    if(this.customer.currentCommande){
      let orderTotalPrice = 0;
      for(let i = 0; i<= this.customer.currentCommande.commandLineList.length -1; i++){
      orderTotalPrice += this.customer.currentCommande.commandLineList[i].lineTotalPrice;
      }
      this.customer.currentCommande.totalPrice = orderTotalPrice;

      this.shippingCost = this.customer.currentCommande.totalPrice < 100 ? 6 : 0;
      this.customer.currentCommande.totalPriceWithDeliveryFee = this.customer.currentCommande.totalPrice + this.shippingCost;
      console.log("total avec frais de port: " + this.customer.currentCommande.totalPriceWithDeliveryFee);
      localStorage.setItem("customer", JSON.stringify(this.customer));
    }
  }

  deleteCommandeLine(index: number): void {
    if (this.customer && this.customer.currentCommande) {
      this.customer.currentCommande.commandLineList.splice(index, 1);
      this.customer.currentCommande.totalPrice = this.orderService.calculateOrderTotalPrice(this.customer.currentCommande);
      localStorage.setItem("customer", JSON.stringify(this.customer));
      this.customer = { ...this.customer };
    }
  }

  onGetShippingCost(orderTotalPrice: number){
    this.shippingCost = this.orderService.defineShppingCosts(orderTotalPrice);
  }
  
  onConfirmOrder(){
    if(this.customer.currentCommande){
      console.table("commande courante: " + this.customer.currentCommande.totalPrice);
      this.orderService.validateOrder(this.customer.currentCommande).subscribe({
        next: (response) => {
          console.log('order created successfully', response);
          this.customer.currentCommande = undefined;
          localStorage.setItem("customer", JSON.stringify(this.customer));
        },
        error: (error) => {
          console.error('Error logging customer', error);
        }
      }

      );
    }
  }
}
