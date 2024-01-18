import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryYieldDialogComponent } from './summary-yield-dialog.component';

describe('SummaryYieldDialogComponent', () => {
  let component: SummaryYieldDialogComponent;
  let fixture: ComponentFixture<SummaryYieldDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryYieldDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryYieldDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
