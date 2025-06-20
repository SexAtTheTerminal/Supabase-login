import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaUpdatePedidosComponent } from './tabla-update-pedidos.component';

describe('TablaUpdatePedidosComponent', () => {
  let component: TablaUpdatePedidosComponent;
  let fixture: ComponentFixture<TablaUpdatePedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaUpdatePedidosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaUpdatePedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
