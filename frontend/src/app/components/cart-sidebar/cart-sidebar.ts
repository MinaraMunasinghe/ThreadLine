import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-sidebar',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-sidebar.html',
  styleUrl: './cart-sidebar.css',
})
export class CartSidebar {
  private readonly cartService = inject(CartService);

  readonly open = input(false);
  readonly closed = output<void>();

  protected readonly items$ = this.cartService.items$;
  protected readonly total$ = this.cartService.total$;

  close(): void {
    this.closed.emit();
  }

  updateQty(productId: string, size: string, quantity: number): void {
    this.cartService.updateQuantity(productId, size, quantity);
  }

  remove(productId: string, size: string): void {
    this.cartService.removeItem(productId, size);
  }
}
