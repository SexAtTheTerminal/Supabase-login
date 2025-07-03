import { TestBed } from '@angular/core/testing';

import { RegistrarCobroService } from './registrar-cobro.service';

describe('RegistrarCobroService', () => {
  let service: RegistrarCobroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrarCobroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
