import { Component, AfterContentInit, EventEmitter, 
  ViewChild, Output, OnInit, HostListener } from '@angular/core';
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatGridList } from '@angular/material/grid-list';

import { PosdetailDialogComponent } from '../dialog/posdetail-dialog.component';

import { Id } from 'src/app/models/id.model';
import { IdService } from 'src/app/services/id.service';
import { Product } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Productcat } from 'src/app/models/productcat.model';
import { ProductCatService } from 'src/app/services/product-cat.service';
import { Brand } from 'src/app/models/brand.model';
import { BrandService } from 'src/app/services/brand.service';
import { Partner } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';
import { Pos } from 'src/app/models/pos.model';
import { PosService } from 'src/app/services/pos.service';
import { Posdetail } from 'src/app/models/posdetail.model';
import { PosdetailService } from 'src/app/services/posdetail.service';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.sass']
})
export class PosComponent {
  products?: Product[];
  productcats?: Productcat[];
  brands?: Brand[];
  partners?: Partner[];
  pss?: Pos[];
  posdetails?: Posdetail[];
  orders: Array<any> = [];
  cols: number;
  rowHeight: string;

  //disc
  isCalc = false;
  isPercent = true;
  disc: string="0";
  discType: string='percent';

  isTU = false;
  isTM = false;
  isAdm = false;

  currentIndex1 = -1;
  currentIndex2 = -1;
  currentIndex3 = -1;
  subtotal = 0;
  discount = 0;
  total = 0;

  term: string;
  posid?: string;
  prefixes?: string;

  isRightShow = false;

  //Select Partner
  selectedPartner: string = "";
  selectedData1: { valuePartner: string; textPartner: string } = {
    valuePartner: "",
    textPartner: ""
  };
  selectedPartnerControl = new FormControl(this.selectedPartner);
  selectedValue(event: MatSelectChange) {
    //console.log(event.value);
  }

