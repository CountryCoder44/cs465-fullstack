import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { TripListing } from './trip-listing';
import { Trip } from '../models/trip';

describe('TripListing', () => {
  let component: TripListing;
  let fixture: ComponentFixture<TripListing>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripListing],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(TripListing);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  it('should render a card for each trip returned by the API', async () => {
    const trips = [
      { _id: '1', code: 'A', name: 'Trip A', image: '/images/reef1.jpg', perPerson: '1', start: new Date() },
      { _id: '2', code: 'B', name: 'Trip B', image: '/images/reef2.jpg', perPerson: '2', start: new Date() }
    ] as Trip[];
    httpTesting.expectOne('http://localhost:3000/api/trips').flush(trips);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('app-trip-card').length).toBe(2);
    expect(component.message()).toBe('There are 2 trips available.');
  });
});
