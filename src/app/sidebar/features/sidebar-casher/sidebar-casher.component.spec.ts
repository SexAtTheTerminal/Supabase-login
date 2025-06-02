import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarCasherComponent } from './sidebar-casher.component';

describe('SidebarCasherComponent', () => {
  let component: SidebarCasherComponent;
  let fixture: ComponentFixture<SidebarCasherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarCasherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarCasherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
