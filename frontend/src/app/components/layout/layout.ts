import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { CartSidebar } from '../cart-sidebar/cart-sidebar';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe, CartSidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected readonly cartOpen = signal(false);
  protected readonly cartCount$ = this.cartService.count$;
  protected readonly currentUser$ = this.authService.currentUser$;

  openCart(): void {
    this.cartOpen.set(true);
  }

  closeCart(): void {
    this.cartOpen.set(false);
  }

  navigateCategory(category: string): void {
    this.router.navigate(['/'], { queryParams: { category } });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
