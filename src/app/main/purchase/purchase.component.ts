import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import { Observable, of } from "rxjs";
import { Globals } from 'src/app/global';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { DataFilter, filterOption } from 'src/app/models/datafilter';
import { PurchaseDialogComponent } from '../dialog/purchase-dialog.component';

import { Purchase } from 'src/app/models/purchase.model';
import { PurchaseService } from 'src/app/services/purchase.service';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Productcat } from 'src/app/models/productcat.model';
import { ProductCatService } from 'src/app/services/product-cat.service';
import { Brand } from 'src/app/models/brand.model';
import { BrandService } from 'src/app/services/brand.service';
import { Partner } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['../style/main.component.sass']
})
export class PurchaseComponent implements OnInit {
  partners?: Partner[];
  warehouses?: Warehouse[];
  isTU = false;
  isTM = false;
  isAdm = false;
  isShow = false;

  supplierString?: string;
  warehouseString?: string;

  constructor(
    private globals: Globals,
    private dialog: MatDialog,
    private purchaseService: PurchaseService,
    private productService: ProductService,
    private productCatService: ProductCatService,
    private brandService: BrandService,
    private partnerService: PartnerService,
    private warehouseService: WarehouseService
  ) { }

  ngOnInit(): void {
    this.checkRole();
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="trans_user") this.isTU=true;
      if(this.globals.roles![x]=="trans_manager") this.isTM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    this.retrieveData();
  }

  retrieveData(): void {
    this.partnerService.findAllActiveSupplier()
      .subscribe(dataSup => {
        this.partners = dataSup;
      })
    this.warehouseService.findAllActive()
      .subscribe(datawh => {
        this.warehouses = datawh;
        this.warehouseString = datawh[0].id;
      })
  }

  applyFilter(event: Event) {
    /*const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();*/
  }

  addPurchase(): void {
    const dialog = this.dialog.open(PurchaseDialogComponent, {
      width: '100vw',
      height: '100%',
      disableClose: true,   
    })
      .afterClosed()
      .subscribe(() => this.retrieveData());
  }
}
