import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { environment } from "../../environments/environment";
import { generateManyProducts, generateOneProduct } from "../models/product.mock";
import { CreateProductDTO, Product, UpdateProductDTO } from "../models/product.model";
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

  afterEach(()=>{
    httpController.verify();
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


      //Assert
    })




  });

  //pruebas para post

  describe('test for create',()=> {

    it('should return a new product',(doneFn)=> {
      //Arrange
    const mockData = generateOneProduct();
    const dto: CreateProductDTO = {
      title: 'new Product',
      price: 100,
      images: ['img'],
      description: 'bla bla bla',
      categoryId: 12
    }
    //Act
    productService.create({...dto})
    .subscribe(data =>{
      //Assert
      expect(data).toEqual(mockData);
      doneFn();
    });
     //http config
     const url =`${environment.API_URL}/api/v1/products`;
     const req = httpController.expectOne(url);
     req.flush(mockData);
     //comprobaciones del cuerpo del dto enviado en el request
     expect(req.request.body).toEqual(dto);
     //comprobaciones del metodo
     expect(req.request.method).toEqual('POST');

    });

  });

  describe('test for update',()=>{
    it('should update a product',(doneFn)=>{
      //arrange
      const mockData:Product = generateOneProduct();
      const dto:UpdateProductDTO={
        title:'new Product',
      }
      const productId='1';
      //Act
      productService.update(productId,{...dto})
      .subscribe((data)=>{
        //Assert
        expect(data).toEqual(mockData);
        doneFn();
      });
       //http config
      const url =`${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      //comprobaciones del cuerpo del dto enviado en el request
      expect(req.request.body).toEqual(dto);
      //comprobaciones del metodo
      expect(req.request.method).toEqual('PUT');
    });
  });

  describe('test for delete',()=>{
    it('should delete a product',(doneFn)=>{
      //Arrange
      const mockData= true;
      const productId='1';
      //Act
      productService.delete(productId)
      .subscribe((data)=>{
        //Assert
        expect(data).toEqual(mockData);
        doneFn();
      });

      //http config
      const url =`${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      //comprobaciones del metodo
      expect(req.request.method).toEqual('DELETE');

    })
  })


});
