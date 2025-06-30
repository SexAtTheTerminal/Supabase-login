import { TestBed } from '@angular/core/testing';

import { UpdatePedidosService } from './consultar-pedidos.service';

describe('ConsultarPedidosService', () => {
  let service: UpdatePedidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdatePedidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
