import { Commande } from "./Commande";
import { Reservation } from "./Reservation";

export class Customer {

    customerId!: number;
    firstName!: string;
    familyName!: string;
    email!: string;
    password!: string;
    addressLine!: string;
    zipCode!: string;
    city!: string;
    createdAt!: string|null;
    token!: string;
    reservations!: Reservation[];
    commandes!: Commande[];
    currentCommande?: Commande /*| null = null*/;
}