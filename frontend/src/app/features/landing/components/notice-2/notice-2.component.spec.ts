import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notice2Component } from './notice-2.component';

describe('Notice2Component', () => {
  let component: Notice2Component;
  let fixture: ComponentFixture<Notice2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notice2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Notice2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
