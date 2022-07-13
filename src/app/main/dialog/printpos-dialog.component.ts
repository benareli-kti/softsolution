import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from 'src/app/models/store.model';
import { StoreService } from 'src/app/services/store.service';
import { Possession } from 'src/app/models/possession.model';
import { PossessionService } from 'src/app/services/possession.service';
import { Pos } from 'src/app/models/pos.model';
import { PosService } from 'src/app/services/pos.service';
import { Posdetail } from 'src/app/models/posdetail.model';
import { PosdetailService } from 'src/app/services/posdetail.service';
import { Payment } from 'src/app/models/payment.model';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-printpos-dialog',
  templateUrl: './printpos-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class PrintposDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<PrintposDialogComponent>,
    private globals: Globals,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  ngOnInit() {
    /*this.productService.get(this.data.product)
      .subscribe(prod => {
        this.productname = prod.name;
        this.botprice = prod.botprice;
    });*/
    //this.checkRole();
    //console.log(this.data);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
