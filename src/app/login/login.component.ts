import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup;
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  hidePassword: boolean = true;

  constructor(private formBuilder: FormBuilder, private router: Router, private customerService: CustomerService){

  }

  ngOnInit(): void {
      this.loginForm = this.formBuilder.group({
        email: [null, Validators.required],
        password: [null, Validators.required]
      });
  }


  togglePasswordVisibility(){
    this.hidePassword = !this.hidePassword;
    const inputType = this.hidePassword ? 'password' : 'text';
    this.passwordInput.nativeElement.type = inputType;
  }

  onGoToSignInPage(){
    this.router.navigateByUrl('create-customer');
  }


  onSubmitForm():void{
    if(this.loginForm.valid){
      //console.log("login test");
      this.customerService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Customer logged successfully', response);
          // Stocker le JWT dans le localStorage après la création du compte
          // localStorage.setItem('accessToken', response.token);
          // console.log("response: " + response.token);
          // console.log("localstorage: " + localStorage.getItem);
          this.router.navigateByUrl("");
  
        },
        error: (error) => {
          console.error('Error logging customer', error);
        }
      })
    }
  }



}
