import { CommandLine } from "./CommandLine";
import { Customer } from "./Customer";

export interface CommandeRequest {
    commandeNumber: string;
    createdDate: Date;
    reference: string;
    customer: Omit<Customer, 'token'>;
    commandLineList: CommandLine[];
}
