import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsFooter } from './actions-footer';

describe('ActionsFooter', () => {
  let component: ActionsFooter;
  let fixture: ComponentFixture<ActionsFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
