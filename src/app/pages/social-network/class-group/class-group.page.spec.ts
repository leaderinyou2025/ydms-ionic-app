import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassGroupPage } from './class-group.page';

describe('ClassGroupPage', () => {
  let component: ClassGroupPage;
  let fixture: ComponentFixture<ClassGroupPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
