import { Component, OnInit, Inject, Optional, Input } from '@angular/core';
import { Globals } from 'src/app/global';
import { FormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from "rxjs";
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Log } from 'src/app/models/log.model';
import { LogService } from 'src/app/services/log.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Productcat } from 'src/app/models/productcat.model';
import { ProductCatService } from 'src/app/services/product-cat.service';
import { Brand } from 'src/app/models/brand.model';
import { BrandService } from 'src/app/services/brand.service';
import { Partner } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';
import { Tax } from 'src/app/models/tax.model';
import { TaxService } from 'src/app/services/tax.service';
import { Qop } from 'src/app/models/qop.model';
import { QopService } from 'src/app/services/qop.service';

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
  oribarc?: string;
  orilprice?: number;
  oribprice?: number;
  oricost?: number;
  oritaxin?: string;
  oritaxout?: string;
  oriimage?: string;
  orimin?: number;
  orimax?: number;

  imageData: string;

  datid?: string;
  datsku?: string;
  datname?: string;
  datdesc?: string;
  datbarcode?: string;
  datlprice?: number;
  datbprice?: number;
  datcost?: number;
  datisstock?: string;
  datmin?: number;
  datmax?: number;
  statusActive?: string;
  isIU = false;
  isIM = false;
  isAdm = false;
  isRes = false;

  products?: Product[];
  productcats?: Productcat[];
  brands?: Brand[];
  partners?: Partner[];
  taxs?: Tax[];
  categoryid?: any;
  brandid?: any;
  partnerid?: any;

  a = 0; b = 0;
  isUpdated = 'update';
  log = 0;

  //Add
  productadd: Product = {
    sku: '',
    name: '',
    description: '',
    category: '',
    supplier: '',
    brand: '',
    taxin: '',
    taxout: '',
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

  //Select Brand
  selectedPartner: string = "";
  selectedData3: { valuePartner: string; textPartner: string } = {
    valuePartner: "",
    textPartner: ""
  };
  selectedPartnerControl = new FormControl(this.selectedPartner);
  selectedValue3(event: MatSelectChange) {
    this.partnerid = event.value;
  }

  taxInString?: string;
  taxOutString?: string;

  //Table
  qops?: Qop[]; 
  displayedColumns: string[] = 
  ['warehouse', 'partner', 'qty'];
  dataSource = new MatTableDataSource<Qop>();

  //Dialog Data
  clickedRows = null; 

  //Upload File
  fileName: string;
  selectedFiles?: FileList;
  progressInfos: any[] = [];
  message: string[] = [];

  previews: string[] = [];
  imageInfos?: Observable<any>;

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    private _snackBar: MatSnackBar,
    private uploadService: FileUploadService,
    private productService: ProductService,
    private brandService: BrandService,
    private productCatService: ProductCatService,
    private partnerService: PartnerService,
    private taxService: TaxService,
    private qopService: QopService,
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
    this.imageInfos = this.uploadService.getFiles();
    this.retrieveProduct();
    this.checkRole();
    
    this.imageInfos = this.uploadService.getFiles();
  }

  onValueChange(file: File[]) {
    console.log("File changed!");
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="inventory_user") this.isIU=true;
      if(this.globals.roles![x]=="inventory_manager") this.isIM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    if(!this.isIM || !this.isAdm) this.isRes = true;
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
        this.datbarcode = prod.barcode;
        this.oribarc = prod.barcode;
        this.datlprice = prod.listprice;
        this.orilprice = prod.listprice;
        this.datbprice = prod.botprice;
        this.oribprice = prod.botprice;
        this.datcost = prod.cost;
        this.oricost = prod.cost;
        this.datmin = prod.min;
        this.orimin = prod.min;
        this.datmax = prod.max;
        this.orimax = prod.max;
        this.oritaxin = prod.taxin;
        this.oritaxout = prod.taxout;
        this.oriimage = prod.image;
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
          this.categoryid = prod.category._id;
        }else{
          this.selectedCategory = "";
        }
        if (prod.brand){
          this.selectedBrand = prod.brand._id;
          this.brandid = prod.brand._id;
        }else{
          this.selectedBrand = "";
        }
        if (prod.supplier){
          this.selectedPartner = prod.supplier._id;
          this.partnerid = prod.supplier._id;
        }else{
          this.selectedPartner = "";
        }
        this.taxInString = prod.taxin;
        this.taxOutString = prod.taxout;
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

    this.taxService.getAll()
      .subscribe({
        next: (tax) => {
          this.taxs = tax;
        },
        error: (e) => console.error(e)
      });

    this.qopService.findByProduct(this.data)
      .subscribe({
        next: (dataQop) => {
          this.dataSource.data = dataQop;
        },
        error: (e) => console.error(e)
      })

    this.partnerService.findAllActiveSupplier()
      .subscribe({
        next: (dataSup) => {
          this.partners = dataSup;
        },
        error: (e) => console.error(e)
      })
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

  checkImage(): void {
    if (this.selectedFiles){

    }else {
      this.checkBigger();
    }
  }

  checkBigger(): void {
    if(Number(this.datbprice) > Number(this.datlprice)){
      this.bbigger = true;
    }else{
      if (this.isNew){
        this.createData();
      }else{
        this.updateData();
      }
    }
  }

  selectFiles(event: any): void {
    this.message = [];
    this.selectedFiles = event.target.files;

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  upload(idx: number, file: File): void {
    if (file) {
      this.uploadService.upload(file).subscribe({
        next: (event: any) => {
          const msg = 'Uploaded the file successfully: ' + file.name;
          this.fileName = file.name;
          this.message.push(msg);
          this.imageInfos = this.uploadService.getFiles();
        },
        error: (err: any) => {
          const msg = 'Could not upload the file: ' + file.name;
          this.message.push(msg);
        }});
    }
  }

  uploadFiles(): void {
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  updateData(): void {
    if (!this.datname || this.datname == null
      || !this.datlprice || this.datlprice == null
      || !this.selectedCategory || this.selectedCategory == null){
      this._snackBar.open("Field (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      if(!this.fileName){this.fileName = this.oriimage!};
      if(this.a+this.b==4){this.isUpdated = 'deactivate'};
      if(this.a+this.b==3){this.isUpdated = 'activate'};
      if(this.datsku != this.orisku){
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
      if (this.datbarcode != this.oribarc){
        this.isUpdated = this.isUpdated + ", from " 
        + this.oribarc + " to " + this.datbarcode;
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
      if (this.taxInString != this.oritaxin){
        this.isUpdated = this.isUpdated + ", from " 
        + this.oritaxin + " to " + this.taxInString;
      }
      if (this.taxOutString != this.oritaxout){
        this.isUpdated = this.isUpdated + ", from " 
        + this.oritaxout + " to " + this.taxOutString;
      }
      if (this.datmin != this.orimin){
        this.isUpdated = "Min:" + this.isUpdated + ", from " 
        + this.orimin + " to " + this.datmin;
      }
      if (this.datmax != this.orimax){
        this.isUpdated = "Max:" + this.isUpdated + ", from " 
        + this.orimax + " to " + this.datmax;
      }
      if (this.fileName != this.oriimage){
        this.isUpdated = this.isUpdated + ", from " 
        + this.oriimage + " to " + this.fileName;
      }
      const dataProd = {
        sku: this.datsku,
        name: this.datname,
        description: this.datdesc,
        barcode: this.datbarcode,
        listprice: this.datlprice,
        botprice: this.datbprice,
        cost: this.datcost,
        isStock: this.isStock,
        category: this.categoryid,
        taxin: this.taxInString,
        taxout: this.taxOutString,
        image: this.fileName,
        brand: this.brandid,
        min: this.datmin,
        max: this.datmax,
        supplier: this.partnerid,
        active: this.isChecked,
        message: this.isUpdated,
        user: this.globals.userid
      };
      this.productService.update(this.data, dataProd)
        .subscribe({
          next: (res) => {
            this.closeDialog();
          },
          error: (e) => console.error(e)
        });
    }
  }

  createData(): void {
    if (!this.datname || this.datname == null
      || !this.datlprice || this.datlprice == null
      || !this.selectedCategory || this.selectedCategory == null){
      this._snackBar.open("Field (*) tidak boleh kosong!", "Tutup", {duration: 5000});
    }else{
      const data = {
        sku: this.datsku,
        name: this.datname,
        description: this.datdesc,
        barcode: this.datbarcode,
        listprice: this.datlprice,
        botprice: this.datbprice,
        cost: this.datcost,
        isStock: this.isStock,
        category: this.categoryid,
        brand: this.brandid,
        taxin: this.taxInString,
        taxout: this.taxOutString,
        image: 'default.png',
        qoh: 0,
        min: this.datmin,
        max: this.datmax,
        supplier: this.partnerid,
        active: this.isChecked,
        user: this.globals.userid
      };
      this.productService.create(data)
        .subscribe({
          next: (res) => {
            this.closeDialog();
          },
          error: (e) => console.error(e)
      });
    }
  }
}
