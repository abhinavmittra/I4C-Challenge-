import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneeViewDonationDetailsComponent } from './donee-view-donation-details.component';

describe('DoneeViewDonationDetailsComponent', () => {
  let component: DoneeViewDonationDetailsComponent;
  let fixture: ComponentFixture<DoneeViewDonationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoneeViewDonationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoneeViewDonationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
