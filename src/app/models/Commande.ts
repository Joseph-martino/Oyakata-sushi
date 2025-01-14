import { CommandLine } from "./CommandLine";
import { Customer } from "./Customer";

export class Commande {

    commandeId!: number;
    commandeNumber!: string;
    createdDate!: Date;
    reference!: string;
    //customer!: Customer;
    customer!: Omit<Customer, 'token'>;
    commandLineList!: CommandLine[];
    status!: string;
    /*test*/
    totalPrice!: number;
    totalPriceWithDeliveryFee!: number;
    
}