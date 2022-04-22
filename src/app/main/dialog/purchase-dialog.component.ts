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
  openDropDown = false;

  partners?: Partner[];
  warehouses?: Warehouse[];
  products?: Product[];
  supplierString?: string;
  warehouseString?: string;
  datid?: string;
  datqty?: number;
  datcost?: number;
  datdisc?: number;
  dattax?: number;
  datsub?: number;
  ph?: string = 'Ketik disini untuk cari';

  //Table
  displayedColumns: string[] = 
  ['product', 'qty', 'price_unit', 'discount', 'tax', 'subtotal', 'action'];
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
    this.datas = [{product:"",qty:"",price_unit:""}]
    this.dataSource.data = this.datas;
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
      .subscribe(logPR => {
        logPR = logPR.filter(dataPR => dataPR.brand === this.data.id);
        this.log = logPR.length;
      })
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
    this.productService.findAllActiveStock()
      .subscribe(dataProd => {
        this.products = dataProd;
      })
  }

  getProd(product: Product, index: number): void {
    this.currentIndex1 = index;
    this.onF();
    this.term = product.name!.toString();
    this.ph = product.name;
    this.datid = product.id;
    this.datqty = 1;
    this.datcost = product.cost ?? 0;
    this.dattax = product.taxout.tax ?? 0;
    this.datsub = (this.datqty * this.datcost!) +
      (this.dattax!/100 * (this.datqty * this.datcost!));
  }

  pushing(): void {
    if(this.datas[0].product=='') this.datas.splice(0,1);
    const dataPush = {
      id: this.datid, product: this.ph, qty: this.datqty,
        price_unit: this.datcost ?? 0, tax: this.dattax ?? 0,
        subtotal: (this.datqty ?? 0) * (this.datcost ?? 0) +
      ((this.dattax ?? 0)/100 * ((this.datqty ?? 0) * (this.datcost ?? 0))) ?? 0
    }
    this.datas.push(dataPush);
    this.dataSource.data = this.datas;
    this.ph = "Ketik disini untuk cari";
    this.term = "";
    this.datqty = undefined;
    this.datcost = undefined;
    this.datdisc = undefined;
    this.dattax = undefined;
    this.datsub = undefined;
  }

  onF(): void {
    this.openDropDown = !this.openDropDown;
  }

  calculate(): void {
    this.datsub =  (this.datqty ?? 0) * (this.datcost ?? 0) +
      ((this.dattax ?? 0)/100 * ((this.datqty ?? 0) * (this.datcost ?? 0))) ?? 0
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateData(): void {
    
  }
}
