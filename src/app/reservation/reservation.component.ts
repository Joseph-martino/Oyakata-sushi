import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ReservationService } from '../services/reservation.service';
import { Reservation } from '../models/Reservation';

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
    selectedHour?: string; // a termiiner, css sur bouton selectionné
    selectedPersons?: number; // a terminer css sur bouton selectionné

    constructor(
    private formBuilder: FormBuilder,
    private reservationService: ReservationService,
    private datePipe: DatePipe
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
    
                this.reservationService.createReservation(this.reservationForm.value).subscribe({
                    next: (reservation) => {
                        this.reservation = reservation;
                        this.showSuccessMessage = true;
                        console.log("message de succès affiché");

                        setTimeout(() => {
                            this.showSuccessMessage = false;
                            console.log("Message de succès masqué après 2 secondes");
                        }, 2000);
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
