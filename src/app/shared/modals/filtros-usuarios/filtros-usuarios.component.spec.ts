import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosUsuariosComponent } from './filtros-usuarios.component';

describe('FiltrosUsuariosComponent', () => {
  let component: FiltrosUsuariosComponent;
  let fixture: ComponentFixture<FiltrosUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrosUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
