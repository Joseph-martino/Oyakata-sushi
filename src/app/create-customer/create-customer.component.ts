import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/Customer';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrl: './create-customer.component.scss'
})
export class CreateCustomerComponent implements OnInit{

  createForm!: FormGroup;
  customer!: Customer;

  constructor(private formBuilder: FormBuilder, private customerService: CustomerService){

  }

  ngOnInit(): void {
      this.createForm = this.formBuilder.group({
        firstName: [null, Validators.required],
        familyName: [null, Validators.required],
        email: [null, Validators.required],
        password: [null, Validators.required],
        addressLine: [null, Validators.required],
        zipCode: [null, Validators.required],
        city: [null, Validators.required]
      })
  }

  onSubmitForm():void{
    this.customerService.createCustomer(this.createForm.value).subscribe({
      next: (response) => {
        console.log('Customer created successfully', response);
      },
      error: (error) => {
        console.error('Error creating customer', error);
      }
    });  
  }
}
