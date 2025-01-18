import { Injectable } from '@angular/core';
import { HeaderInformations } from '../models/HeaderInformations';

@Injectable({
  providedIn: 'root'
})
export class DisplayHeaderService {
  

  private headerInformations: HeaderInformations[] = [

    

    {
      title: "Oyaka sushi",
      description: "Lorem ipsum dolor sit amet consectetur. Feugiat aenean vitae eleifend rhoncus viverra lobortis varius.",
      banner: "assets/images/banners/homepage-banner.png",
      path: "/"
    },

    {
      title: "Nos menus",
      description: "Lorem ipsum dolor sit amet consectetur. Feugiat aenean vitae eleifend rhoncus viverra lobortis varius.",
      banner: "assets/images/banners/list-menus-banner.png",
      path: "/list-menus"
    },

    {
      title: "Sushi à l'unité",
      description: "Lorem ipsum dolor sit amet consectetur. Feugiat aenean vitae eleifend rhoncus viverra lobortis varius.",
      banner: "assets/images/banners/list-sushis-banner.png",
      path: "/list-sushis"
    },


    {
      title: "Détail menu",
      description: "Lorem ipsum dolor sit amet consectetur. Feugiat aenean vitae eleifend rhoncus viverra lobortis varius.",
      banner: "assets/images/banners/menu-detail-banner.png", 
      path: "/list-menus/"
    },

    {
      title: "Réservation",
      description: "Lorem ipsum dolor sit amet consectetur. Feugiat aenean vitae eleifend rhoncus viverra lobortis varius.",
      banner: "assets/images/banners/reservation-banner.png",
      path: "/reservation"
    },

    {
      title: "La page n'existe pas",
      description: "",
      banner: "assets/images/banners/page-not-found-banner.png",
      path: "**"
    },

    {
      title: "Espace Admin",
      description: "",
      banner: "assets/images/banners/admin-login-banner.png",
      path: "/admin-login"
    },

    {
      title: "Creer compte",
      description: "",
      banner: "assets/images/banners/sign-in-banner.png",
      path: "/create-customer"
    },

    {
      title: "Connexion",
      description: "",
      banner: "assets/images/banners/login-banner.png",
      path: "/login"
    },

    {
      title: "Mon profil",
      description: "",
      banner: "assets/images/banners/profile-banner.png",
      path: "/profile"
    },

    {
      title: "Mon panier",
      description: "",
      banner: "assets/images/banners/cart-banner.png",
      path: "/cart"
    },

    {
      title: "Confirmer vos informations",
      description: "",
      banner: "assets/images/banners/payment-banner.png",
      path: "/payment"
    }
  ];

  getHeaderInformationsByPath(path: string, routeId?: string){
    if(routeId){
      let headerInformationWithRouteid: HeaderInformations|undefined = this.headerInformations.find(element => element.title == 'Détail menu');
      return headerInformationWithRouteid;
    }
    return this.headerInformations.find(element => element.path == path);
  }
}
