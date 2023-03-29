import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PaperSizeComponent } from './form/paper-size/paper-size.component';
import { PaperGrammageComponent } from './form/paper-grammage/paper-grammage.component';
import { PrintTypeComponent } from './form/print-type/print-type.component';
import { PrintFormComponent } from './form/print-form/print-form.component';
import { PagesPerSideComponent } from './form/pages-per-side/pages-per-side.component';
import { OrientationComponent } from './form/orientation/orientation.component';
import { FinishTypeComponent } from './form/finish-type/finish-type.component';
import { BoundTypeComponent } from './form/bound-type/bound-type.component';
import { FileUploadModule } from 'primeng/fileupload';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { MenuComponent } from './components/menu/menu.component';
import { UploaderComponent } from './components/uploader/uploader.component';
import { HttpClientModule } from '@angular/common/http';
import { BoundComponent } from './components/bound/bound.component';
import { BoundColorsComponent } from './form/bound-colors/bound-colors.component';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { ColorOptionComponent } from './components/color-option/color-option.component';
import { QuantityCopiesComponent } from './form/quantity-copies/quantity-copies.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdditionalCommentComponent } from './form/additional-comment/additional-comment.component';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ConfirmBarComponent } from './components/confirm-bar/confirm-bar.component';
import { MessageService } from 'primeng/api';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SidebarModule } from 'primeng/sidebar';
import { IndexComponent } from './views/index/index.component';
import { PaymentComponent } from './views/payment/payment.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';

import { CheckboxModule } from 'primeng/checkbox';
import { OrderComponent } from './components/order/order.component';
import { TermsComponent } from './views/terms/terms.component';
import { SuccessComponent } from './views/success/success.component';
import { ErrorComponent } from './views/error/error.component';
import { LoadingComponent } from './components/loading/loading.component';
import { FilterPipe } from './filters/FilterPipe';
import { SubmenuComponent } from './components/submenu/submenu.component';
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

@NgModule({
  declarations: [
    AppComponent,
    PaperSizeComponent,
    PaperGrammageComponent,
    PrintTypeComponent,
    PrintFormComponent,
    PagesPerSideComponent,
    OrientationComponent,
    FinishTypeComponent,
    BoundComponent,
    MenuComponent,
    UploaderComponent,
    BoundTypeComponent,
    FilterPipe,
    BoundColorsComponent,
    ColorOptionComponent,
    QuantityCopiesComponent,
    AdditionalCommentComponent,
    ConfirmBarComponent,
    SidebarComponent,
    IndexComponent,
    PaymentComponent,
    OrderComponent,
    TermsComponent,
    SuccessComponent,
    ErrorComponent,
    LoadingComponent,
    SubmenuComponent,
    LoginComponent,
    ShippingComponent,
    BillingComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FormsModule,
    SelectButtonModule,
    FileUploadModule,
    RadioButtonModule,
    MenubarModule,
    HttpClientModule,
    InputTextModule,
    InputNumberModule,
    TabViewModule,
    CardModule,
    CheckboxModule,
    InputTextareaModule,
    BadgeModule,
    ToastModule,
    BrowserAnimationsModule,
    SidebarModule,
    StoreModule.forRoot({
      customer: customerReducer,
      loading: loadingReducer,
      coupon: couponsReducer,
    }),
    EffectsModule.forRoot([CustomerEffects]),
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
