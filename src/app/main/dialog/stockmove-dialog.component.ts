import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { FormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from "rxjs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  datqty=0; qin=0; qout=0; qqof=0; datcost=0;

  products?: Product[];
  warehouses?: Warehouse[];
  partners?: Partner[];

  a = 0; b = 0;
  isUpdated = 'update';
  currDescription?: string;
  log = 0;

  constructor(
    public dialogRef: MatDialogRef<StockMoveDialogComponent>,
    private _snackBar: MatSnackBar,
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
          this.warehouseid = dataPC[0].id;
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
  
  createData(): void{
    if(!this.warehouseid || this.warehouseid == null){
      this._snackBar.open("Gudang (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      const dataSM = {
        user: this.globals.userid,
        product: this.data,
        partner: this.partnerid ?? "null",
        warehouse: this.warehouseid,
        qin: this.datqty ?? 0,
        cost: this.datcost ?? 0,
        meth: this.globals.cost_general
      };
      this.stockmoveService.create(dataSM)
        .subscribe({
          next: (res) => {
            if(!this.globals.cost_general) this.qop();
            else this.closeDialog();
          },
          error: (e) => console.error(e)
        }); 
    }
  }
  
  qop(): void{
    const qop = {
      product: this.data,
      partner: this.partnerid,
      warehouse: this.warehouseid,
      qop: this.datqty,
      cost: this.datcost
    }
    this.qopService.createUpdate(qop)
      .subscribe({
        next: (res) => {
          this.closeDialog();
        },
        error: (e) => console.error(e)
      })
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
