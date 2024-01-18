import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPlanComponent } from './input-plan.component';

describe('InputPlanComponent', () => {
  let component: InputPlanComponent;
  let fixture: ComponentFixture<InputPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
