import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { BROWSER_STORAGE } from '../storage';
import { TripData } from './trip-data';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

// Manages the admin session: stores the JWT returned by the API, reads the
// claims out of it, and decides whether the user is currently logged in.
@Injectable({
  providedIn: 'root'
})
export class Authentication {
  private storage = inject(BROWSER_STORAGE);
  private tripData = inject(TripData);
  private readonly tokenKey = 'travlr-token';

  // Held in a signal so the navbar and trip cards update as soon as the
  // user logs in or out
  private token = signal<string>(this.storage.getItem(this.tokenKey) ?? '');

  // Logged in = a token exists and its exp claim is still in the future
  readonly loggedIn = computed(() => {
    const payload = this.decode(this.token());
    return payload !== null && payload.exp > Date.now() / 1000;
  });

  // Get our token from our Storage provider
  public getToken(): string {
    return this.token();
  }

  // Save our token to our Storage provider
  public saveToken(token: string): void {
    this.storage.setItem(this.tokenKey, token);
    this.token.set(token);
  }

  // Logout of our application and remove the JWT from Storage
  public logout(): void {
    this.storage.removeItem(this.tokenKey);
    this.token.set('');
  }

  // Boolean to determine if we are logged in and the token is still valid
  public isLoggedIn(): boolean {
    return this.loggedIn();
  }

  // Retrieve the current user from the token claims.
  // Only call after confirming isLoggedIn().
  public getCurrentUser(): User {
    const { email, name } = this.decode(this.token()) ?? { email: '', name: '' };
    return { email, name } as User;
  }

  // Login method that leverages the login method in tripData. Saves the
  // returned token so later API calls carry it.
  public login(user: User, passwd: string): Observable<AuthResponse> {
    return this.tripData.login(user, passwd)
      .pipe(tap((value: AuthResponse) => this.saveToken(value.token)));
  }

  // Register method that leverages the register method in tripData. A
  // successful registration logs the new user straight in.
  public register(user: User, passwd: string): Observable<AuthResponse> {
    return this.tripData.register(user, passwd)
      .pipe(tap((value: AuthResponse) => this.saveToken(value.token)));
  }

  // The JWT payload (middle segment) is base64url-encoded JSON - not
  // encrypted - so the client can read the claims without calling the API
  private decode(token: string): { email: string; name: string; exp: number } | null {
    if (!token) {
      return null;
    }
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }
}
