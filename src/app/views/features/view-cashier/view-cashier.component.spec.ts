import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCashierComponent } from './view-cashier.component';

describe('ViewCashierComponent', () => {
  let component: ViewCashierComponent;
  let fixture: ComponentFixture<ViewCashierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCashierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCashierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
