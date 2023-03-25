import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './views/error/error.component';
import { IndexComponent } from './views/index/index.component';
import { PaymentComponent } from './views/payment/payment.component';
import { SuccessComponent } from './views/success/success.component';
import { TermsComponent } from './views/terms/terms.component';
import { LoginComponent } from './views/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
  },
  {
    path: 'terms',
    component: TermsComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'payment',
    component: PaymentComponent,
  },
  {
    path: 'payment/success',
    component: SuccessComponent,
  },
  {
    path: 'payment/error',
    component: ErrorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
