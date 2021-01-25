import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorViewRequirementDetailsComponent } from './donor-view-requirement-details.component';

describe('DonorViewRequirementDetailsComponent', () => {
  let component: DonorViewRequirementDetailsComponent;
  let fixture: ComponentFixture<DonorViewRequirementDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonorViewRequirementDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorViewRequirementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
