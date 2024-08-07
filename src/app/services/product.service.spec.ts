import { HTTP_INTERCEPTORS, HttpStatusCode } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { environment } from "../../environments/environment";
import { TokenInterceptor } from "../interceptors/token.interceptor";
import { generateManyProducts, generateOneProduct } from "../models/product.mock";
import { CreateProductDTO, Product, UpdateProductDTO } from "../models/product.model";
import { ProductsService } from "./product.service";
import { TokenService } from "./token.services";

fdescribe('ProductsService',() =>{
  let productService: ProductsService;
  let httpController:HttpTestingController;
  let tokenService: TokenService;

  beforeEach(()=>{
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[
        ProductsService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi:true
        }
      ]
    });
    //inyectar instancia a trabajar
    productService =TestBed.inject(ProductsService);
    httpController=TestBed.inject(HttpTestingController);
    tokenService=TestBed.inject(TokenService);
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
      //Spy with a function the token service
      spyOn(tokenService, 'getToken').and.returnValue('123');

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
        //expect del spy del tokenService
        const headers=req.request.headers;
        expect(headers.get('Authorization')).toEqual(`Bearer 123`);
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

    });
  });


  //test for errors

  describe('test for getOne',()=>{
    it('should return a product',(doneFn)=>{
      //arrange
      const mockData:Product = generateOneProduct();
      const productId='1';
      //Act
      productService.getOne(productId)
      .subscribe((data)=>{
        //Assert
        expect(data).toEqual(mockData);
        doneFn();
      });
       //http config
      const url =`${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
       //comprobaciones del metodo
       expect(req.request.method).toEqual('GET');
      req.flush(mockData);


    });
    //another test for errors
    it('should return the right msg when the status code is 404',
    (doneFn)=>{
      //arrange
      const productId='1';
      const msgError='404 message';
      const mockError ={
        status: HttpStatusCode.NotFound,
        statusText: msgError
      };
      //Act
      productService.getOne(productId)
      .subscribe({ //error test
        error:(error)=>{
          //assert
          expect(error).toEqual('El producto no existe');
          doneFn();
        }
      });
       //http config
      const url =`${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
       //comprobaciones del metodo
       expect(req.request.method).toEqual('GET');
      req.flush(msgError,mockError);

    });

    //another error test

    it('should return the right msg when status code is 409', (doneFn) => {
      // Arange
      const productId = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.Conflict,
        statusText: msgError,
      };
      // Act
      productService.getOne(productId).subscribe({
        error: (error) => {
          // Assert
          expect(error).toEqual('Algo esta fallando en el server');
          doneFn();
        },
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      req.flush(msgError, mockError);
      expect(req.request.method).toEqual('GET');
    });


    //another error test
    it('should return the right msg when status code is 401', (doneFn) => {
      // Arange
      const productId = '1';
      const msgError = '404 message';
      const mockError = {
        status: HttpStatusCode.Unauthorized,
        statusText: msgError,
      };
      // Act
      productService.getOne(productId).subscribe({
        error: (error) => {
          // Assert
          expect(error).toEqual('No estas permitido');
          doneFn();
        },
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      req.flush(msgError, mockError);
      expect(req.request.method).toEqual('GET');
    });


    //another error test
    it('should return the right msg when status code is 500', (doneFn) => {
      // Arange
      const productId = '1';
      const msgError = 'error message';
      const mockError = {
        status: HttpStatusCode.InternalServerError,
        statusText: msgError,
      };
      // Act
      productService.getOne(productId).subscribe({
        error: (error) => {
          // Assert
          expect(error).toEqual('Ups algo salio mal');
          doneFn();
        },
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products/${productId}`;
      const req = httpController.expectOne(url);
      req.flush(msgError, mockError);
      expect(req.request.method).toEqual('GET');
    });

  });


});
