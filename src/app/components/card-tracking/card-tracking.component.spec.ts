import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTrackingComponent } from './card-tracking.component';

describe('CardTrackingComponent', () => {
  let component: CardTrackingComponent;
  let fixture: ComponentFixture<CardTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardTrackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
