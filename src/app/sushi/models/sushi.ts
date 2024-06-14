import { Category } from "../../models/Category";

export class Sushi {
    id!: number;
    name!: string;
    numberOfPiece!: number;
    price!: number;
    picture!: string;
    category!: Category;

}