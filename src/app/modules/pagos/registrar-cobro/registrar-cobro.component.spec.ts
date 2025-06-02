import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarCobroComponent } from './registrar-cobro.component';

describe('RegistrarCobroComponent', () => {
  let component: RegistrarCobroComponent;
  let fixture: ComponentFixture<RegistrarCobroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarCobroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarCobroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
