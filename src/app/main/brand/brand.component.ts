import { Component, OnInit, ViewChild } from '@angular/core';
import { Brand } from 'src/app/models/brand.model';
import { BrandService } from 'src/app/services/brand.service';
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
  styleUrls: ['./brand.component.sass']
})
export class BrandComponent implements OnInit {
  brands?: Brand[];
  isShow = false;
  
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
    private brandService: BrandService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.retrieveBrand();

    this.dataFilters.push({name:'active',options:this.actives,
      defaultValue:this.defaultValue});
    this.dataSource.filterPredicate = function (record,filter) {
      debugger;
      var map = new Map(JSON.parse(filter));
      let isMatch = false;
      for(let [key,value] of map){
        isMatch = (value=="All") || (record[key as keyof Brand] == value); 
        if(!isMatch) return false;
      }
      return isMatch;
    }
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
          this.retrieveBrand();
          this.brandadd = {
            description: '',
            active: true
          };
        },
        error: (e) => console.error(e)
      });
  }

  /*applyTblFilter(filterValue: string) {
    this.dataSource.filter = this.selection.trim().toLowerCase()
  }*/

  applyTblFilter(ob:MatSelectChange,datafilter:DataFilter) {
    this.filterDictionary.set(datafilter.name,ob.value);
    var jsonString = JSON.stringify(Array.from(this.filterDictionary.entries()));
    this.dataSource.filter = jsonString;
  }

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

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

}