import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Breadcrumb } from './breadcrumb';
import { provideRouter } from '@angular/router';

describe('Breadcrumb', () => {
  let component: Breadcrumb;
  let fixture: ComponentFixture<Breadcrumb>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Breadcrumb],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Breadcrumb);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', [
      { label: 'Account' },
      { label: 'Gaming', link: '/category/1' },
      { label: 'Product Name' },
    ]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
