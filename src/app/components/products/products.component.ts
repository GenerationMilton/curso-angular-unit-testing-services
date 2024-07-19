import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/product.service';
@Component({
  selector: 'app-products',
  //standalone: true,
  //imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  products:Product[]=[];

  constructor(
    private productsService:ProductsService
  ){}

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(){
    this.productsService.getAllSimple()
    .subscribe(products=>{
      this.products=products;
    });
  }


}
