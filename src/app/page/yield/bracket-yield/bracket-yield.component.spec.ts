import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BracketYieldComponent } from './bracket-yield.component';

describe('BracketYieldComponent', () => {
  let component: BracketYieldComponent;
  let fixture: ComponentFixture<BracketYieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BracketYieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BracketYieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
