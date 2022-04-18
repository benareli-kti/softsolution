import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

import { Purchase } from 'src/app/models/purchase.model';
import { PurchaseService } from 'src/app/services/purchase.service';
import { Purchasedetail } from 'src/app/models/purchasedetail.model';
import { PurchasedetailService } from 'src/app/services/purchasedetail.service';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Partner } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';

@Component({
  selector: 'app-purchase-dialog',
  templateUrl: './purchase-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class PurchaseDialogComponent implements OnInit {
  isChecked = false;
  isTU = false;
  isTM = false;
  isAdm = false;
  isRes = false;
  term: string;

  partners?: Partner[];
  warehouses?: Warehouse[];
  products?: Product[];
  supplierString?: string;
  warehouseString?: string;

  //Table
  displayedColumns: string[] = 
  ['product', 'qty', 'price_unit', 'discount', 'tax', 'subtotal'];
  dataSource = new MatTableDataSource<any>();
  datas?: any;

  a = 0; b = 0;
  isUpdated = 'update';
  currDescription?: string;
  log = 0;
  currentIndex1 = -1;

  constructor(
    public dialogRef: MatDialogRef<PurchaseDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private logService: LogService,
    private purchaseService: PurchaseService,
    private purchasedetailService: PurchasedetailService,
    private partnerService: PartnerService,
    private warehouseService: WarehouseService,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  ngOnInit() {
    /*if (this.data.active == true){
        this.statusActive = 'true';
        this.isChecked = true;
        this.a = 0;
      } else {
        this.statusActive = 'false';
        this.isChecked = false;
        this.a = 1;
      }
    this.currDescription = this.data.description;*/
    this.datas = [{product:"FT PENDO",qty:1,price_unit:10}]
    this.dataSource = this.datas;
    this.checkRole();
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="trans_user") this.isTU=true;
      if(this.globals.roles![x]=="trans_manager") this.isTM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isTM || !this.isAdm) this.isRes = true;
    this.retrieveLog();
    this.retrieveData();
    this.currentIndex1 = -1;
  }

  retrieveLog(): void {
    this.logService.getAll()
      .subscribe({
        next: (logPR) => {
          logPR = logPR.filter
          (dataPR => dataPR.brand === this.data.id)
          this.log = logPR.length;
        },
        error: (e) => console.error(e)
      })
  }

  retrieveData(): void {
    this.partnerService.findAllActiveSupplier()
      .subscribe({
        next: (dataSup) => {
          this.partners = dataSup;
        },
        error: (e) => console.error(e)
      })
    this.warehouseService.findAllActive()
      .subscribe({
        next: (datawh) => {
          this.warehouses = datawh;
          this.warehouseString = datawh[0].id;
        },
        error: (e) => console.error(e)
      })
    this.productService.findAllActiveStock()
      .subscribe({
        next: (dataProd) => {
          this.products = dataProd;
        },
        error: (e) => console.error(e)
      })
  }

  getProd(product: Product, index: number): void {
    this.currentIndex1 = index;
    const dataPush = {
      id: product.id, product: product.name, qty: 1,
        price_unit: product.cost, subtotal: product.cost
    }
    this.datas.push(dataPush);
    //this.datas = [{product:"BABI",qty:1},{product:"FT PENDO",qty:1}]
    //if(this.datas[0].product=='') this.datas.splice(0,1);
    this.check();
  }

  check(): void {
    this.dataSource = this.datas;
    console.log(this.datas, this.dataSource);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateData(): void {
    
  }
}
