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
