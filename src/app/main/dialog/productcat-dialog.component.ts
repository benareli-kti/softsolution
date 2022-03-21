import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Productcat } from 'src/app/models/productcat.model';
import { ProductCatService } from 'src/app/services/product-cat.service';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-productcat-dialog',
  templateUrl: './productcat-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class ProductcatDialogComponent implements OnInit {
  @Input() currentProdCat: Productcat = {
    catid: '',
    description: '',
    active: false
  };
  isChecked = false;
  statusActive?: string;

  a = 0; b = 0;
  isUpdated = 'update';
  currCatId?: string;
  currDescription?: string;
  log = 0;

  constructor(
    public dialogRef: MatDialogRef<ProductcatDialogComponent>,
    private globals: Globals,
    private logService: LogService,
    private productCatService: ProductCatService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  ngOnInit() {
    if (this.data.active == true){
        this.statusActive = 'true';
        this.isChecked = true;
        this.a = 0;
      } else {
        this.statusActive = 'false';
        this.isChecked = false;
        this.a = 1;
      }
    this.currCatId = this.data.catid;
    this.currDescription = this.data.description;
    this.retrieveLog();
  }

  retrieveLog(): void {
    this.logService.getAll()
      .subscribe({
        next: (logPR) => {
          logPR = logPR.filter
          (dataPR => dataPR.category === this.data.id)
          console.log(logPR);
          this.log = logPR.length;
        },
        error: (e) => console.error(e)
      })
  }

  onValChange(val: string) {
    this.statusActive = val;
    if (this.statusActive == 'true'){
      this.isChecked = true;
      this.b = 2;
    }else{
      this.isChecked = false;
      this.b = 4;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateData(): void {
    if (this.a+this.b==4){this.isUpdated = 'deactivate'};
    if (this.a+this.b==3){this.isUpdated = 'activate'};
    if (this.currDescription != this.data.description){
      this.isUpdated = this.isUpdated + ", from " 
      + this.currDescription + " to " + this.data.description;
    }
    if (this.currCatId != this.data.catid){
      this.isUpdated = this.isUpdated + ", from " 
      + this.currCatId + " to " + this.data.catid;
    }
    const data = {
      catid: this.data.catid,
      description: this.data.description,
      active: this.isChecked
    };
    this.productCatService.update(this.data.id, data)
      .subscribe({
        next: (res) => {
          const log = {
            message: this.isUpdated,
            brand: "null",
            category: this.data.id,
            product: "null",
            partner: "null",
            warehouse: "null",
            user: this.globals.userid
          };
          this.logService.create(log)
          .subscribe({
            next: (logres) => {
              this.closeDialog();
            }
          });
        },
        error: (e) => console.error(e)
      });
  }
}
