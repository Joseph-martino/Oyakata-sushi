import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Customer } from '../models/Customer';
import { CustomerService } from '../services/customer.service';
import { OrderService } from '../services/order.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit{

  stripe: any;
  stripePromise: Promise<any>;
  customer!:Customer|null;
  currentOrderTotalPrice!: number;
  customerInformationsForm!: FormGroup;

  constructor(private http: HttpClient,
              private customerService: CustomerService, 
              private orderService: OrderService,
              private formBuilder: FormBuilder) {
    // Charge Stripe.js
    this.stripePromise = loadStripe('pk_test_51Qh68zJp8TOkLoL4GYsoLLHOGj5Y2nxAiejCZP96hnlIsnLiAh1tAwDN8FdZaj4Jyhs2BLBYnah5QG3YdzFnW9yD00AH4xmlO5');
  }

  ngOnInit(): void {
      this.customer = this.customerService.getLoggedInCustomer();
      console.log("payment: " + localStorage.getItem("customer"));
      if(this.customer?.currentCommande){
        console.log("prix total de la commande: " + this.customer.currentCommande.totalPriceWithDeliveryFee);
        this.currentOrderTotalPrice = this.customer.currentCommande.totalPriceWithDeliveryFee * 100;
      }
      console.log("code postal: " + this.customer?.zipCode);
      this.customerInformationsForm = this.formBuilder.group({
        email: [this.customer?.email],
        address: [this.customer?.addressLine],
        city: [this.customer?.city],
        zipCode: [this.customer?.zipCode]
      })
  }

  confirmOrder(){
    if(this.customer){
      if(this.customer.currentCommande){
        console.table("commande courante: " + this.customer.currentCommande.totalPrice);
        this.orderService.validateOrder(this.customer.currentCommande).subscribe({
          next: (response) => {
            console.log('order created successfully', response);
            if(this.customer){
              this.customer.currentCommande = undefined;
            }
            localStorage.setItem("customer", JSON.stringify(this.customer));
            console.log("customer apres confirm order: " + localStorage.getItem("customer"));
          },
          error: (error) => {
            console.error('Erreur lors de la création de la commande :', error);
            console.error('Données envoyées :', this.customer?.currentCommande);
          },
          complete: () => {
            console.log("Validation de la commande terminée.");
          }
        });
      }
    }
  }

  async handlePayment() {
    const stripe = await this.stripePromise;

    if (!this.customer || !this.customer.currentCommande) {
      console.error("Client ou commande non disponible pour le paiement.");
      return;
  }

    const orderPayload = {
      //commandeNumber: this.customer?.currentCommande?.commandeNumber,
      //createdDate: this.customer.currentCommande.createdDate,
      //reference: this.customer.currentCommande.reference,
      customerId: this.customer.customerId,
      commandeLines: this.customer?.currentCommande?.commandLineList.map(commandeline =>({
        menu: commandeline.menu,
        quantity: commandeline.quantity,
        lineTotalPrice: commandeline.lineTotalPrice * 100
      })),
      totalPrice: this.customer?.currentCommande?.totalPrice * 100,
      totalPriceWithDeliveryFee: this.customer?.currentCommande?.totalPriceWithDeliveryFee * 100
    }
  

    // Appel API backend pour créer une session de paiement
    this.http.post<any>('http://localhost:8080/core/rest/payment/create-checkout-session', /*{ amount: this.currentOrderTotalPrice }*/ orderPayload)
    .subscribe({
      next: (response) => {
        // Redirige vers Stripe Checkout avec l'ID de session
        stripe.redirectToCheckout({ sessionId: response.sessionId })
          .then((result: any) => {
            if (result.error) {
              console.error('Erreur lors de la redirection vers Stripe Checkout:', result.error);
            } else {
              console.log("handle paiement avant insertion dans labase de données")
              // Confirmation de la commande après le succès du paiement
              this.confirmOrder();
            }
          });
      },
      error: (error) => {
        console.error('Erreur lors de la création de la session de paiement:', error);
      }
    });
  }
}
