import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Purchase } from 'src/app/models/purchase.model';
import { PurchaseService } from 'src/app/services/purchase.service';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';
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

  partners?: Partner[];
  warehouses?: Warehouse[];
  supplierString?: string;
  warehouseString?: string;

  a = 0; b = 0;
  isUpdated = 'update';
  currDescription?: string;
  log = 0;

  constructor(
    public dialogRef: MatDialogRef<PurchaseDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private logService: LogService,
    private partnerService: PartnerService,
    private warehouseService: WarehouseService,
    private purchaseService: PurchaseService,
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
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateData(): void {
    /*if(!this.data.description || this.data.description == null){
      this._snackBar.open("Isian (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      if (this.a+this.b==4){this.isUpdated = 'deactivate'};
      if (this.a+this.b==3){this.isUpdated = 'activate'};
      if (this.currDescription != this.data.description){
        this.isUpdated = this.isUpdated + " from " + this.currDescription + 
        " to " + this.data.description;
      }
      const data = {
        message: this.isUpdated,
        description: this.data.description,
        active: this.isChecked,
        user: this.globals.userid
      };
      this.brandService.update(this.data.id, data)
        .subscribe({
          next: (res) => {
            this.closeDialog();
          },
          error: (e) => console.error(e)
        });
    }*/
  }
}
