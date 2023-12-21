import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadYieldComponent } from './upload-yield.component';

describe('UploadYieldComponent', () => {
  let component: UploadYieldComponent;
  let fixture: ComponentFixture<UploadYieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadYieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadYieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
