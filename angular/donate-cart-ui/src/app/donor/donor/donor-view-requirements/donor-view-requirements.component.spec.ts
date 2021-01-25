import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorViewRequirementsComponent } from './donor-view-requirements.component';

describe('DonorViewRequirementsComponent', () => {
  let component: DonorViewRequirementsComponent;
  let fixture: ComponentFixture<DonorViewRequirementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonorViewRequirementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorViewRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
