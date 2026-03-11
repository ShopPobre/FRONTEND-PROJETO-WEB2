import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlActions } from './control-actions';

describe('ControlActions', () => {
  let component: ControlActions;
  let fixture: ComponentFixture<ControlActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlActions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControlActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
