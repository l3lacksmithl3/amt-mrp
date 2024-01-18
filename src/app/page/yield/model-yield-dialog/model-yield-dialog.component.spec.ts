import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelYieldDialogComponent } from './model-yield-dialog.component';

describe('ModelYieldDialogComponent', () => {
  let component: ModelYieldDialogComponent;
  let fixture: ComponentFixture<ModelYieldDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelYieldDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelYieldDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
