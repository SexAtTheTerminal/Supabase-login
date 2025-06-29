import { TestBed } from '@angular/core/testing';

import { ReceiptsService } from './receipts-service.service';

describe('ReceiptsServiceService', () => {
  let service: ReceiptsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiptsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
