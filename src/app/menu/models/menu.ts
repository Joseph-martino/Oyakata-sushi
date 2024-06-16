import { Category } from "../../models/Category";

export class Menu {

    id!: number;
    name!: string;
    content!: string;
    price!: number;
    picture!: string;
    category!: Category;
}