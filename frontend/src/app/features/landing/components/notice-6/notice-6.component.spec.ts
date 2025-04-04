import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notice6Component } from './notice-6.component';

describe('Notice6Component', () => {
  let component: Notice6Component;
  let fixture: ComponentFixture<Notice6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notice6Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Notice6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
