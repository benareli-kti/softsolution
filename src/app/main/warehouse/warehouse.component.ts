import { Component, OnInit, ViewChild } from '@angular/core';
import { Globals } from 'src/app/global';
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { DataFilter, filterOption } from 'src/app/models/datafilter';
import { WarehouseDialogComponent } from '../dialog/warehouse-dialog.component';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['../style/main.component.sass']
})
export class WarehouseComponent implements OnInit {
  warehouses?: Warehouse[];
  
  //Add
  warehouseadd: Warehouse = {
    name: '',
    short: '',
    active: true
  };
  
  //View
  currentWarehouse: Warehouse = {};
  currentIndex = -1;
  searchWarehouse='';
  
  //Table
  displayedColumns: string[] = ['short', 'name'];
  dataSource = new MatTableDataSource<Warehouse>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  //Dialog Data
  clickedRows = null;
 
  constructor(
    private globals: Globals,
    private warehouseService: WarehouseService,
    private logService: LogService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.retrieveWarehouse();
  }

  retrieveWarehouse(): void {
    this.warehouseService.findAllActive()
      .subscribe(warehouse => {
        this.dataSource.data = warehouse;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  searchData(): void {
    this.warehouseService.findByDesc(this.searchWarehouse)
      .subscribe(warehouse => {
        this.dataSource.data = warehouse;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  saveWarehouse(): void {
    const data = {
      name: this.warehouseadd.name,
      short: this.warehouseadd.short,
      active: this.warehouseadd.active,
      user: this.globals.userid
    };
    this.warehouseService.create(data)
      .subscribe({
        next: (res) => {
          this.retrieveWarehouse();
          this.warehouseadd = {
            name: '',
            short: '',
            active: true
          };
        },
        error: (e) => console.error(e)
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(row: Warehouse) {
    const dialog = this.dialog.open(WarehouseDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: row
    })
      .afterClosed()
      .subscribe(() => this.retrieveWarehouse());
  }

}