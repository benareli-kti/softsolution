import { Component, OnInit, ViewChild } from '@angular/core';
import { Partner } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { DataFilter, filterOption } from 'src/app/models/datafilter';
import { PartnerDialogComponent } from '../dialog/partner-dialog.component';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.sass']
})
export class PartnerComponent implements OnInit {
  partners?: Partner[];
  isShow = false;
  filtered: Object[];
  
  //Add
  partneradd: Partner = {
    code: '',
    name: '',
    phone: '',
    isCustomer: true,
    isSupplier: true,
    active: true
  };
  
  //View
  currentPartner: Partner = {};
  currentIndex = -1;
  searchPartner='';
  
  //Table
  displayedColumns: string[] = ['code', 'name', 'phone'];
  dataSource = new MatTableDataSource<Partner>();
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
    private partnerService: PartnerService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.retrievePartner();

    this.dataFilters.push({name:'active',options:this.actives,
      defaultValue:this.defaultValue});
    this.dataSource.filterPredicate = function (record,filter) {
      debugger;
      var map = new Map(JSON.parse(filter));
      let isMatch = false;
      for(let [key,value] of map){
        isMatch = (value=="All") || (record[key as keyof Partner] == value); 
        if(!isMatch) return false;
      }
      return isMatch;
    }
  }

  retrievePartner(): void {
    this.partnerService.findAllActive()
      .subscribe(partner => {
        partner = partner.filter
        (data => data.active === true)
        this.dataSource.data = partner;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  searchData(): void {
    this.partnerService.findByDesc(this.searchPartner)
      .subscribe(partner => {
        this.dataSource.data = partner;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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

  openDialog(row: Partner) {
    const dialog = this.dialog.open(PartnerDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: row
    })
      .afterClosed()
      .subscribe(() => this.retrievePartner());
  }

  openQuickAdd(): void {
    const dialog = this.dialog.open(PartnerDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
    })
      .afterClosed()
      .subscribe(() => this.retrievePartner());
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

}
