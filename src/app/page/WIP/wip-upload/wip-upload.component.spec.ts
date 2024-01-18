import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WipUploadComponent } from './wip-upload.component';

describe('WipUploadComponent', () => {
  let component: WipUploadComponent;
  let fixture: ComponentFixture<WipUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WipUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WipUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
