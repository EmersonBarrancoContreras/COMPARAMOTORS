import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsInfiniteComponent } from './news-infinite.component';

describe('NewsInfiniteComponent', () => {
  let component: NewsInfiniteComponent;
  let fixture: ComponentFixture<NewsInfiniteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsInfiniteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsInfiniteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
