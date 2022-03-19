import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';

@Component({
  selector: 'app-warehouse-dialog',
  templateUrl: './warehouse-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class WarehouseDialogComponent implements OnInit {
  @Input() currentWarehouse: Warehouse = {
    short: '',
    name: '',
    active: false
  };
  isChecked = false;
  statusActive?: string;

  constructor(
    public dialogRef: MatDialogRef<WarehouseDialogComponent>,
    private warehouseService: WarehouseService,
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
      short: this.data.short,
      name: this.data.name,
      active: this.isChecked
    };
    this.warehouseService.update(this.data.id, data)
      .subscribe({
        next: (res) => {
          this.closeDialog();
        },
        error: (e) => console.error(e)
      });
  }
}
