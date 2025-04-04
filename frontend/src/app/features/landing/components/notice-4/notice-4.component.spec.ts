import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notice4Component } from './notice-4.component';

describe('Notice4Component', () => {
  let component: Notice4Component;
  let fixture: ComponentFixture<Notice4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notice4Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Notice4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
