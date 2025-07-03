import { TestBed } from '@angular/core/testing';

import { RegistrarPedidosService } from './registrar-pedidos.service';

describe('RegistrarPedidosService', () => {
  let service: RegistrarPedidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrarPedidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
