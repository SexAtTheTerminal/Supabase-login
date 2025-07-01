import { TestBed } from '@angular/core/testing';

import { ReceiptsServiceService } from './receipts-service.service';

describe('ReceiptsServiceService', () => {
  let service: ReceiptsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiptsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
