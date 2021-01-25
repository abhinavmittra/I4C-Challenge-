import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorCreateItemComponent } from './donor-create-item.component';

describe('DonorCreateItemComponent', () => {
  let component: DonorCreateItemComponent;
  let fixture: ComponentFixture<DonorCreateItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonorCreateItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorCreateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
