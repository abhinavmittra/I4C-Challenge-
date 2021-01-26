import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneeViewDonationListComponent } from './donee-view-donation-list.component';

describe('DoneeViewDonationListComponent', () => {
  let component: DoneeViewDonationListComponent;
  let fixture: ComponentFixture<DoneeViewDonationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoneeViewDonationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoneeViewDonationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
