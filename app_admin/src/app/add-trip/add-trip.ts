import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-add-trip',
  imports: [ReactiveFormsModule],
  templateUrl: './add-trip.html',
  styleUrl: './add-trip.css'
})
export class AddTrip {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private tripData = inject(TripData);

  submitted = signal(false);
  message = signal('');

  addForm = this.formBuilder.nonNullable.group({
    code: ['', Validators.required],
    name: ['', Validators.required],
    length: ['', Validators.required],
    start: ['', Validators.required],
    resort: ['', Validators.required],
    perPerson: ['', Validators.required],
    image: ['', Validators.required],
    description: ['', Validators.required]
  });

  public onSubmit(): void {
    this.submitted.set(true);
    if (this.addForm.invalid) {
      return;
    }
    // Mongo assigns the _id when the API saves the trip
    const trip = this.addForm.getRawValue() as unknown as Trip;
    this.tripData.addTrip(trip).subscribe({
      next: (data: Trip) => {
        console.log(data);
        this.router.navigate(['']);
      },
      error: (error: any) => {
        this.message.set('Unable to add trip: ' + error.message);
        console.log('Error: ' + error.message);
      }
    });
  }

  // Shortcut for the template to read form controls
  get f() {
    return this.addForm.controls;
  }
}
