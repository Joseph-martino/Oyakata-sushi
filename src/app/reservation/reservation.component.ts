import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ReservationService } from '../services/reservation.service';
import { Reservation } from '../models/Reservation';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../models/Customer';

@Component({
selector: 'app-reservation',
templateUrl: './reservation.component.html',
styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
    reservationForm!: FormGroup;
    emailRegex!: RegExp;
    isFormSubmitted = false;
    showSuccessMessage = false;
    reservation!: Reservation|null;
    numberOfPersonsMax: number[] = [1,2,3,4,5,6,7,8,9];
    hoursOfReservation: string[] = ['12:00','12:30', '13:00', '13:30', '14:00', '18:00', '18:30', '19:00', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'];
    selectedHour?: string; 
    selectedPersons?: number; 
    holidays: Date[] = [
        new Date('2024-01-01'), // Jour de l'An
        new Date('2024-04-01'), // Pâques
        new Date('2024-05-01'), // Fête du Travail
        new Date('2024-05-08'), // Victoire 1945
        new Date('2024-07-14'), // Fête Nationale
        new Date('2024-08-15'), // Assomption
        new Date('2024-11-01'), // Toussaint
        new Date('2024-11-11'), // Armistice
        new Date('2024-12-25'),  // Noël
        new Date('2025-01-01')  // Jour de l'An
    ];
    isLoggedIn: boolean = false;
    customer!: Customer|null;

    constructor(
    private formBuilder: FormBuilder,
    private reservationService: ReservationService,
    private datePipe: DatePipe,
    private router: Router,
    private customerService: CustomerService
    ) {}

    ngOnInit(): void {
        this.emailRegex = /^[a-zA-Z0-9.-_]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/;
        this.reservationForm = this.formBuilder.group({
            familyName: [null, Validators.required],
            firstName: [null, Validators.required],
            email: [null, [Validators.required, Validators.pattern(this.emailRegex)]],
            numberOfPersons: [null, [Validators.required, Validators.min(1), Validators.max(9)]],
            reservationTime: [null, Validators.required],
            reservationDate: [null, Validators.required]
        });
        this.customerService.isLoggedIn().subscribe(
            (isLoggedIn) => this.isLoggedIn = isLoggedIn
        );

        this.customer = this.customerService.getLoggedInCustomer();
    }

    dateFilter = (d: Date | null): boolean => {
        if (!d) {
            return true;
        }
        const day = d.getDay();
        const isMonday = day === 1; // 0 = dimanche, 1 = lundi, etc.
        const isHoliday = this.holidays.some(holidayDay => this.areDatesEqual(holidayDay, d));
        return !isMonday && !isHoliday; 
    };
    
    areDatesEqual(date1: Date, date2: Date): boolean {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    }
    

    selectTime(hour: string){
        this.selectedHour = hour;
        this.reservationForm.patchValue({reservationTime: hour});
        console.log(this.reservationForm.value);
    }

    selectNumberOfPersons(number: number){
        this.selectedPersons = number;
        this.reservationForm.patchValue({numberOfPersons: number});
        console.log(this.reservationForm.value);
    }
    
    onSubmitForm(): void {
        this.isFormSubmitted = true;
        if (this.reservationForm.valid) {
            const reservationDateControl = this.reservationForm.get('reservationDate');
            const reservationTimeControl = this.reservationForm.get('reservationTime');
    
    
    
            if (reservationDateControl && reservationTimeControl) {
                const dateValue: Date = reservationDateControl.value;
                const timeString: string = reservationTimeControl.value;
    
                // Convertir la date en chaîne de caractères au format YYYY-MM-DD
                const dateString = this.datePipe.transform(dateValue, 'yyyy-MM-dd');
    
                // Créer la date et l'heure combinées en tant qu'objet Date
                const combinedDateTime = new Date(`${dateString}T${timeString}`);
    
                if (isNaN(combinedDateTime.getTime())) {
                    console.error("Date combinée invalide : " + `${dateString}T${timeString}`);
                    return;
                }
    
                // Formater la date combinée pour qu'elle soit acceptée par le backend
                const formattedDate = this.datePipe.transform(combinedDateTime, 'yyyy-MM-ddTHH:mm:ss');
    
                // Mise à jour du formulaire avec la date formatée
                this.reservationForm.patchValue({ reservationDate: formattedDate });
    
                console.log(this.reservationForm.value);

                this.reservationService.createReservation(this.reservationForm.value, this.customer).subscribe({
                    next: (reservation) => {
                        this.reservation = reservation;
                        this.showSuccessMessage = true;

                        setTimeout(() => {
                            this.showSuccessMessage = false;

                            setTimeout(() => {
                                this.router.navigateByUrl("/");
                            }, 3000);
                        }, 4000);
                        
                    },
                    error: (error) => {
                        console.error('Une erreur s\'est produite lors de la création de la réservation :', error);
                        this.showSuccessMessage = false;
                    }
                });
            } else {
                console.error("Les contrôles 'reservationDate' et/ou 'reservationTime' n'ont pas été trouvés dans le formulaire.");
            }
        }
    }
    
    
    
        isFieldInvalid(fieldName: string): boolean {
            const field = this.reservationForm.get(fieldName);
            return (field?.invalid && (field.dirty || field.touched || this.isFormSubmitted)) ?? false;
        }
    }
