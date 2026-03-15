import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListCard } from './product-list-card';

describe('ProductListCard', () => {
  let component: ProductListCard;
  let fixture: ComponentFixture<ProductListCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
