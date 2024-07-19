import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { environment } from "../../environments/environment";
import { Product } from "../models/product.model";
import { ProductsService } from "./product.service";

fdescribe('ProductsService',() =>{
  let productService: ProductsService;
  let httpController:HttpTestingController;
  beforeEach(()=>{
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[
        ProductsService
      ]
    });
    //inyectar instancia a trabajar
    productService =TestBed.inject(ProductsService);
    httpController=TestBed.inject(HttpTestingController);
  });

  //primera prueba o test
  it('Should be create',()=>{
    expect(productService).toBeTruthy();
  })

  //pruebas para metodo getAllSimple
  describe('tests for getAllSimple', ()=>{
    it('should return a product list', (doneFn)=>{
      //Arrange
      const mockData:Product[] =[
        {
          id:'123',
          title:'title',
          price:12,
          description: 'blabla',
          category:{
            id:112,
            name:'as'
          },
          images:['img','img']
        }
      ];

      //Act
      productService.getAllSimple()
        .subscribe((data)=>{
          //Assert
          expect(data.length).toEqual(mockData.length);
          expect(data).toEqual(mockData);
          doneFn();
        });
        //http config para responder con el mock
        const url = `${environment.API_URL}/api/v1/products`;
        const req = httpController.expectOne(url);
        req.flush(mockData);
        httpController.verify();



      //Assert

    })
  })


});
