import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardNationalComponent } from './card-national.component';

describe('CardNationalComponent', () => {
  let component: CardNationalComponent;
  let fixture: ComponentFixture<CardNationalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardNationalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardNationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
