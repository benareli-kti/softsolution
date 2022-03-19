import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Productcat } from 'src/app/models/productcat.model';
import { ProductCatService } from 'src/app/services/product-cat.service';

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

  constructor(
    public dialogRef: MatDialogRef<ProductcatDialogComponent>,
    private productCatService: ProductCatService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}


  ngOnInit() {
    if (this.data.active == true){
        this.statusActive = 'true';
        this.isChecked = true;
      } else {
        this.statusActive = 'false';
        this.isChecked = false;
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
      catid: this.data.catid,
      description: this.data.description,
      active: this.isChecked
    };
    this.productCatService.update(this.data.id, data)
      .subscribe({
        next: (res) => {
          this.closeDialog();
        },
        error: (e) => console.error(e)
      });
  }
}
