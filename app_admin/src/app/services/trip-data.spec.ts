import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TripData } from './trip-data';
import { Trip } from '../models/trip';

describe('TripData', () => {
  let service: TripData;
  let httpTesting: HttpTestingController;
  const url = 'http://localhost:3000/api/trips';
  const trip = { code: 'TEST261006', name: 'Test Trip' } as Trip;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TripData);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify(); // no unexpected requests
  });

  it('should GET all trips', () => {
    service.getTrips().subscribe(trips => expect(trips).toEqual([trip]));
    const req = httpTesting.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush([trip]);
  });

  it('should GET a single trip by code', () => {
    service.getTrip('TEST261006').subscribe();
    const req = httpTesting.expectOne(`${url}/TEST261006`);
    expect(req.request.method).toBe('GET');
    req.flush([trip]);
  });

  it('should POST a new trip', () => {
    service.addTrip(trip).subscribe();
    const req = httpTesting.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(trip);
    req.flush(trip);
  });

  it('should PUT an updated trip', () => {
    service.updateTrip('TEST261006', trip).subscribe();
    const req = httpTesting.expectOne(`${url}/TEST261006`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(trip);
    req.flush(trip);
  });

  it('should DELETE a trip', () => {
    service.deleteTrip('TEST261006').subscribe();
    const req = httpTesting.expectOne(`${url}/TEST261006`);
    expect(req.request.method).toBe('DELETE');
    req.flush(trip);
  });
});
