import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  datcode?: string;
  datname?: string;
  datphone?: string;
  statusActive?: string;

  constructor(
    public dialogRef: MatDialogRef<PartnerDialogComponent>,
    private partnerService: PartnerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  ngOnInit() {
    if (this.data){
      this.datcode = this.data.code;
      this.datname = this.data.name;
      this.datphone = this.data.phone;
      if (this.data.active == true){
        this.statusActive = 'true';
        this.isChecked = true;
      } else {
        this.statusActive = 'false';
        this.isChecked = false;
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
    const data = {
      code: this.datcode,
      name: this.datname,
      phone: this.datphone,
      isCustomer: this.isCustomer,
      isSupplier: this.isSupplier,
      active: this.isChecked
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
    const data = {
      code: this.datcode,
      name: this.datname,
      phone: this.datphone,
      isCustomer: this.isCustomer,
      isSupplier: this.isSupplier,
      active: this.isChecked
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
