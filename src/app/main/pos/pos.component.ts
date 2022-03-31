import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Globals } from 'src/app/global';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { Productcat } from 'src/app/models/productcat.model';
import { Brand } from 'src/app/models/brand.model';
import { ProductService } from 'src/app/services/product.service';
import { ProductCatService } from 'src/app/services/product-cat.service';
import { BrandService } from 'src/app/services/brand.service';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.sass']
})
export class PosComponent {
  products?: Product[];
  productcats?: Productcat[];
  brands?: Brand[];

  currentIndex = -1;

  @Output() alert: EventEmitter<string> = new EventEmitter();

  constructor(
    private router: Router,
    private globals: Globals,
    private productService: ProductService,
    private productCatService: ProductCatService,
    private brandService: BrandService,
  ) {}

  ngOnInit(): void {
    //this.globals.sendMessage('Open POS');
    this.alert.emit();
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
        /*this.dataSource.data = prod;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;*/
    });
  }
}
