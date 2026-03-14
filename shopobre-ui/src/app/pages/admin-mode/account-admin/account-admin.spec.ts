import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAdmin } from './account-admin';

describe('AccountAdmin', () => {
  let component: AccountAdmin;
  let fixture: ComponentFixture<AccountAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
