import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosList } from './productos';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('Productos', () => {
  let component: ProductosList;
  let fixture: ComponentFixture<ProductosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(),provideRouter([])],
      imports: [ProductosList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductosList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
