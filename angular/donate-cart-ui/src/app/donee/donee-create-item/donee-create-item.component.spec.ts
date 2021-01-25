import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneeCreateItemComponent } from './donee-create-item.component';

describe('DoneeCreateItemComponent', () => {
  let component: DoneeCreateItemComponent;
  let fixture: ComponentFixture<DoneeCreateItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoneeCreateItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoneeCreateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
