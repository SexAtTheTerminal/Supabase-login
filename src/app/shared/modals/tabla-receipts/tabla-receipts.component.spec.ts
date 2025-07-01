import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaReceiptsComponent } from './tabla-receipts.component';

describe('TablaReceiptsComponent', () => {
  let component: TablaReceiptsComponent;
  let fixture: ComponentFixture<TablaReceiptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaReceiptsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
