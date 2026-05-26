import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
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

  protected readonly cartOpen = signal(false);
  protected readonly cartCount$ = this.cartService.count$;

  openCart(): void {
    this.cartOpen.set(true);
  }

  closeCart(): void {
    this.cartOpen.set(false);
  }

  navigateCategory(category: string): void {
    this.router.navigate(['/'], { queryParams: { category } });
  }
}
