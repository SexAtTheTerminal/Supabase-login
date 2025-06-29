import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosReceiptsComponent } from './filtros-receipts.component';

describe('FiltrosReceiptsComponent', () => {
  let component: FiltrosReceiptsComponent;
  let fixture: ComponentFixture<FiltrosReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosReceiptsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrosReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
