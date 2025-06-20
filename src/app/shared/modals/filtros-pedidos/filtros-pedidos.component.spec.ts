import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosPedidosComponent } from './filtros-pedidos.component';

describe('FiltrosPedidosComponent', () => {
  let component: FiltrosPedidosComponent;
  let fixture: ComponentFixture<FiltrosPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosPedidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrosPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
