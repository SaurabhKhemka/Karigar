import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxBarcodeModule } from 'ngx-barcode';
import { BarcodeScannerLivestreamModule } from 'ngx-barcode-scanner';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './core/app-routing.module';
import { CustomMaterialModule } from './core/material.module';
import { CustomerFormComponent } from './customer/customer-form/customer-form.component';
import { CustomerComponent } from './customer/customer.component';
import { ExcelComponent } from './excel/excel.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MaterialDialog } from './modal/mat-dialog.component';
import { ScanComponent } from './scan/scan.component';
import { SearchComponent } from './search/search.component';
import { CustomerService } from "./service/customer-service";
import { InventoryService } from "./service/inventory.service";
import { SharedService } from "./shared/shared.service";
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    ExcelComponent,
    CustomerComponent,
    SearchComponent,
    ScanComponent,
    SpinnerComponent,
    MaterialDialog,
    CustomerFormComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxBarcodeModule,
    BarcodeScannerLivestreamModule,
  ],
  providers: [CustomerService, InventoryService, SharedService],
  entryComponents: [MaterialDialog],
  bootstrap: [AppComponent],
})
export class AppModule { }