  //Grid
  width = 0;
  @HostListener('window:resize', ['$event'])
    onResize() {
      if(window.innerWidth>=1024){this.cols = 4; this.rowHeight = "65pt";}
      else if(window.innerWidth<1024&&window.innerWidth>=800){this.cols = 3; this.rowHeight = "65pt";}
      else if(window.innerWidth<800){this.cols = 1; this.rowHeight = "25pt";}
    }

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private globals: Globals,
    private idService: IdService,
    private productService: ProductService,
    private productCatService: ProductCatService,
    private brandService: BrandService,
    private partnerService: PartnerService,
    private posService: PosService,
    private posDetailService: PosdetailService,
  ) {}

  ngOnInit(): void {
    this.retrieveData();
    this.checkRole();
    if(window.innerWidth>=1024){this.cols = 4; this.rowHeight = "65pt";}
    else if(window.innerWidth<1024&&window.innerWidth>=800){this.cols = 3; this.rowHeight = "65pt";}
    else if(window.innerWidth<800){this.cols = 1; this.rowHeight = "25pt";}
  }

  checkRole(): void {
    for(let x=0; x<this.globals.roles!.length;x++){
      if(this.globals.roles![x]=="trans_user") this.isTU=true;
      if(this.globals.roles![x]=="trans_manager") this.isTM=true;
      if(this.globals.roles![x]=="admin") this.isAdm=true;
    };
    this.retrieveData();
  }

  retrieveData(): void{
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

    this.productService.findAllActive()
      .subscribe(prod => {
        this.products = prod;
    });

    this.partnerService.findAllActiveCustomer()
      .subscribe(partn => {
        this.partners = partn;
    });

    this.currentIndex1 = -1;
    this.currentIndex2 = -1;
  }

  filterCategory(productCat: Productcat, index: number): void {
    this.currentIndex1 = index;
    this.products = this.products!
        .filter(prod => 
          prod.category?._id === productCat.id
      );
  }

  filterBrands(brand: Brand, index: number): void {
    this.currentIndex2 = index;
    this.products = this.products!
        .filter(prod => 
          prod.brand?._id === brand.id
      );
  }

  toggleCalc(): void {
    this.isCalc = !this.isCalc;
    this.calculateTotal();
  }

  press(key: string) {
    if(this.disc == '0'){
      this.disc = ''
    }
    if(key == 'C'){ 
      this.disc = '0';
      key = '';
      this.calculateTotal();
    }
    this.disc += key;
    if(this.isPercent){
      if(Number(this.disc)>100) this.disc = '100';
    }else{
      if(Number(this.disc)>=this.subtotal) this.disc = this.subtotal.toString();
    }
  }

  onDiscChange(val: string) {
    this.discType = val;
    if (this.discType == 'percent'){
      this.isPercent = true;
      this.disc = '0';
      this.calculateTotal();
    }else{
      this.isPercent = false;
      this.disc = '0';
      this.calculateTotal();
    }
  }

  calculateTotal() {
    if(Number(this.disc)>0 || !this.disc){
      if(!this.isPercent) this.total = this.subtotal - Number(this.disc);
      else this.total = this.subtotal - (Number(this.disc)/100*this.subtotal);
    }else{
      this.total = this.subtotal;
    }
  }

  posDetailAdd(index: number): void {
    this.currentIndex3 = index;
    let qtyold = this.orders[index].qty;
    let subold = this.orders[index].subtotal;
    let pu = this.orders[index].price_unit;
    this.orders[index].qty = qtyold + 1;
    this.orders[index].subtotal = subold + pu;
    this.subtotal = this.subtotal + pu;
    this.calculateTotal();
  }

  posDetailMin(index: number): void {
    this.currentIndex3 = index;
    let qtyold = this.orders[index].qty;
    let subold = this.orders[index].subtotal;
    let pu = this.orders[index].price_unit;
    this.orders[index].qty = qtyold - 1;
    this.orders[index].subtotal = subold - pu;
    this.subtotal = this.subtotal - pu;
    if(qtyold==1) this.orders.splice(index, 1);
    this.calculateTotal();
  }

  openPosDetail(index: number) {
    const dialog = this.dialog.open(PosdetailDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: {
        product: this.orders[index].product,
        qty: this.orders[index].qty,
        price_unit: this.orders[index].price_unit,
        index: index
      }
    })
      .afterClosed()
      .subscribe(res => {
        this.subtotal = this.subtotal - this.orders[res.index].subtotal;
        this.orders[res.index].qty = res.qty;
        this.orders[res.index].price_unit = res.price_unit;
        this.orders[res.index].subtotal = res.qty * res.price_unit;
        this.subtotal = this.subtotal + this.orders[res.index].subtotal;
        if(this.orders[res.index].qty == '0' || !this.orders[res.index].qty){
          this.orders.splice(res.index, 1);}
        this.calculateTotal();
      });
  }

  newOrder(): void {
    this.isRightShow = !this.isRightShow;
    /*this.idService.getAll()
      .subscribe({
        next: (ids) => {
          if(ids[0]!.pos_id! < 10) this.prefixes = '00000';
          else if(ids[0]!.pos_id! < 100) this.prefixes = '0000';
          else if(ids[0]!.pos_id! < 1000) this.prefixes = '000';
          else if(ids[0]!.pos_id! < 10000) this.prefixes = '00';
          else if(ids[0]!.pos_id! < 100000) this.prefixes = '0';
          this.posid = "POSS"+new Date().getFullYear().toString().substr(-2)+
          '0'+(new Date().getMonth() + 1).toString().slice(-2)+
          this.prefixes+ids[0]!.pos_id!.toString();
        },
        error: (e) => console.error(e)
    });*/
  }

  pukimai(product: Product): void {
    let avail = false;
    //if(this.posid){
      for (let x=0; x < this.orders.length; x++){
        if(product.id == this.orders[x].product){
          avail = true;
          let qtyold = this.orders[x].qty;
          let subold = this.orders[x].subtotal;
          let oIndx = this.orders.findIndex((obj => obj.product == product.id));
          this.orders[oIndx].qty = qtyold + 1;
          this.orders[oIndx].subtotal = subold + product.listprice;
          this.subtotal = this.subtotal + product!.listprice!;
          this.calculateTotal();
        }
      }
      const data = {
        order_id: this.posid,
        qty: 1,
        price_unit: product.listprice,
        subtotal: product.listprice,
        product: product.id,
        product_name: product.name,
        user: this.globals.userid
      };
      if (!avail){ 
        this.subtotal = this.subtotal + product!.listprice!;
        this.orders.push(data);
        this.calculateTotal();
      }
    //}
  }

}
