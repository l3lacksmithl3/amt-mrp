import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryYieldComponent } from './summary-yield.component';

describe('SummaryYieldComponent', () => {
  let component: SummaryYieldComponent;
  let fixture: ComponentFixture<SummaryYieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryYieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryYieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
