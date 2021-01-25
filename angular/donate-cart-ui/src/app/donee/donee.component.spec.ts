import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneeComponent } from './donee.component';

describe('DoneeComponent', () => {
  let component: DoneeComponent;
  let fixture: ComponentFixture<DoneeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoneeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
