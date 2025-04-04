import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notice1Component } from './notice-1.component';

describe('Notice1Component', () => {
  let component: Notice1Component;
  let fixture: ComponentFixture<Notice1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notice1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Notice1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
