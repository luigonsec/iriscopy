import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './views/error/error.component';
import { PrintComponent } from './views/print/print.component';
import { PaymentComponent } from './views/payment/payment.component';
import { SuccessComponent } from './views/success/success.component';
import { TermsComponent } from './views/terms/terms.component';
import { LoginComponent } from './views/login/login.component';
import { ProfileComponent } from './views/profile/profile.component';
import { AdminIndexComponent } from './views/admin/admin-index/admin-index.component';
import { AuthGuard } from './_guards/auth-guard.service';
import { IsAdminGuardGuard } from './_guards/is-admin-guard.guard';
import { ShopIndexComponent } from './views/shop/shop-index/shop-index.component';
import { AdminBannerComponent } from './views/admin/admin-banner/admin-banner.component';
import { AdminShopComponent } from './views/admin/admin-shop/admin-shop.component';
import { IsShopActiveGuard } from './_guards/is-shop-active-guard.service';
import { SignUpComponent } from './views/sign-up/sign-up.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { ShopProductComponent } from './views/shop/shop-product/shop-product.component';
import { UserInformationComponent } from './views/profile/user-information/user-information.component';
import { UserOrdersComponent } from './views/profile/user-orders/user-orders.component';
import { UserPasswordComponent } from './views/profile/user-password/user-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'print',
    pathMatch: 'full',
  },
  {
    path: 'print',
    component: PrintComponent,
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
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'payment',
    component: PaymentComponent,
  },
  {
    path: 'shop',
    component: ShopIndexComponent,
    canActivate: [IsShopActiveGuard],
  },
  {
    path: 'shop/:slug',
    component: ShopProductComponent,
    canActivate: [IsShopActiveGuard],
  },
  {
    path: 'admin',
    component: AdminIndexComponent,

    canActivate: [AuthGuard, IsAdminGuardGuard],
    children: [
      { path: 'banner', component: AdminBannerComponent },
      { path: 'shop', component: AdminShopComponent },
    ],
  },
  {
    path: 'payment/success',
    component: SuccessComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'security', component: UserPasswordComponent },
      { path: 'information', component: UserInformationComponent },
      { path: 'orders', component: UserOrdersComponent },
    ],
  },
  {
    path: 'payment/error',
    component: ErrorComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
