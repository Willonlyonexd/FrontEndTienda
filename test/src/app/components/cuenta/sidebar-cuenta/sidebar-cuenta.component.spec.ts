import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarCuentaComponent } from './sidebar-cuenta.component';

describe('SidebarCuentaComponent', () => {
  let component: SidebarCuentaComponent;
  let fixture: ComponentFixture<SidebarCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarCuentaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SidebarCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
