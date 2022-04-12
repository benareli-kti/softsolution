import { Component, AfterContentInit, EventEmitter, 
  ViewChild, Output, OnInit, HostListener } from '@angular/core';
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { MatGridList } from '@angular/material/grid-list';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PosdetailDialogComponent } from '../dialog/posdetail-dialog.component';
import { PaymentDialogComponent } from '../dialog/payment-dialog.component';

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
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { Possession } from 'src/app/models/possession.model';
import { PossessionService } from 'src/app/services/possession.service';
import { Pos } from 'src/app/models/pos.model';
import { PosService } from 'src/app/services/pos.service';
import { Posdetail } from 'src/app/models/posdetail.model';
import { PosdetailService } from 'src/app/services/posdetail.service';
import { Payment } from 'src/app/models/payment.model';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.sass']
})
export class PosComponent {
  products?: Product[];
  productcats?: Productcat[];
  brands?: Brand[];
  warehouses?: Warehouse[];
  partners?: Partner[];
  pss?: Pos[];
  posdetails?: Posdetail[];
  partnerid?: string;
  warehouseid?: string;
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
  tax = 0;
  discount = 0;
  total = 0;

  term: string;
  posid?: string;
  prefixes?: string;

  isRightShow = false;

  //pos session
  pos_open = false;
  session: string='';
  session_id: string='';
  sess_id?: string;

  //Select Partner
  selectedPartner: string = "";
  selectedData1: { valuePartner: string; textPartner: string } = {
    valuePartner: "",
    textPartner: ""
  };
  selectedPartnerControl = new FormControl(this.selectedPartner);
  selectedValue(event: MatSelectChange) {
    this.partnerid = event.value;
  }

