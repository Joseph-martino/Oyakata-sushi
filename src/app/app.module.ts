import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NavComponent } from './nav/nav.component';
import { ListMenuComponent } from './menu/components/list-menu/list-menu.component';
import { BorderCardDirective } from './border-card.directive';
import { MenuModule } from './menu/menu.module';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomepageComponent,
    NavComponent,
    ListMenuComponent,
    BorderCardDirective,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MenuModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
