import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
import { FileUploadModule } from 'primeng/fileupload';
import { MenubarModule } from 'primeng/menubar';
import { MenuComponent } from './components/menu/menu.component';
import { UploaderComponent } from './components/uploader/uploader.component';
import { HttpClientModule } from '@angular/common/http';
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
    MenuComponent,
    UploaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SelectButtonModule,
    FileUploadModule,
    MenubarModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
