import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { environment } from "../../environments/environment";
import { generateManyProducts, generateOneProduct } from "../models/product.mock";
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
      const mockData:Product[] = generateManyProducts(2);

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

    });
  });

  describe('test for getAll',()=>{
    it('should return a product list', (doneFn)=>{
      //Arrange
      const mockData: Product[]=generateManyProducts(3);
      //Act
      productService.getAll()
      .subscribe((data)=>{
        //Assert
        expect(data.length).toEqual(mockData.length);
        //expect(data).toEqual(mockData);
        doneFn();
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      httpController.verify();
    });

    it('should return product list with taxes',(doneFn)=>{
      //Arrange
      const mockData:Product[]=[
        {
          ...generateOneProduct(),
          price:100,//100*.19 =19
        },
        {
          ...generateOneProduct(),
          price:200,//200*.19 =38
        },
        {
          ...generateOneProduct(),
          price: 0, //0 * .19 = 0
        },
        {
          ...generateOneProduct(),
          price: -100, // =0
        }
      ];
       //Act
       productService.getAllSimple()
       .subscribe((data)=>{
         //Assert
         expect(data.length).toEqual(mockData.length);
         expect(data[0].taxes).toEqual(19);
         expect(data[1].taxes).toEqual(38);
         expect(data[2].taxes).toEqual(0);
         expect(data[3].taxes).toEqual(0);
         doneFn();
       });
       //http config para responder con el mock
       const url = `${environment.API_URL}/api/v1/products`;
       const req = httpController.expectOne(url);
       req.flush(mockData);
       httpController.verify();
     //Assert


    });

    it('should send query params with limit 10 and offset 3', (doneFn)=>{
      //Arrange
      const mockData:Product[] = generateManyProducts(3);
      const limit =10;
      const offset=3;
      //Act
      productService.getAll(limit,offset)
      .subscribe((data)=>{
        //Assert
        expect(data.length).toEqual(mockData.length);
        doneFn();
      });
      //http config
      const url =`${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`
      const req = httpController.expectOne(url);
      req.flush(mockData);
      const params=req.request.params;
      expect(params.get('limit')).toEqual(`${limit}`);
      expect(params.get('offset')).toEqual(`${offset}`);
      httpController.verify();


      //Assert
    })




  });




});
