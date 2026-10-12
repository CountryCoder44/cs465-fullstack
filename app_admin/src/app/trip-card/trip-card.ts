import { Component, inject, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { TripData } from '../services/trip-data';
import { Authentication } from '../services/authentication';
import { Trip } from '../models/trip';

// Reusable presentation component for a single trip
@Component({
  selector: 'app-trip-card',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css'
})
export class TripCard {
  private router = inject(Router);
  private tripData = inject(TripData);
  private authentication = inject(Authentication);

  trip =input.required<Trip>();
  deleted = output<void>();

  // Seeded trips store "/images/reef1.jpg"; allow a bare filename too
  get imageUrl(): string {
    const image = this.trip().image;
    return image.startsWith('/') || image.startsWith('http') ? image : `images/${image}`;
  }

  // Edit/Delete only show for a logged-in admin
  public isLoggedIn(): boolean {
    return this.authentication.isLoggedIn();
  }

  public editTrip(trip: Trip): void {
    // Stash the trip code so the edit form knows which trip to load
    localStorage.removeItem('tripCode');
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit-trip']);
  }

  public deleteTrip(trip: Trip): void {
    if (!confirm(`Delete trip ${trip.code} - ${trip.name}?`)) {
      return;
    }
    this.tripData.deleteTrip(trip.code).subscribe({
      next: (value: Trip) => {
        console.log('Deleted: ', value);
        this.deleted.emit();
      },
      error: (error: any) => {
        console.log('Error: ' + error.message);
      }
    });
  }
}
