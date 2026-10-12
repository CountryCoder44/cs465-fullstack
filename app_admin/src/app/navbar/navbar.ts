import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private router = inject(Router);
  protected authentication = inject(Authentication);

  protected readonly title = 'Travlr Getaways Admin';

  public isLoggedIn(): boolean {
    return this.authentication.isLoggedIn();
  }

  public currentUserName(): string {
    return this.authentication.getCurrentUser().name;
  }

  public onLogout(): void {
    this.authentication.logout();
    this.router.navigate(['']);
  }
}
