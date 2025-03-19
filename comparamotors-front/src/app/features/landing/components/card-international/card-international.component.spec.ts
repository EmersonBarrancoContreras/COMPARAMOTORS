import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInternationalComponent } from './card-international.component';

describe('CardInternationalComponent', () => {
  let component: CardInternationalComponent;
  let fixture: ComponentFixture<CardInternationalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardInternationalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardInternationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
