import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { TripCard } from './trip-card';
import { Trip } from '../models/trip';
import { Authentication } from '../services/authentication';

describe('TripCard', () => {
  let fixture: ComponentFixture<TripCard>;
  const trip = {
    _id: '1', code: 'GALR210214', name: 'Gale Reef', length: '4 nights / 5 days',
    start: new Date('2021-02-14T08:00:00Z'), resort: 'Emerald Bay, 3 stars',
    perPerson: '799.00', image: '/images/reef1.jpg', description: '<p>Desc</p>'
  } as Trip;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TripCard],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([{ path: '**', children: [] }])]
    }).compileComponents();

    fixture = TestBed.createComponent(TripCard);
    fixture.componentRef.setInput('trip', trip);
    await fixture.whenStable();
  });

  it('should display the trip details', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Gale Reef');
    expect(compiled.textContent).toContain('$799.00');
    expect(compiled.querySelector('img')?.getAttribute('src')).toBe('/images/reef1.jpg');
  });

  it('should stash the trip code when Edit Trip is clicked', () => {
    localStorage.removeItem('tripCode');
    fixture.componentInstance.editTrip(trip);
    expect(localStorage.getItem('tripCode')).toBe('GALR210214');
  });

  it('should hide Edit/Delete when logged out', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.card-footer')).toBeNull();
  });

  it('should show Edit/Delete when logged in', async () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    TestBed.inject(Authentication).saveToken(`header.${btoa(JSON.stringify({ exp }))}.signature`);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.card-footer')?.textContent).toContain('Edit Trip');
  });
});
