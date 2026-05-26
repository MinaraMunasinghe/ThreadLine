import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { PaymentService } from '../../services/payment.service';
import type { CheckoutRequest } from '../../core/models/order';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {
  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly paymentService = inject(PaymentService);
  protected readonly cartItems$ = this.cartService.items$;
  protected readonly cartTotal$ = this.cartService.total$;
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly shipToDifferent = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    country: ['Sri Lanka', Validators.required],
    shippingAddress: [''],
    shippingCity: [''],
  });

  toggleDifferentAddress(checked: boolean): void {
    this.shipToDifferent.set(checked);
    const shippingAddress = this.form.controls.shippingAddress;
    const shippingCity = this.form.controls.shippingCity;

    if (checked) {
      shippingAddress.setValidators([Validators.required]);
      shippingCity.setValidators([Validators.required]);
    } else {
      shippingAddress.clearValidators();
      shippingCity.clearValidators();
      shippingAddress.setValue('');
      shippingCity.setValue('');
    }
    shippingAddress.updateValueAndValidity();
    shippingCity.updateValueAndValidity();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const items = this.cartService.snapshot;
    if (!items.length) {
      this.error.set('Your cart is empty.');
      return;
    }

    const v = this.form.getRawValue();
    const billingDetails = {
      firstName: v.firstName,
      lastName: v.lastName,
      email: v.email,
      phone: v.phone,
      address: v.address,
      city: v.city,
      country: v.country,
    };

    const deliveryDetails = this.shipToDifferent()
      ? { shippingAddress: v.shippingAddress, shippingCity: v.shippingCity }
      : { shippingAddress: v.address, shippingCity: v.city };

    const payload: CheckoutRequest = {
      items: items.map(({ productId, title, price, quantity, size }) => ({
        productId,
        title,
        price,
        quantity,
        size,
      })),
      billingDetails,
      deliveryDetails,
    };

    this.submitting.set(true);
    this.error.set(null);

    this.paymentService.checkout(payload).subscribe({
      next: (res) => {
        this.cartService.clearCart();
        this.paymentService.submitPayHereForm(res.payhere, res.checkoutUrl);
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(err?.error?.message ?? 'Checkout failed. Please try again.');
      },
    });
  }
}
