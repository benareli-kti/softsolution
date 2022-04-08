import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class PaymentDialogComponent implements OnInit {
  /*@Input() currentPayment: Brand = {
    description: '',
    active: false
  };*/
  isChecked = false;
  isTU = false;
  isTM = false;
  isAdm = false;
  isRes = false;
  isPay2 = false;
  colorchange?: string = 'black';
  borderchange?: string = '1px solid #000';
  borderchange2?: string = '1px solid #eee';
  pay1s: boolean = true;
  pay2s: boolean = false;
  payment?: string = '0';
  payment2?: string = '0';
  change?: string;
  changeNum: number=0;

  //disc
  pay1Type: string='tunai';
  pay2Type: string='tunai';

  constructor(
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    private _snackBar: MatSnackBar,
    private globals: Globals,
    private logService: LogService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    /*if (this.data.active == true){
        this.statusActive = 'true';
        this.isChecked = true;
        this.a = 0;
      } */
    this.countChange();
    this.checkRole();
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="trans_user") this.isTU=true;
      if(this.globals.roles![x]=="trans_manager") this.isTM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isTM || !this.isAdm) this.isRes = true;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onPay1Change(val: string) {
    this.pay1Type = val;
  }

  onPay2Change(val: string) {
    this.pay2Type = val;
  }

  pay1(): void {
    this.pay1s = true; this.pay2s = false;
    this.borderchange = '1px solid #000';
    this.borderchange2 = '1px solid #eee';
  }

  pay2(): void {
    this.pay1s = false; this.pay2s = true;
    this.borderchange = '1px solid #eee';
    this.borderchange2 = '1px solid #000';
  }

  mode2(): void {
    this.isPay2 = !this.isPay2;
    if(this.payment2 != '0'){
      this.payment2 = '0';
      this.countChange();
    }
  }

  press(key: string) {
    if(this.pay1s){
      if(this.payment == '0'){
        this.payment = '';
      }
      this.payment += key;
      this.countChange();
    }else{
      if(this.payment2 == '0'){
        this.payment2 = '';
      }
      this.payment2 += key;
      this.countChange();
    }
  }

  countChange(): void {
    this.changeNum = (Number(this.payment) + Number(this.payment2)) - this.data.total;
    if (this.changeNum>=0) this.colorchange = '#009B77';
    else this.colorchange = 'red';
    this.change = this.changeNum.toString();
    
  }
}
