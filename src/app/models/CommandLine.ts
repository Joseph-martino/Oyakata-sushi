import { Menu } from "../menu/models/menu";
import { Commande } from "./Commande";

export class CommandLine {

    id!: number;
    quantity!: number;
    lineTotalPrice!: number;
    menu!: Menu;
    //commande!: Commande;
}