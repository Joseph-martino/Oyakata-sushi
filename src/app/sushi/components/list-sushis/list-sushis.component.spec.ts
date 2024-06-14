import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSushisComponent } from './list-sushis.component';

describe('ListSushisComponent', () => {
  let component: ListSushisComponent;
  let fixture: ComponentFixture<ListSushisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListSushisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListSushisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
