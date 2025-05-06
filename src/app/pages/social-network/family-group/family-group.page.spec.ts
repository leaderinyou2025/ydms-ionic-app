import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FamilyGroupPage } from './family-group.page';

describe('FamilyGroupPage', () => {
  let component: FamilyGroupPage;
  let fixture: ComponentFixture<FamilyGroupPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
