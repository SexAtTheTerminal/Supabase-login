import { TestBed } from '@angular/core/testing';

import { UpdatePedidosService } from './update-pedidos.service';

describe('RegistrarPedidosService', () => {
  let service: UpdatePedidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdatePedidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