  //Select WH
  selectedWh: string = "";
  selectedData2: { valueWarehouse: string; textWarehouse: string } = {
    valueWarehouse: "",
    textWarehouse: ""
  };
  selectedWhControl = new FormControl(this.selectedWh);
  selectedValue2(event: MatSelectChange) {
    this.warehouseid = event.value;
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
    private _snackBar: MatSnackBar,
    private dialog: MatDialog,
    private globals: Globals,
    private idService: IdService,
    private productService: ProductService,
    private productCatService: ProductCatService,
    private brandService: BrandService,
    private warehouseService: WarehouseService,
    private partnerService: PartnerService,
    private possessionService: PossessionService,
    private posService: PosService,
    private posDetailService: PosdetailService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.possessionService.getUserOpen(this.globals.userid)
      .subscribe(abc => {
        if(abc.length>0 && !this.globals.pos_open) this.router.navigate(['/pos-session']);
      })
    if(this.globals.pos_open){
      this.pos_open = true;
      this.session = this.globals!.pos_session!;
      this.session_id = this.globals!.pos_session_id!;
    }
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

    this.warehouseService.findAllActive()
      .subscribe(wh => {
        this.warehouses = wh;
    });

    this.warehouseService.findMain()
      .subscribe(whm => {
        this.selectedWh = whm[0].id;
        this.warehouseid = whm[0].id;
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
      if(!this.isPercent) this.total = this.subtotal - Number(this.disc) + this.tax;
      else this.total = this.subtotal - (Number(this.disc)/100*this.subtotal) + this.tax;
    }else{
      this.total = this.subtotal + this.tax;
    }
  }

  posDetailAdd(index: number): void {
    this.currentIndex3 = index;
    let qtyold = this.orders[index].qty;
    let subold = this.orders[index].subtotal;
    let pu = this.orders[index].price_unit;
    this.orders[index].qty = qtyold + 1;
    this.orders[index].subtotal = subold + pu;
    this.orders[index].taxes = this.orders[index].tax / 100 * this.orders[index].subtotal;
    this.subtotal = this.subtotal + pu;
    this.tax = this.tax + (this.orders[index].tax / 100 * pu);
    this.calculateTotal();
  }

  posDetailMin(index: number): void {
    this.currentIndex3 = index;
    let qtyold = this.orders[index].qty;
    let subold = this.orders[index].subtotal;
    let pu = this.orders[index].price_unit;
    this.orders[index].qty = qtyold - 1;
    this.orders[index].subtotal = subold - pu;
    this.orders[index].taxes = this.orders[index].tax / 100 * this.orders[index].subtotal;
    this.subtotal = this.subtotal - pu;
    this.tax = this.tax - (this.orders[index].tax / 100 * pu)
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
        this.tax = this.tax - this.orders[res.index].taxes;
        this.subtotal = this.subtotal - this.orders[res.index].subtotal;
        this.orders[res.index].qty = res.qty;
        this.orders[res.index].price_unit = res.price_unit;
        this.orders[res.index].subtotal = res.qty * res.price_unit;
        this.orders[res.index].taxes = this.orders[res.index].tax / 100 * this.orders[res.index].subtotal;
        this.subtotal = this.subtotal + this.orders[res.index].subtotal;
        this.tax = this.tax + this.orders[res.index].taxes;
        if(this.orders[res.index].qty == '0' || !this.orders[res.index].qty){
          this.orders.splice(res.index, 1);}
        this.calculateTotal();
      });
  }

  pukimai(product: Product): void {
    let avail = false;
    for (let x=0; x < this.orders.length; x++){
      if(product.id == this.orders[x].product){
        avail = true;
        let qtyold = this.orders[x].qty;
        let subold = this.orders[x].subtotal;
        let oIndx = this.orders.findIndex((obj => obj.product == product.id));
        this.orders[oIndx].qty = qtyold + 1;
        this.orders[oIndx].subtotal = subold + product.listprice;
        this.orders[oIndx].taxes = this.orders[oIndx].tax / 100 * this.orders[oIndx].subtotal;
        this.subtotal = this.subtotal + product!.listprice!;
        this.tax = this.tax + (this.orders[oIndx].tax / 100 * product!.listprice!);
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
      tax: product.taxout.tax,
      taxes: product.taxout.tax/100 * product!.listprice!,
      isStock: product.isStock,
      user: this.globals.userid
    };
    if (!avail){
      this.subtotal = this.subtotal + product!.listprice!;
      this.tax = this.tax + product.taxout.tax/100 * product!.listprice!;
      this.orders.push(data);
      this.calculateTotal();
    }    
  }

  startPay(): void{
    if(this.orders.length>0){
      this.idService.getAll()
        .subscribe({
          next: (ids) => {
            if(ids[0]!.pos_id! < 10) this.prefixes = '00000';
            else if(ids[0]!.pos_id! < 100) this.prefixes = '0000';
            else if(ids[0]!.pos_id! < 1000) this.prefixes = '000';
            else if(ids[0]!.pos_id! < 10000) this.prefixes = '00';
            else if(ids[0]!.pos_id! < 100000) this.prefixes = '0';
            let x = ids[0]!.pos_id!;
            this.posid = "POSS"+new Date().getFullYear().toString().substr(-2)+
            '0'+(new Date().getMonth() + 1).toString().slice(-2)+
            this.prefixes+ids[0]!.pos_id!.toString();
            //this.createPOS();
            const pos_ids = {
              pos_id: x + 1
            };
            this.idService.update(ids[0].id, pos_ids)
              .subscribe({
                next: (res) => {
                  this.openPayment();
                },
                error: (e) => console.error(e)
              });
          },
          error: (e) => console.error(e)
      });
    }else{
      this._snackBar.open("Order Kosong", "Tutup", {duration: 5000});
    }
  }

  openPayment() {
    const dialog = this.dialog.open(PaymentDialogComponent, {
      width: '98%',
      height: '90%',
      disableClose: true,
      data: {
        order_id: this.posid,
        subtotal: this.subtotal,
        discount: this.discount,
        total: this.total
      }
    })
      .afterClosed()
      .subscribe(res => {
        this.paying(res);
      });
  }

  paying(res: any): void {
    if(Number(res.payment1)==0) res.pay1Type = null;
    if(Number(res.payment2)==0) res.pay2Type = null;
    if(!this.globals.pos_session_id || this.globals.pos_session_id == null
      || this.globals.pos_session_id==''){ this.sess_id = "null" }
      else{ this.sess_id = this.globals.pos_session_id};
    const payments = {
      session: this.sess_id,
      order_id: this.posid,
      amount_total: this.total,
      payment1: res.payment1,
      pay1method: res.pay1Type,
      payment2: res.payment2,
      pay2method: res.pay2Type,
      change: res.change,
      changeMethod: "tunai"
    };
    this.paymentService.create(payments)
      .subscribe({
        next: (res) => {
          this.createPOS(res.id);
        },
        error: (e) => console.error(e)
      })
  }

  createPOS(payment: any): void {
    if(!this.partnerid || this.partnerid == null
      || this.partnerid=='') this.partnerid = "null";
    if(!this.globals.pos_session_id || this.globals.pos_session_id == null
      || this.globals.pos_session_id==''){ this.sess_id = "null" }
      else{ this.sess_id = this.globals.pos_session_id};
    if(!this.tax || this.tax==null) this.tax = 0;
      const posdata = {
        order_id: this.posid,
        disc_type: this.discType,
        discount: this.disc,
        amount_tax: this.tax,
        amount_untaxed: this.subtotal,
        amount_total: this.total,
        user: this.globals.userid,
        payment: payment,
        session: this.sess_id
      };
      this.posService.create(posdata)
        .subscribe({
          next: (res) => {
            this.rollingDetail(res.id);
          },
          error: (e) => console.error(e)
        });
    
  }

  rollingDetail(orderid: string): void {
    if(this.orders.length>0){
      this.createDetail(orderid, this.orders[0].qty, this.orders[0].price_unit,
        this.orders[0].subtotal, this.orders[0].product, this.orders[0].isStock.toString());
    }else{
      this.total = 0;
      this.subtotal = 0;
      this.discount = 0;
      this.tax = 0;
    }
  }

  createDetail(orderid:string, qty:number, price_unit:number, 
    subtotal:number, product:string, isStock:string): void {
      const posdetail = {
        ids: orderid,
        order_id: this.posid,
        qty: qty,
        price_unit: price_unit,
        subtotal: subtotal,
        product: product,
        isStock: isStock,
        warehouse: this.warehouseid,
        user: this.globals.userid
      };
      this.posDetailService.create(posdetail)
        .subscribe({
          next: (res) => {
            this.orders.splice(0, 1);
            this.rollingDetail(orderid);
          },
          error: (e) => console.error(e)
        });
  }

}
