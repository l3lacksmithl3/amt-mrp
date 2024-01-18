import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCompareComponent } from './input-compare.component';

describe('InputCompareComponent', () => {
  let component: InputCompareComponent;
  let fixture: ComponentFixture<InputCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputCompareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
