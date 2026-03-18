import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryListCard } from './inventory-list-card';

describe('InventoryListCard', () => {
  let component: InventoryListCard;
  let fixture: ComponentFixture<InventoryListCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryListCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryListCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
