import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PaperSizeComponent } from './form/paper-size/paper-size.component';
import { PaperTypeComponent } from './form/paper-type/paper-type.component';
import { PrintTypeComponent } from './form/print-type/print-type.component';
import { PrintFormComponent } from './form/print-form/print-form.component';
import { PagesPerSideComponent } from './form/pages-per-side/pages-per-side.component';
import { OrientationComponent } from './form/orientation/orientation.component';
import { FinishTypeComponent } from './form/finish-type/finish-type.component';
import { BoundTypeComponent } from './form/bound-type/bound-type.component';
import { FileUploadModule } from 'primeng/fileupload';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { HeaderComponent } from './components/header/header.component';
import { UploaderComponent } from './components/uploader/uploader.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BoundComponent } from './form/bound/bound.component';
import { BoundColorsComponent } from './form/bound-colors/bound-colors.component';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { ColorOptionComponent } from './components/color-option/color-option.component';
import { QuantityCopiesComponent } from './form/quantity-copies/quantity-copies.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdditionalCommentComponent } from './components/inputs/additional-comment/additional-comment.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmBarComponent } from './components/confirm-bar/confirm-bar.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ShopcartWrapperComponent } from './components/shopcart-wrapper/shopcart-wrapper.component';
import { SidebarModule } from 'primeng/sidebar';
import { TabMenuModule } from 'primeng/tabmenu';
import { PrintComponent } from './views/print/print.component';
import { PaymentComponent } from './views/payment/payment.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { GalleriaModule } from 'primeng/galleria';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';
import { CheckboxModule } from 'primeng/checkbox';
import { ShopcartComponent } from './components/shopcart/shopcart.component';
import { TermsComponent } from './views/terms/terms.component';
import { SuccessComponent } from './views/success/success.component';
import { ErrorComponent } from './views/error/error.component';
import { LoadingComponent } from './components/loading/loading.component';
import { FilterPipe } from './filters/FilterPipe';
import { LoginComponent } from './views/login/login.component';
import { StoreModule } from '@ngrx/store';
import { customerReducer } from './_reducer/customer.reducer';
import { CustomerEffects } from './_effects/customer.effects';
import { EffectsModule } from '@ngrx/effects';
import { loadingReducer } from './_reducer/loading.reducer';
import { couponsReducer } from './_reducer/coupons.reducer';
import { ShippingComponent } from './components/forms/shipping/shipping.component';
import { BillingComponent } from './components/forms/billing/billing.component';
import { ProfileComponent } from './views/profile/profile.component';
import { AdminIndexComponent } from './views/admin/admin-index/admin-index.component';
import { BannerComponent } from './components/banner/banner.component';
import { AuthInterceptor } from './_interceptors/auth.interceptor';
import { HttpErrorInterceptor } from './_interceptors/http-error.interceptor';
import { AuthService } from './services/auth.service';
import { initializeApp } from './_helpers/app.initializer';
import { ShopIndexComponent } from './views/shop/shop-index/shop-index.component';
import { DataViewModule } from 'primeng/dataview';
import { ProductComponent } from './components/product/product.component';
import { AdminShopComponent } from './views/admin/admin-shop/admin-shop.component';
import { AdminBannerComponent } from './views/admin/admin-banner/admin-banner.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DividerModule } from 'primeng/divider';
import { PillsComponent } from './components/pills/pills.component';
import { FooterComponent } from './components/footer/footer.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { SignUpComponent } from './views/sign-up/sign-up.component';
import { ResetPasswordComponent } from './views/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { ShopProductComponent } from './views/shop/shop-product/shop-product.component';
import { UserOrdersComponent } from './views/profile/user-orders/user-orders.component';
import { UserInformationComponent } from './views/profile/user-information/user-information.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { UserPasswordComponent } from './views/profile/user-password/user-password.component';
import { BoundPagesComponent } from './form/bound-pages/bound-pages.component';
import { OrderProcessingComponent } from './components/order-processing/order-processing.component';
import { PaymentsEmptyCartWarningComponent } from './components/payments-empty-cart-warning/payments-empty-cart-warning.component';
import { MenuSidebarComponent } from './components/menu-sidebar/menu-sidebar.component';
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ViewTarjetasVisitaComponent } from './views/imprenta/view-tarjetas-visita/view-tarjetas-visita.component';
import { ViewFlyersComponent } from './views/imprenta/view-flyers/view-flyers.component';
import { ViewCarpetasComponent } from './views/imprenta/view-carpetas/view-carpetas.component';
import { ViewRevistasComponent } from './views/imprenta/view-revistas/view-revistas.component';
import { ViewRollupsComponent } from './views/imprenta/view-rollups/view-rollups.component';
import { ViewCartelesComponent } from './views/imprenta/view-carteles/view-carteles.component';
import { ViewDipticosComponent } from './views/imprenta/view-dipticos/view-dipticos.component';
import { ViewTripticosComponent } from './views/imprenta/view-tripticos/view-tripticos.component';
import { InputCustomSizeComponent } from './components/inputs/input-custom-size/input-custom-size.component';
import { SelectButtonComponent } from './components/inputs/select-button/select-button.component';
import { ShopcartPrintItemComponent } from './components/shopcart-print-item/shopcart-print-item.component';
import { PrintTypeCoverComponent } from './form/print-type-cover/print-type-cover.component';

