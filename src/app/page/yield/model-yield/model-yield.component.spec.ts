import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelYieldComponent } from './model-yield.component';

describe('ModelYieldComponent', () => {
  let component: ModelYieldComponent;
  let fixture: ComponentFixture<ModelYieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelYieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelYieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
