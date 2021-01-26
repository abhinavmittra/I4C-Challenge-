import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorViewRequirementsListComponent } from './donor-view-requirements-list.component';

describe('DonorViewRequirementsListComponent', () => {
  let component: DonorViewRequirementsListComponent;
  let fixture: ComponentFixture<DonorViewRequirementsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonorViewRequirementsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorViewRequirementsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
