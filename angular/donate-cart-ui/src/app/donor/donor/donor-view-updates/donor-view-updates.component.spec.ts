import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorViewUpdatesComponent } from './donor-view-updates.component';

describe('DonorViewUpdatesComponent', () => {
  let component: DonorViewUpdatesComponent;
  let fixture: ComponentFixture<DonorViewUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonorViewUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorViewUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
