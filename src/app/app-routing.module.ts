import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ListMenuComponent } from './menu/components/list-menu/list-menu.component';
import { MenuDetailsComponent } from './menu/components/menu-details/menu-details.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: "", component: HomepageComponent},
  { path: "list-menus/:id", component: MenuDetailsComponent },
  { path: "list-menus", component: ListMenuComponent },
  { path: "**", component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
