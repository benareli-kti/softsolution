import { Component, OnInit, ViewChild } from '@angular/core';
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';
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
  styleUrls: ['./warehouse.component.sass']
})
export class WarehouseComponent implements OnInit {
  warehouses?: Warehouse[];
  isShow = false;
  filtered: Object[];
  
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

  //Filter Data
  actives=['All','true','false'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  selection: any;

  //New
  defaultValue = "All";
  dataFilters: DataFilter[]=[];
  filterDictionary= new Map<string,string>();
  //one is boolean , one is string

  //Dialog Data
  clickedRows = null;
 
  constructor(
    private warehouseService: WarehouseService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.retrieveWarehouse();

    this.dataFilters.push({name:'active',options:this.actives,
      defaultValue:this.defaultValue});
    this.dataSource.filterPredicate = function (record,filter) {
      debugger;
      var map = new Map(JSON.parse(filter));
      let isMatch = false;
      for(let [key,value] of map){
        isMatch = (value=="All") || (record[key as keyof Warehouse] == value); 
        if(!isMatch) return false;
      }
      return isMatch;
    }
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
      active: this.warehouseadd.active
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

  applyTblFilter(ob:MatSelectChange,datafilter:DataFilter) {
    this.filterDictionary.set(datafilter.name,ob.value);
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
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

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

}