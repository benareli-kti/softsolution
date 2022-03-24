import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { FormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from "rxjs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  isStock = true;
  isNew = false;
  bbigger = false;
  oriid?: string;
  orisku?: string;
  oriname?: string;
  oridesc?: string;
  orilprice?: number;
  oribprice?: number;
  oricost?: number;

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
      this.checkData(this.data);
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

  checkData(id: any){
    this.productService.get(id)
      .subscribe(prod => {
        this.datid = prod.id;
        this.datsku = prod.sku;
        this.orisku = prod.sku;
        this.datname = prod.name;
        this.oriname = prod.name;
        this.datdesc = prod.description;
        this.oridesc = prod.description;
        this.datlprice = prod.listprice;
        this.orilprice = prod.listprice;
        this.datbprice = prod.botprice;
        this.oribprice = prod.botprice;
        this.datcost = prod.cost;
        this.oricost = prod.cost;
        if (prod.active == true){
          this.statusActive = 'true';
          this.isChecked = true;
          this.a = 0;
        } else {
          this.statusActive = 'false';
          this.isChecked = false;
          this.a = 1;
        }
        if (prod.isStock == true){
          this.datisstock = 'true';
          this.isStock = true;
        }else{
          this.datisstock = 'false';
          this.isStock = false;
        }
        if (prod.category){
          this.selectedCategory = prod.category._id;
        }else{
          this.selectedCategory = "";
        }
        if (prod.brand){
          this.selectedBrand = prod.brand._id;
        }else{
          this.selectedBrand = "";
        }
    });
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
          (dataPR => dataPR.product === this.data)
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
    if (this.datsku != this.orisku){
      this.isUpdated = this.isUpdated + ", from " 
      + this.orisku + " to " + this.datsku;
    }
    if (this.datname != this.oriname){
      this.isUpdated = this.isUpdated + ", from " 
      + this.oriname + " to " + this.datname;
    }
    if (this.datdesc != this.oridesc){
      this.isUpdated = this.isUpdated + ", from " 
      + this.oridesc + " to " + this.datdesc;
    }
    if (this.datlprice != this.orilprice){
      this.isUpdated = this.isUpdated + ", from " 
      + this.orilprice + " to " + this.datlprice;
    }
    if (this.datbprice != this.oribprice){
      this.isUpdated = this.isUpdated + ", from " 
      + this.oribprice + " to " + this.datbprice;
    }
    if (this.datcost != this.oricost){
      this.isUpdated = this.isUpdated + ", from " 
      + this.oricost + " to " + this.datcost;
    }
    const dataProd = {
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
    this.productService.update(this.data, dataProd)
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
    if(this.datbprice > this.datlprice){
      this.bbigger = true;
    }else{
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
        qoh: 0,
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
}
