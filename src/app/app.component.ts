import { Component } from '@angular/core';
import { DisplayHeaderService } from './services/display-header.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderInformations } from './models/HeaderInformations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  currentHeaderInformation!: HeaderInformations|undefined;

  constructor(private displayHeaderService: DisplayHeaderService, 
    private router: Router){
      router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(event => 
      {
        const currentRoute = (event as NavigationEnd).url;
        this.currentHeaderInformation = displayHeaderService.getHeaderInformationsByPath(currentRoute);
      });
  }
  
}
