import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownCustom } from './dropdown-custom';

describe('DropdownCustom', () => {
  let component: DropdownCustom;
  let fixture: ComponentFixture<DropdownCustom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownCustom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownCustom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
