import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './landing/login/login.component';
import { RegisterComponent } from './landing/register/register.component';
import { HomeComponent } from './main/home/home.component';
import { ProfileComponent } from './backend/profile/profile.component';
import { SettingComponent } from './backend/setting/setting.component';
import { ProductCatComponent } from './main/product-cat/product-cat.component';
import { BrandComponent } from './main/brand/brand.component';
import { ProductComponent } from './main/product/product.component';
import { UomComponent } from './main/uom/uom.component';
import { WarehouseComponent } from './main/warehouse/warehouse.component';
import { PartnerComponent } from './main/partner/partner.component';
import { PurchaseComponent } from './main/purchase/purchase.component';
import { PosComponent } from './main/pos/pos.component';
import { PosSessionComponent } from './main/pos-session/pos-session.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'setting', component: SettingComponent },
  { path: 'productcategory', component: ProductCatComponent },
  { path: 'brand', component: BrandComponent },
  { path: 'product', component: ProductComponent },
  { path: 'uom', component: UomComponent },
  { path: 'warehouse', component: WarehouseComponent },
  { path: 'partner', component: PartnerComponent },
  { path: 'purchase', component: PurchaseComponent },
  { path: 'pos', component: PosComponent },
  { path: 'pos-session', component: PosSessionComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
