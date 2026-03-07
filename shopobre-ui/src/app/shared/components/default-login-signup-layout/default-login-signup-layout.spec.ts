import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultLoginSignupLayout } from './default-login-signup-layout';

describe('DefaultLoginSignupLayout', () => {
  let component: DefaultLoginSignupLayout;
  let fixture: ComponentFixture<DefaultLoginSignupLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultLoginSignupLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefaultLoginSignupLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
