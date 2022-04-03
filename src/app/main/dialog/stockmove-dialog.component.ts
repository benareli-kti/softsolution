import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { FormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from "rxjs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';

import { Stockmove } from 'src/app/models/stockmove.model';
import { StockmoveService } from 'src/app/services/stockmove.service';
import { Qof } from 'src/app/models/qof.model';
import { QofService } from 'src/app/services/qof.service';
import { Qop } from 'src/app/models/qop.model';
import { QopService } from 'src/app/services/qop.service';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Partner } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';

@Component({
  selector: 'app-stockmove-dialog',
  templateUrl: './stockmove-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class StockMoveDialogComponent implements OnInit {
  @Input() currentStockMove: Stockmove = {
    product: '',
    partner: '',
    warehouse: ''
  };
  isChecked = false;
  statusActive?: string;
  datname?: string;
  warehouseid?: any;
  partnerid?: any;
  datqty=0; qin=0; qout=0; qqof=0;

  products?: Product[];
  warehouses?: Warehouse[];
  partners?: Partner[];

  a = 0; b = 0;
  isUpdated = 'update';
  currDescription?: string;
  log = 0;

  //Select Category
  selectedWarehouse: string = "";
  selectedData: { valueWH: string; text: string } = {
    valueWH: "",
    text: ""
  };
  selectedWarehouseControl = new FormControl(this.selectedWarehouse);
  selectedValue(event: MatSelectChange) {
    this.warehouseid = event.value;
  }

  //Select Partner
  selectedPartner: string = "";
  selectedData2: { valuePR: string; text: string } = {
    valuePR: "",
    text: ""
  };
  selectedPartnerControl = new FormControl(this.selectedPartner);
  selectedValue2(event: MatSelectChange) {
    this.partnerid = event.value;
  }

  constructor(
    public dialogRef: MatDialogRef<StockMoveDialogComponent>,
    private globals: Globals,
    private logService: LogService,
    private productService: ProductService,
    private partnerService: PartnerService,
    private warehouseService: WarehouseService,
    private stockmoveService: StockmoveService,
    private qofService: QofService,
    private qopService: QopService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    this.retrieveProduct(this.data);
    this.retrieveData();
  }

  retrieveProduct(id: string) {
    this.productService.get(id)
      .subscribe(prod => {
        this.datname = prod.name;
      });
  }

  retrieveData(): void {
    this.warehouseService.findAllActive()
      .subscribe({
        next: (dataPC) => {
          this.warehouses = dataPC;
        },
        error: (e) => console.error(e)
      });

    this.partnerService.findAllActiveSupplier()
      .subscribe({
        next: (dataB) => {
          this.partners = dataB;
        },
        error: (e) => console.error(e)
      });
  }

  /*createData(): void {
    if(!this.partnerid){
      this.partnerid = "null";
    }
    if(this.datinout=='in'){
      this.qin = this.datqty;
    }else{
      this.qout = this.datqty;
    }
    const dataSM = {
      user: this.globals.userid,
      product: this.data,
      partner: this.partnerid,
      warehouse: this.warehouseid,
      qin: this.qin,
      qout: this.qout
    };
    this.stockmoveService.create(dataSM)
      .subscribe({
        next: (res) => {
          this.qof();
          //this.closeDialog();
        },
        error: (e) => console.error(e)
      });
  }*/
  
  createData(): void{
    if(!this.partnerid){
      this.partnerid = "null";
    }
    const dataSM = {
      user: this.globals.userid,
      product: this.data,
      partner: this.partnerid,
      warehouse: this.warehouseid,
      qin: this.datqty
    };
    this.stockmoveService.create(dataSM)
      .subscribe({
        next: (res) => {
          this.qop();
          //this.closeDialog();
        },
        error: (e) => console.error(e)
      }); 
  }
  
  qop(): void{
    const qop = {
      product: this.data,
      partner: this.partnerid,
      warehouse: this.warehouseid,
      qop: this.datqty
    }
    this.qopService.createUpdate(qop)
      .subscribe({
        next: (res) => {
          this.closeDialog();
        },
        error: (e) => console.error(e)
      })
  }

  /*qof(): void{
    if(!this.partnerid){
      this.partnerid = "null";
    }
    if(this.datinout=='in'){
      this.qqof = this.datqty;
    }else{
      this.qqof = 0-this.datqty;
    }
    const qof = {
      product: this.data,
      partner: this.partnerid,
      warehouse: this.warehouseid,
      qof: this.qqof
    };
    this.qofService.create(qof)
      .subscribe({
        next: (res) => {
          this.closeDialog();
        },
        error: (e) => console.error(e)
      });
  }*/

  closeDialog() {
    this.dialogRef.close();
  }
}
