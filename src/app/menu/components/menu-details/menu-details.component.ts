import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Menu } from '../../models/menu';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-menu-details',
  templateUrl: './menu-details.component.html',
  styleUrl: './menu-details.component.scss'
})
export class MenuDetailsComponent implements OnInit{

  menu!: Menu|undefined;

  constructor(
    private route: ActivatedRoute, 
    private menuService: MenuService, 
    private router: Router){}

  ngOnInit(): void {
    const menuId: number = +this.route.snapshot.params['id'];
  
    this.menuService.getMenuById(menuId).subscribe(
      menu => this.menu = menu);
  }

  onGoToMenusList(){
    this.router.navigateByUrl('/list-menus');
  }
}