@NgModule({
  declarations: [
    AppComponent,
    PaperSizeComponent,
    PaperTypeComponent,
    PrintTypeComponent,
    PrintFormComponent,
    PagesPerSideComponent,
    OrientationComponent,
    FinishTypeComponent,
    BoundComponent,
    HeaderComponent,
    UploaderComponent,
    BoundTypeComponent,
    FilterPipe,
    BoundColorsComponent,
    ColorOptionComponent,
    QuantityCopiesComponent,
    AdditionalCommentComponent,
    ConfirmBarComponent,
    ShopcartWrapperComponent,
    PrintComponent,
    PaymentComponent,
    ShopcartComponent,
    TermsComponent,
    SuccessComponent,
    ErrorComponent,
    LoadingComponent,
    LoginComponent,
    ShippingComponent,
    BillingComponent,
    ProfileComponent,
    AdminIndexComponent,
    BannerComponent,
    ShopIndexComponent,
    ProductComponent,
    AdminShopComponent,
    AdminBannerComponent,
    PillsComponent,
    FooterComponent,
    CarouselComponent,
    SignUpComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    ShopProductComponent,
    UserOrdersComponent,
    UserInformationComponent,
    OrderDetailsComponent,
    PrintTypeCoverComponent,
    UserPasswordComponent,
    BoundPagesComponent,
    OrderProcessingComponent,
    PaymentsEmptyCartWarningComponent,
    MenuSidebarComponent,
    MobileMenuComponent,
    ViewTarjetasVisitaComponent,
    ViewFlyersComponent,
    ViewCarpetasComponent,
    ViewRevistasComponent,
    ViewRollupsComponent,
    ViewCartelesComponent,
    ViewDipticosComponent,
    ViewTripticosComponent,
    InputCustomSizeComponent,
    SelectButtonComponent,
    ShopcartPrintItemComponent,
  ],
  imports: [
    BrowserModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    TabMenuModule,
    AppRoutingModule,
    FormsModule,
    TableModule,
    MenuModule,
    DividerModule,
    OverlayPanelModule,
    DataViewModule,
    InputSwitchModule,
    SelectButtonModule,
    FileUploadModule,
    RadioButtonModule,
    MenubarModule,
    HttpClientModule,
    InputTextModule,
    InputNumberModule,
    GalleriaModule,
    TabViewModule,
    CardModule,
    ConfirmDialogModule,
    CheckboxModule,
    InputTextareaModule,
    BadgeModule,
    ToastModule,
    BrowserAnimationsModule,
    SidebarModule,
    StoreModule.forRoot({
      customer: customerReducer,
      loading: loadingReducer,
      coupons: couponsReducer,
    }),
    EffectsModule.forRoot([CustomerEffects]),
  ],
  providers: [
    MessageService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => initializeApp(authService),
      multi: true,
      deps: [AuthService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
