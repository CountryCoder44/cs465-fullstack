import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([{ path: '**', children: [] }])]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should not call the API when fields are missing', () => {
    component.onLoginSubmit();
    expect(component.formError()).toBe('All fields are required, please try again');
  });

  it('should show an error when the API rejects the credentials', () => {
    component.loginForm.setValue({ email: 'admin@travlr.com', password: 'wrong' });
    component.onLoginSubmit();
    httpTesting.expectOne('http://localhost:3000/api/login')
      .flush({ message: 'Incorrect password.' }, { status: 401, statusText: 'Unauthorized' });
    expect(component.formError()).toBe('Incorrect email or password');
  });
});
