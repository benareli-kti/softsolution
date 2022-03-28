import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, FormControl } from '@angular/forms';
import { Observable, of } from "rxjs";
import { Globals } from 'src/app/global';
import { Product } from 'src/app/models/product.model';
import { Productcat } from 'src/app/models/productcat.model';
import { Brand } from 'src/app/models/brand.model';
import { ProductService } from 'src/app/services/product.service';
import { ProductCatService } from 'src/app/services/product-cat.service';
import { BrandService } from 'src/app/services/brand.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { DataFilter, filterOption } from 'src/app/models/datafilter';
import { ProductDialogComponent } from '../dialog/product-dialog.component';
import { StockMoveDialogComponent } from '../dialog/stockmove-dialog.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['../style/main.component.sass']
})
export class ProductComponent implements OnInit {
  products?: Product[];
  productcats?: Productcat[];
  brands?: Brand[];
  isShow = false;
  categoryid?: any;
  brandid?: any;
  isIU = false;
  isIM = false;
  isAdm = false;

  filterCat: string = '';
  filterBrand: string = '';
  
  //View
  currentProduct: Product = {};
  searchProd='';

  //Table
  displayedColumns: string[] = 
  ['name', 'description', 'qty', 'listprice',
  'category', 'brand', 'stock'];
  dataSource = new MatTableDataSource<Product>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  //Dialog Data
  clickedRows = null;

  constructor(
    private globals: Globals,
    private productService: ProductService,
    private productCatService: ProductCatService,
    private brandService: BrandService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.checkRole();
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="inventory_user") this.isIU=true;
      if(this.globals.roles![x]=="inventory_manager") this.isIM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    this.retrieveProduct();
  }

  retrieveProduct(): void {
    /*prod = prod.filter
    (data => data.active === true)*/

    if(this.isIM || this.isAdm){
      console.log("ALL");
      this.productService.getAll()
        .subscribe(prod => {
          this.products = prod;
          this.dataSource.data = prod;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      });
    }else{
      console.log("TERBATAS");
      this.productService.findAllActive()
        .subscribe(prod => {
          this.products = prod;
          this.dataSource.data = prod;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      });
    }

    this.productCatService.findAllActive()
      .subscribe({
        next: (dataPC) => {
          this.productcats = dataPC;
        },
        error: (e) => console.error(e)
    });

    this.brandService.findAllActive()
      .subscribe({
        next: (dataB) => {
          this.brands = dataB;
        },
        error: (e) => console.error(e)
    });
  }

  searchActive(): void {
    this.dataSource.data = this.products!.filter(prod => prod.active === true);
  }
  searchInactive(): void {
    this.dataSource.data = this.products!.filter(prod => prod.active === false);
  }

  applyCatFilter(event: MatSelectChange) {
    //this.dataSource.data = this.products!.filter(prod => prod.category._id === event.value);
    this.filterCat = event.value;
    this.filter();
  }

  applyBrandFilter(event: MatSelectChange) {
    this.filterBrand = event.value;
    this.filter();
  }

  filter(): void {
    console.log(this.filterCat);
    if(this.filterCat===''&&this.filterBrand===''){
      console.log("KONTOL");
      this.retrieveProduct();
    }else if(this.filterCat===''){
      this.dataSource.data = this.products!
        .filter(prod => 
          prod.brand._id === this.filterBrand
      );
    }else if(this.filterBrand===''){
      this.dataSource.data = this.products!
        .filter(prod => 
          prod.category._id === this.filterCat
      );
    }else{
      this.dataSource.data = this.products!
        .filter(prod => 
          prod.brand._id === this.filterBrand &&
          prod.category._id === this.filterCat
      );
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(id: string) {
    const dialog = this.dialog.open(ProductDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: id
    })
      .afterClosed()
      .subscribe(() => this.retrieveProduct());
  }

  openStockDialog(id: string) {
    const dialog = this.dialog.open(StockMoveDialogComponent, {
      width: '75%',
      height: '60%',
      disableClose: true,
      data: id
    })
      .afterClosed()
      .subscribe(() => this.retrieveProduct());
  }

  openQuickAdd(): void {
    const dialog = this.dialog.open(ProductDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
    })
      .afterClosed()
      .subscribe(() => this.retrieveProduct());
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

}