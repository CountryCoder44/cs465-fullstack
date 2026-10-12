import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { jwtInterceptor } from './jwt-interceptor';
import { Authentication } from '../services/authentication';

describe('jwtInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let authentication: Authentication;
  const token = `header.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }))}.signature`;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([jwtInterceptor])), provideHttpClientTesting()]
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    authentication = TestBed.inject(Authentication);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should not add a header when logged out', () => {
    http.post('/api/trips', {}).subscribe();
    const req = httpTesting.expectOne('/api/trips');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should add a Bearer header when logged in', () => {
    authentication.saveToken(token);
    http.put('/api/trips/X', {}).subscribe();
    const req = httpTesting.expectOne('/api/trips/X');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    req.flush({});
  });

  it('should leave login requests unsigned', () => {
    authentication.saveToken(token);
    http.post('/api/login', {}).subscribe();
    const req = httpTesting.expectOne('/api/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
