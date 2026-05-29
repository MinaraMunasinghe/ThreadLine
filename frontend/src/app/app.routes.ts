import { Routes } from '@angular/router';
import { Layout } from './components/layout/layout';
import { ProductCatalog } from './components/product-catalog/product-catalog';
import { Checkout } from './components/checkout/checkout';
import { AdminManagement } from './components/admin-management/admin-management';
import { Login } from './components/login/login';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: Layout,
    children: [
      { path: '', component: ProductCatalog },
      {
        path: 'checkout/success',
        loadComponent: () =>
          import('./components/checkout-result/checkout-success').then((m) => m.CheckoutSuccess),
      },
      {
        path: 'checkout/cancel',
        loadComponent: () =>
          import('./components/checkout-result/checkout-cancel').then((m) => m.CheckoutCancel),
      },
      { path: 'checkout', component: Checkout },
      { path: 'admin', component: AdminManagement, canActivate: [adminGuard] },
    ],
  },
  { path: '**', redirectTo: '' },
];
