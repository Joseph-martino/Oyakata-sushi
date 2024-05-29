import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { Menu } from '../../models/menu';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-list-menu',
  templateUrl: './list-menu.component.html',
  styleUrl: './list-menu.component.scss'
})
export class ListMenuComponent implements OnInit{

  menus!: Menu[];

  constructor(private menuService: MenuService, private router: Router){

  }

  ngOnInit(): void {
    this.menuService.getMenuList()
    .subscribe(menuList => this.menus = menuList);
      
  }

  onGoToDetailMenu(id: number){
    this.router.navigateByUrl(`list-menus/${id}`);
  }
}
