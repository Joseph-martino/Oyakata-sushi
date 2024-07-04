import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/Customer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.scss'
})
export class CreateCustomerComponent implements OnInit{

  createForm!: FormGroup;
  customer!: Customer;
  hidePassword: boolean = true;
  hideConfirmPassword: boolean = true;
  @ViewChild('passwordInput') passwordInput!: ElementRef;
  @ViewChild('confirmationPasswordInput') confirmationPasswordInput!: ElementRef;
  zipCodeRegex!: RegExp;

  constructor(private formBuilder: FormBuilder, private customerService: CustomerService, private router: Router){

  }

  ngOnInit(): void {
    this.zipCodeRegex = /^\d{5}$/

    this.createForm = this.formBuilder.group({
      firstName: [null, Validators.required],
      familyName: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      passwordConfirmation: [null, Validators.required],
      addressLine: [null, Validators.required],
      zipCode: [null, [Validators.required, Validators.pattern(this.zipCodeRegex)]],
      city: [null, Validators.required]
    })
  }

  togglePasswordVisibility(input: string):void {
    if(input === 'password'){
      this.hidePassword = !this.hidePassword;
      const inputType = this.hidePassword ? 'password' : 'text';
      this.passwordInput.nativeElement.type = inputType;
    } else if(input === 'confirmPassword'){
      this.hideConfirmPassword = !this.hideConfirmPassword;
      const inputType = this.hideConfirmPassword ? 'password' : 'text';
      this.confirmationPasswordInput.nativeElement.type = inputType;
    }
  }

  isFieldInvalid(formFieldName: string){
    const field = this.createForm.get(formFieldName);
    return (field?.invalid && (field?.dirty || field?.touched)) ?? false;
  }

  isPasswordConfirmationCorrect(){
    const passwordFieldValue = this.createForm.get('password')?.value;
    const passwordConfirmationFieldValue = this.createForm.get('passwordConfirmation')?.value;
    return passwordFieldValue === passwordConfirmationFieldValue ? true : false;
  }

  onGoToLoginInPage(){
    this.router.navigateByUrl('login');
  }

  onSubmitForm():void{
    if(this.createForm.valid){
      this.customerService.createCustomer(this.createForm.value).subscribe({
        next: (response) => {
          console.log('Customer created successfully', response);
          // Stocker le JWT dans le localStorage après la création du compte
          // localStorage.setItem('accessToken', response.token);
          // console.log("response: " + response.token);
          // console.log("localstorage: " + localStorage.getItem);
          this.router.navigateByUrl("");
  
        },
        error: (error) => {
          console.error('Error creating customer', error);
        }
      });  
    }
  }
}
