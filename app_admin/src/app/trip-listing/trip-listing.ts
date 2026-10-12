import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { TripCard } from '../trip-card/trip-card';
import { TripData } from '../services/trip-data';
import { Authentication } from '../services/authentication';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-trip-listing',
  imports: [TripCard],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css'
})
export class TripListing implements OnInit {
  private tripData = inject(TripData);
  private router = inject(Router);
  private authentication = inject(Authentication);

  trips = signal<Trip[]>([]);
  message = signal('');

  ngOnInit(): void {
    this.getStuff();
  }

  // Retrieve all trips from the API through the data service
  private getStuff(): void {
    this.message.set('Searching for trips');
    this.tripData.getTrips().subscribe({
      next: (value: Trip[]) => {
        this.trips.set(value);
        this.message.set(value.length > 0
          ? `There are ${value.length} trips available.`
          : 'There were no trips retrieved from the database');
        console.log(this.message());
      },
      error: (error: any) => {
        this.trips.set([]);
        this.message.set(error.status === 404
          ? 'There were no trips retrieved from the database'
          : 'Unable to reach the trips API');
        console.log('Error: ' + error.message);
      }
    });
  }

  // Only a logged-in admin sees the Add Trip button
  public isLoggedIn(): boolean {
    return this.authentication.isLoggedIn();
  }

  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  // Called by a child trip card after it deletes its trip
  public onTripDeleted(): void {
    this.getStuff();
  }
}
