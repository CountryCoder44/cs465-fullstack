import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  imports: [ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css'
})
export class EditTrip implements OnInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private tripData = inject(TripData);

  submitted = signal(false);
  message = signal('');
  private tripCode = '';

  editForm = this.formBuilder.nonNullable.group({
    _id: [''],
    code: ['', Validators.required],
    name: ['', Validators.required],
    length: ['', Validators.required],
    start: ['', Validators.required],
    resort: ['', Validators.required],
    perPerson: ['', Validators.required],
    image: ['', Validators.required],
    description: ['', Validators.required]
  });

  ngOnInit(): void {
    // Retrieve the trip code stashed by the trip card's Edit button
    const tripCode = localStorage.getItem('tripCode');
    if (!tripCode) {
      alert("Something wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }
    this.tripCode = tripCode;

    console.log('EditTrip::ngOnInit');
    console.log('tripcode: ' + tripCode);

    this.tripData.getTrip(tripCode).subscribe({
      next: (value: Trip[]) => {
        const trip = value[0];
        // <input type="date"> needs yyyy-mm-dd; the API returns a full ISO string
        this.editForm.patchValue({
          ...trip,
          start: new Date(trip.start).toISOString().substring(0, 10)
        });
        this.message.set(`Trip: ${tripCode} retrieved`);
        console.log(this.message());
      },
      error: (error: any) => {
        this.message.set(`No trip retrieved for ${tripCode}`);
        console.log('Error: ' + error.message);
      }
    });
  }

  public onSubmit(): void {
    this.submitted.set(true);
    if (this.editForm.invalid) {
      return;
    }
    const trip = this.editForm.getRawValue() as unknown as Trip;
    this.tripData.updateTrip(this.tripCode, trip).subscribe({
      next: (value: Trip) => {
        console.log(value);
        localStorage.removeItem('tripCode');
        this.router.navigate(['']);
      },
      error: (error: any) => {
        this.message.set('Unable to update trip: ' + error.message);
        console.log('Error: ' + error.message);
      }
    });
  }

  // Shortcut for the template to read form controls
  get f() {
    return this.editForm.controls;
  }
}
