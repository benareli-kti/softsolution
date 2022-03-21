import { Component, OnInit, ViewChild } from '@angular/core';
import { Globals } from 'src/app/global';
import { Brand } from 'src/app/models/brand.model';
import { BrandService } from 'src/app/services/brand.service';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { DataFilter, filterOption } from 'src/app/models/datafilter';
import { BrandDialogComponent } from '../dialog/brand-dialog.component';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['../style/main.component.sass']
})
export class BrandComponent implements OnInit {
  brands?: Brand[];
  
  //Add
  brandadd: Brand = {
    description: '',
    active: true
  };
  
  //View
  currentBrand: Brand = {};
  currentIndex = -1;
  searchBrand='';
  
  //Table
  displayedColumns: string[] = ['name'];
  dataSource = new MatTableDataSource<Brand>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  //Dialog Data
  clickedRows = null;
 
  constructor(
    private globals: Globals,
    private brandService: BrandService,
    private logService: LogService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.retrieveBrand();
  }

  retrieveBrand(): void {
    this.brandService.findAllActive()
      .subscribe(brand => {
        this.dataSource.data = brand;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  searchData(): void {
    this.brandService.findByDesc(this.searchBrand)
      .subscribe(brand => {
        this.dataSource.data = brand;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  saveBrand(): void {
    const data = {
      description: this.brandadd.description,
      active: this.brandadd.active
    };
    this.brandService.create(data)
      .subscribe({
        next: (res) => {
          const log = {
            message: "add",
            brand: res.id,
            category: "null",
            product: "null",
            partner: "null",
            warehouse: "null",
            user: this.globals.userid
          };
          this.logService.create(log)
          .subscribe({
            next: (logres) => {
              this.retrieveBrand();
              this.brandadd = {
                description: '',
                active: true
              };
            }
          });
        },
        error: (e) => console.error(e)
      });
  }

  /*applyTblFilter(filterValue: string) {
    this.dataSource.filter = this.selection.trim().toLowerCase()
  }*/

  /*applyTblFilter(ob:MatSelectChange,datafilter:DataFilter) {
    this.filterDictionary.set(datafilter.name,ob.value);
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
  }*/

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(row: Brand) {
    const dialog = this.dialog.open(BrandDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: row
    })
      .afterClosed()
      .subscribe(() => this.retrieveBrand());
  }

}