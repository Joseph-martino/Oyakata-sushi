import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancel',
  templateUrl: './cancel.component.html',
  styleUrl: './cancel.component.scss'
})
export class CancelComponent {

    constructor(private router: Router){
  
    }

  onGoToHomePage(){
    this.router.navigateByUrl("/");
  }

}
