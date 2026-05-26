import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-success',
  imports: [RouterLink],
  template: `
    <section class="tl-container result-page">
      <div class="result-icon">✓</div>
      <h1 class="result-title">Payment successful</h1>
      <p class="result-text">Thank you for your order.</p>
      <a routerLink="/" class="btn-primary" style="margin-top: 2rem">Back to shop</a>
    </section>
  `,
})
export class CheckoutSuccess {}
