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

  addMenuToOrderOrCreateOrder(quantity: number, menu: Menu) {
    // console.log("order service");
    // console.table(menu);
    // console.log("la quantité est: " + quantity);

    const customer = this.customerService.getLoggedInCustomer();
    if (!customer) {
      console.error("No customer is logged in");
      return of(null);
    }

    const { token, ...customerWithoutToken } = customer;
    console.log("created customer: ");
    console.table(customerWithoutToken);

    // console.log("liste des commandes du client: ");
    // console.table(customer.commandes);



    //test
    // if(customer.commandes.length <= 0){

    // }

        // Create the Commande object
        const commande: Commande = new Commande();
        commande.commandeNumber = this.generateOrderNumber();
        commande.createdDate = new Date();
        commande.reference = "REF" + new Date().getTime();
        commande.customer = customerWithoutToken;
    
        // Create the CommandLine object and associate it with the Commande
        const commandLine: CommandLine = new CommandLine();
        commandLine.quantity = quantity;
        commandLine.lineTotalPrice = quantity * menu.price;
        commandLine.menu = menu;
        //commandLine.commande = commande; // Set the Commande object
    
        // Add the CommandLine to the Commande
        commande.commandLineList = [commandLine];
    
        console.log("commande détails avant envoi: ");
        console.table(commande);

        //customer.commandes.push(commande);

        console.log("test: ");
        console.table(customer);
        console.log("test 2");
        console.table(customerWithoutToken);

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
    console.error(error);
    return of(errorValue);
  }
}
