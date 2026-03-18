import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListCard } from './order-list-card';

describe('OrderListCard', () => {
  let component: OrderListCard;
  let fixture: ComponentFixture<OrderListCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderListCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderListCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
