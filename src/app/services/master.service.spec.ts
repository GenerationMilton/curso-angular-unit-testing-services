//import { TestBed } from '@angular/core/testing';

import { MasterService } from './master.service';
import { FakeValueService } from './value-fake.service';
import { ValueService } from './value.service';


describe('MasterService', () => {
  let service: MasterService;

  // beforeEach(() => {
  //   TestBed.configureTestingModule({});
  //   service = TestBed.inject(MasterService);
  // });


  it('should return "my value" from the real service', () => {
    const valueService = new ValueService();
    const masterService = new MasterService(valueService);
    expect(masterService.getValue()).toBe('my value');
  });

  it('should return "other value" from the fake service', () => {
    const fakeValueService = new FakeValueService();
    const masterService= new MasterService(fakeValueService as unknown as ValueService);
    expect(masterService.getValue()).toBe('fake value');
  });


  it('should return "other value" from the fake service', () => {
    const fake = { getValue: ()=> 'fake from obj'};
    const masterService= new MasterService(fake as ValueService);
    expect(masterService.getValue()).toBe('fake from obj');
  });


});
