import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { environment } from '../../environments/environment';

// Data service - the only place in the SPA that talks to the Express REST API.
// Components inject this service instead of making HTTP calls themselves.
@Injectable({
  providedIn: 'root'
})
export class TripData {
  private http = inject(HttpClient);
  private url = `${environment.apiBaseUrl}/trips`;

  // GET: /api/trips - retrieve every trip
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.url);
  }

  // GET: /api/trips/:tripCode - retrieve a single trip
  // (the API returns the match wrapped in an array)
  getTrip(tripCode: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.url}/${tripCode}`);
  }

  // POST: /api/trips - create a new trip
  addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.url, formData);
  }

  // PUT: /api/trips/:tripCode - update an existing trip
  updateTrip(tripCode: string, formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.url}/${tripCode}`, formData);
  }

  // DELETE: /api/trips/:tripCode - remove a trip
  deleteTrip(tripCode: string): Observable<Trip> {
    return this.http.delete<Trip>(`${this.url}/${tripCode}`);
  }

  // POST: /api/login - exchange credentials for a JWT
  login(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('login', user, passwd);
  }

  // POST: /api/register - create a user and receive a JWT
  register(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('register', user, passwd);
  }

  // Both auth endpoints take the same body, so share the call
  private handleAuthAPICall(endpoint: string, user: User, passwd: string): Observable<AuthResponse> {
    const formData = {
      name: user.name,
      email: user.email,
      password: passwd
    };
    return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/${endpoint}`, formData);
  }
}
