import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-cancel',
  imports: [RouterLink],
  template: `
    <section class="tl-container result-page">
      <div class="result-icon">!</div>
      <h1 class="result-title">Payment cancelled</h1>
      <p class="result-text">Your payment was not completed.</p>
      <a routerLink="/checkout" class="btn-primary" style="margin-top: 2rem">Return to checkout</a>
    </section>
  `,
})
export class CheckoutCancel {}
