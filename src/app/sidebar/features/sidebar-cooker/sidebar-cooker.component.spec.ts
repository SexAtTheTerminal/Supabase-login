import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarCookerComponent } from './sidebar-cooker.component';

describe('SidebarCookerComponent', () => {
  let component: SidebarCookerComponent;
  let fixture: ComponentFixture<SidebarCookerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarCookerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarCookerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
