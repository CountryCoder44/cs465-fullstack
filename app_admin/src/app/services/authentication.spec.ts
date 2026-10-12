import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Authentication } from './authentication';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';

// Build an unsigned JWT-shaped string - the client only reads the payload
function fakeToken(expSecondsFromNow: number): string {
  const payload = { email: 'admin@travlr.com', name: 'Admin', exp: Math.floor(Date.now() / 1000) + expSecondsFromNow };
  return `header.${btoa(JSON.stringify(payload))}.signature`;
}

describe('Authentication', () => {
  let service: Authentication;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(Authentication);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should start logged out', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should be logged in with an unexpired token and expose its claims', () => {
    service.saveToken(fakeToken(3600));
    expect(service.isLoggedIn()).toBe(true);
    expect(service.getCurrentUser()).toEqual({ email: 'admin@travlr.com', name: 'Admin' });
    expect(TestBed.inject(BROWSER_STORAGE).getItem('travlr-token')).toBe(service.getToken());
  });

  it('should treat an expired token as logged out', () => {
    service.saveToken(fakeToken(-60));
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should clear the token on logout', () => {
    service.saveToken(fakeToken(3600));
    service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(TestBed.inject(BROWSER_STORAGE).getItem('travlr-token')).toBeNull();
  });

  it('should POST credentials to /login and save the returned token', () => {
    const token = fakeToken(3600);
    service.login({ email: 'admin@travlr.com', name: '' } as User, 'secret').subscribe();
    const req = httpTesting.expectOne('http://localhost:3000/api/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: '', email: 'admin@travlr.com', password: 'secret' });
    req.flush({ token });
    expect(service.getToken()).toBe(token);
    expect(service.isLoggedIn()).toBe(true);
  });
});
