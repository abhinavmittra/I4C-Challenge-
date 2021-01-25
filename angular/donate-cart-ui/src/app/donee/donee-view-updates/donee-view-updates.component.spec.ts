import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneeViewUpdatesComponent } from './donee-view-updates.component';

describe('DoneeViewUpdatesComponent', () => {
  let component: DoneeViewUpdatesComponent;
  let fixture: ComponentFixture<DoneeViewUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoneeViewUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoneeViewUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
