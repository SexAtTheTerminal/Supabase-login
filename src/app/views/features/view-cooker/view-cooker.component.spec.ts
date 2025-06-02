import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCookerComponent } from './view-cooker.component';

describe('ViewCookerComponent', () => {
  let component: ViewCookerComponent;
  let fixture: ComponentFixture<ViewCookerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCookerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCookerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
