import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRelevantComponent } from './card-relevant.component';

describe('CardRelevantComponent', () => {
  let component: CardRelevantComponent;
  let fixture: ComponentFixture<CardRelevantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardRelevantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardRelevantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
