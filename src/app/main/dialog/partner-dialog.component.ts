import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';

import { Partner } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-partner-dialog',
  templateUrl: './partner-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class PartnerDialogComponent implements OnInit {
  @Input() currentPartner: Partner = {
    code: '',
    name: '',
    phone: '',
    isCustomer: false,
    isSupplier: false,
    active: true
  };
  isChecked = false;
  isCustomer = false;
  isSupplier = false;
  isNew = false;
  datid?: string;
  datcode?: string;
  datname?: string;
  datphone?: string;
  statusActive?: string;

  a = 0; b = 0;
  c = 0; d = 0;
  isUpdated = 'update';
  log = 0;

  constructor(
    public dialogRef: MatDialogRef<PartnerDialogComponent>,
    private partnerService: PartnerService,
    private globals: Globals,
    private logService: LogService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  ngOnInit() {
    if (this.data){
      this.datid = this.data.id;
      this.datcode = this.data.code;
      this.datname = this.data.name;
      this.datphone = this.data.phone;
      if (this.data.active == true){
        this.statusActive = 'true';
        this.isChecked = true;
        this.a = 0;
      } else {
        this.statusActive = 'false';
        this.isChecked = false;
        this.a = 1;
      }
      if (this.data.isCustomer == true){
        this.isCustomer = true;
      }
      if (this.data.isSupplier == true){
        this.isSupplier = true;
      }
    } else{
      this.isNew = true;
      this.statusActive = 'true';
      this.datcode = "";
      this.datname = "";
      this.datphone = "";
    }
    this.retrieveLog();
  }

  retrieveLog(): void {
    this.logService.getAll()
      .subscribe({
        next: (logPA) => {
          logPA = logPA.filter
          (dataPR => dataPR.partner === this.datid)
          console.log(logPA);
          this.log = logPA.length;
        },
        error: (e) => console.error(e)
      })
  }

  onValChange(val: string) {
    this.statusActive = val;
    if (this.statusActive == 'true'){
      this.isChecked = true;
    }else{
      this.isChecked = false;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateData(): void {
    if (this.a+this.b==4){this.isUpdated = 'deactivate'};
    if (this.a+this.b==3){this.isUpdated = 'activate'};
    if (this.datcode != this.data.code){
      this.isUpdated = this.isUpdated + ", from " 
      + this.data.code + " to " + this.datcode;
    }
    if (this.datname != this.data.name){
      this.isUpdated = this.isUpdated + ", from " 
      + this.data.name + " to " + this.datname;
    }
    if (this.datphone != this.data.phone){
      this.isUpdated = this.isUpdated + ", from " 
      + this.data.phone + " to " + this.datphone;
    }
    const data = {
      code: this.datcode,
      name: this.datname,
      phone: this.datphone,
      isCustomer: this.isCustomer,
      isSupplier: this.isSupplier,
      active: this.isChecked,
      message: this.isUpdated,
      user: this.globals.userid
    };
    this.partnerService.update(this.data.id, data)
      .subscribe({
        next: (res) => {
          this.closeDialog();
        },
        error: (e) => console.error(e)
      });
  }

  createData(): void {
    this.isChecked = true;
    const data = {
      code: this.datcode,
      name: this.datname,
      phone: this.datphone,
      isCustomer: this.isCustomer,
      isSupplier: this.isSupplier,
      active: this.isChecked,
      user: this.globals.userid
    };
    this.partnerService.create(data)
      .subscribe({
        next: (res) => {
          this.closeDialog();
        },
        error: (e) => console.error(e)
      });
  }
}
