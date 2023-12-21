import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowYieldComponent } from './show-yield.component';

describe('ShowYieldComponent', () => {
  let component: ShowYieldComponent;
  let fixture: ComponentFixture<ShowYieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowYieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowYieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
