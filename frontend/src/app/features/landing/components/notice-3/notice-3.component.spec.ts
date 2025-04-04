import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notice3Component } from './notice-3.component';

describe('Notice3Component', () => {
  let component: Notice3Component;
  let fixture: ComponentFixture<Notice3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notice3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Notice3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
