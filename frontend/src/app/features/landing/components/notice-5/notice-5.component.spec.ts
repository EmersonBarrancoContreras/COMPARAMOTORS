import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notice5Component } from './notice-5.component';

describe('Notice5Component', () => {
  let component: Notice5Component;
  let fixture: ComponentFixture<Notice5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notice5Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Notice5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
