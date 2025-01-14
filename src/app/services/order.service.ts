import { Injectable } from '@angular/core';
import { Customer } from '../models/Customer';
import { Menu } from '../menu/models/menu';
import { CustomerService } from './customer.service';
import { Commande } from '../models/Commande';
import { CommandeRequest } from '../models/CommandeRequest';
import { CommandLine } from '../models/CommandLine';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private customerService: CustomerService, private http: HttpClient) { }

  getCustomerOrders(customerId: number):Observable<Commande[]> {
    return this.http.get<Commande[]>(`http://localhost:8080/core/rest/commande/totalCustomerCommande/${customerId}`).pipe(
      tap(customerOrdersList => this.logInfo(customerOrdersList)),
      catchError(error => this.handleError(error, []))
    );
  }

  addMenuToOrderOrCreateOrder(quantity: number, menu: Menu): void {

    const customer = this.customerService.getLoggedInCustomer();
    if (!customer) {
      console.error("No customer is logged in");
      return;
    }

    if (quantity <= 0) {
      console.error("Invalid quantity: ", quantity);
      return;
    }
    
    const { token, ...customerWithoutToken } = customer;

    //on va chercher si le customer a déjà créer une commande (ajouter des menus à sa commande, si non on crée la commande, si oui on ajoute à la commande courante)
    if(!customer.currentCommande){
      const currentOrder: Commande = new Commande();
      currentOrder.commandeNumber = this.generateOrderNumber();
      currentOrder.createdDate = new Date();
      currentOrder.reference = "REF" + new Date().getTime();
      currentOrder.customer = customerWithoutToken;
      currentOrder.commandLineList = [];
      customer.currentCommande = currentOrder;
    } 
    //on vérifie ici si une commandeLine est dejà présente dans la commande
    const existingCommandLine = customer.currentCommande?.commandLineList.find(
      (commandLine) => commandLine.menu.id === menu.id);

      //si le menu a déjà été ajouté à la commande courante et qu'on le rajoute à nouveau
      if(existingCommandLine){
        existingCommandLine.quantity += quantity;
      } else {
        // sinon s'il n'y a pas de commandeLine de ce menu dans la commande courante
        const commandeLine = new CommandLine();
        commandeLine.quantity = quantity;
        commandeLine.menu = menu;
        commandeLine.lineTotalPrice = quantity * menu.price;
        customer.currentCommande?.commandLineList.push(commandeLine);
      }
      const totalPrice: number = this.calculateOrderTotalPrice(customer.currentCommande);
      customer.currentCommande.totalPrice = totalPrice;

      console.log("total price: " + totalPrice);

      console.log("Current commande: ");
      console.table(customer.currentCommande);
      console.log("order service localstorage");
      localStorage.setItem("customer", JSON.stringify(customer));
      console.log(localStorage.getItem("customer"));
  }

  calculateOrderTotalPrice(commande: Commande){
    let totalPrice: number = 0;
    for(let i = 0; i<= commande.commandLineList.length -1; i++){
      totalPrice += commande.commandLineList[i].lineTotalPrice;
    }
    return totalPrice;
  }

  defineShppingCosts(orderTotalPrice: number): number{
    let shippingCost = 0;
    if(orderTotalPrice > 100){
      return shippingCost;
    } else {
      shippingCost = 6;
      return shippingCost;
    }
  }

  validateOrder(commande :Commande){
    return this.http.post<Commande>('http://localhost:8080/core/rest/commande/create', commande).pipe(
      tap((response) => this.logInfo(response)),
      catchError((error) => this.handleError(error, undefined))
    );
  }

  private generateOrderNumber(): string {
    return 'ORD-' + Math.floor(Math.random() * 1000000);
  }

  private logInfo(response: any) {
    console.table(response);
  }

  private handleError(error: Error, errorValue: any) {
    console.error("Erreur lors de la récupération des commandes: " + error);
    return of(errorValue);
  }
}
