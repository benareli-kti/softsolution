import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatDividerModule } from "@angular/material/divider";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatGridListModule } from '@angular/material/grid-list';
import { AppRoutingModule } from './app-routing.module';

import { NgxFileDragDropModule } from "ngx-file-drag-drop";

import { AppComponent } from './app.component';
import { LoginComponent } from './landing/login/login.component';
import { HomeComponent } from './main/home/home.component';

import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { ProfileComponent } from './main/profile/profile.component';
import { RegisterComponent } from './landing/register/register.component';
import { ProductCatComponent } from './main/product-cat/product-cat.component';
import { ProductcatDialogComponent } from './main/dialog/productcat-dialog.component';
import { BrandComponent } from './main/brand/brand.component';
import { BrandDialogComponent } from './main/dialog/brand-dialog.component';
import { ProductComponent } from './main/product/product.component';
import { ProductDialogComponent } from './main/dialog/product-dialog.component';
import { WarehouseComponent } from './main/warehouse/warehouse.component';
import { WarehouseDialogComponent } from './main/dialog/warehouse-dialog.component';
import { PartnerComponent } from './main/partner/partner.component';
import { PartnerDialogComponent } from './main/dialog/partner-dialog.component';
import { StockMoveDialogComponent } from './main/dialog/stockmove-dialog.component';
import { PosComponent } from './main/pos/pos.component';
import { PosdetailDialogComponent } from './main/dialog/posdetail-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProfileComponent,
    RegisterComponent,
    ProductCatComponent,
    ProductcatDialogComponent,
    BrandComponent,
    BrandDialogComponent,
    ProductComponent,
    ProductDialogComponent,
    WarehouseComponent,
    WarehouseDialogComponent,
    PartnerComponent,
    PartnerDialogComponent,
    StockMoveDialogComponent,
    PosComponent,
    PosdetailDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    StoreModule,
    Ng2SearchPipeModule,

    LayoutModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatGridListModule,

    NgxFileDragDropModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
