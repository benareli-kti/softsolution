import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { FormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from "rxjs";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';

import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Productcat } from 'src/app/models/productcat.model';
import { ProductCatService } from 'src/app/services/product-cat.service';
import { Brand } from 'src/app/models/brand.model';
import { BrandService } from 'src/app/services/brand.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class ProductDialogComponent implements OnInit {
  @Input() currentProd: Product = {
    sku: '',
    name: '',
    category: '',
    brand: '',
    isStock: false,
    active: false
  };
  isChecked = false;
  isStock = false;
  isNew = false;
  datid?: string;
  datsku?: string;
  datname?: string;
  datdesc?: string;
  datlprice?: number;
  datbprice?: number;
  datcost?: number;
  datisstock?: string;
  statusActive?: string;

  products?: Product[];
  productcats?: Productcat[];
  brands?: Brand[];
  categoryid?: any;
  brandid?: any;

  a = 0; b = 0;
  isUpdated = 'update';
  log = 0;

  //Add
  productadd: Product = {
    sku: '',
    name: '',
    description: '',
    category: '',
    brand: '',
    isStock: true,
    active: true
  };

  //Select Category
  selectedCategory: string = "";
  selectedData: { valueCat: string; text: string } = {
    valueCat: "",
    text: ""
  };
  selectedCategoryControl = new FormControl(this.selectedCategory);
  selectedValue(event: MatSelectChange) {
    this.categoryid = event.value;
  }

  //Select Brand
  selectedBrand: string = "";
  selectedData2: { valueBrand: string; textBrand: string } = {
    valueBrand: "",
    textBrand: ""
  };
  selectedBrandControl = new FormControl(this.selectedBrand);
  selectedValue2(event: MatSelectChange) {
    this.brandid = event.value;
  }

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    private productService: ProductService,
    private brandService: BrandService,
    private productCatService: ProductCatService,
    private globals: Globals,
    private logService: LogService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  ngOnInit() {
    if (this.data){
      this.datid = this.data.id;
      this.datsku = this.data.sku;
      this.datname = this.data.name;
      this.datdesc = this.data.description;
      this.datlprice = this.data.listprice;
      this.datbprice = this.data.botprice;
      this.datcost = this.data.cost;
      if (this.data.active == true){
        this.statusActive = 'true';
        this.isChecked = true;
        this.a = 0;
      } else {
        this.statusActive = 'false';
        this.isChecked = false;
        this.a = 1;
      }
      if (this.data.isStock == true){
        this.datisstock = 'true';
      }else{
        this.datisstock = 'false';
      }
      if (this.data.category){
        this.selectedCategory = this.data.category._id;
      }else{
        this.selectedCategory = "";
      }
      if (this.data.brand){
        this.selectedBrand = this.data.brand._id;
      }else{
        this.selectedBrand = "";
      }
    } else{
      this.isNew = true;
      this.isChecked = true;
      this.datisstock = 'true';
      this.statusActive = 'true';
      this.datdesc = "";
      this.datsku = "";
      this.datname = "";
    }
    this.retrieveProduct();
    this.retrieveLog();
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

  onStockChange(vals: string) {
    this.datisstock = vals;
    if (this.datisstock == 'true'){
      this.isStock = true;
    }else{
      this.isStock = false;
    }
  }

  retrieveProduct(): void {
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

  retrieveLog(): void {
    this.logService.getAll()
      .subscribe({
        next: (logPR) => {
          logPR = logPR.filter
          (dataPR => dataPR.product === this.datid)
          this.log = logPR.length;
        },
        error: (e) => console.error(e)
      })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateData(): void {
    if (this.a+this.b==4){this.isUpdated = 'deactivate'};
    if (this.a+this.b==3){this.isUpdated = 'activate'};
    if (this.datsku != this.data.sku){
      this.isUpdated = this.isUpdated + ", from " 
      + this.data.sku + " to " + this.datsku;
    }
    if (this.datname != this.data.name){
      this.isUpdated = this.isUpdated + ", from " 
      + this.data.name + " to " + this.datname;
    }
    if (this.datdesc != this.data.description){
      this.isUpdated = this.isUpdated + ", from " 
      + this.data.description + " to " + this.datdesc;
    }
    if (this.datlprice != this.data.listprice){
      this.isUpdated = this.isUpdated + ", from " 
      + this.data.listprice + " to " + this.datlprice;
    }
    if (this.datbprice != this.data.botprice){
      this.isUpdated = this.isUpdated + ", from " 
      + this.data.botprice + " to " + this.datbprice;
    }
    if (this.datcost != this.data.cost){
      this.isUpdated = this.isUpdated + ", from " 
      + this.data.cost + " to " + this.datcost;
    }
    const data = {
      sku: this.datsku,
      name: this.datname,
      description: this.datdesc,
      listprice: this.datlprice,
      botprice: this.datbprice,
      cost: this.datcost,
      isStock: this.isStock,
      category: this.categoryid,
      brand: this.brandid,
      active: this.isChecked
    };
    this.productService.update(this.data.id, data)
      .subscribe({
        next: (res) => {
          const log = {
            message: this.isUpdated,
            brand: "null",
            category: "null",
            product: this.datid,
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

  createData(): void {
    console.log(this.isStock);
    const data = {
      sku: this.datsku,
      name: this.datname,
      description: this.datdesc,
      listprice: this.datlprice,
      botprice: this.datbprice,
      cost: this.datcost,
      isStock: this.isStock,
      category: this.categoryid,
      brand: this.brandid,
      active: this.isChecked
    };
    this.productService.create(data)
      .subscribe({
        next: (res) => {
          const log = {
            message: "add",
            brand: "null",
            category: "null",
            product: res.id,
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
