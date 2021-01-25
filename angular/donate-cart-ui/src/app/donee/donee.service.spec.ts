import { TestBed } from '@angular/core/testing';

import { DoneeService } from './donee.service';

describe('DoneeService', () => {
  let service: DoneeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoneeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
