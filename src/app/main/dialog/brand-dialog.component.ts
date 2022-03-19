import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Brand } from 'src/app/models/brand.model';
import { BrandService } from 'src/app/services/brand.service';

@Component({
  selector: 'app-brand-dialog',
  templateUrl: './brand-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class BrandDialogComponent implements OnInit {
  @Input() currentBrand: Brand = {
    description: '',
    active: false
  };
  isChecked = false;
  statusActive?: string;

  constructor(
    public dialogRef: MatDialogRef<BrandDialogComponent>,
    private brandService: BrandService,
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
      description: this.data.description,
      active: this.isChecked
    };
    this.brandService.update(this.data.id, data)
      .subscribe({
        next: (res) => {
          this.closeDialog();
        },
        error: (e) => console.error(e)
      });
  }
}
