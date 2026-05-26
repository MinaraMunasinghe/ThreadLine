import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import type { CartItem } from '../core/models/cart';
import type { Product } from '../core/models/product';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>([]);

  readonly items$ = this.itemsSubject.asObservable();
  readonly count$ = this.items$.pipe(
    map((items) => items.reduce((sum, i) => sum + i.quantity, 0))
  );
  readonly total$ = this.items$.pipe(
    map((items) => items.reduce((sum, i) => sum + i.price * i.quantity, 0))
  );

  get snapshot(): CartItem[] {
    return this.itemsSubject.getValue();
  }

  addToCart(product: Product, size: string, quantity = 1): void {
    const items = [...this.snapshot];
    const existing = items.find((i) => i.productId === product._id && i.size === size);

    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, existing.maxStock);
    } else {
      items.push({
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity: Math.min(quantity, product.stock),
        size,
        imageUrl: product.imageUrl,
        maxStock: product.stock,
      });
    }

    this.itemsSubject.next(items);
  }

  updateQuantity(productId: string, size: string, quantity: number): void {
    const items = this.snapshot
      .map((i) =>
        i.productId === productId && i.size === size
          ? { ...i, quantity: Math.min(Math.max(1, quantity), i.maxStock) }
          : i
      )
      .filter((i) => i.quantity > 0);
    this.itemsSubject.next(items);
  }

  removeItem(productId: string, size: string): void {
    this.itemsSubject.next(
      this.snapshot.filter((i) => !(i.productId === productId && i.size === size))
    );
  }

  clearCart(): void {
    this.itemsSubject.next([]);
  }
}
