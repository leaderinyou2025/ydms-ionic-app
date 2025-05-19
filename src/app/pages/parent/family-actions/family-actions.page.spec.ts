import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FamilyActionsPage } from './family-actions.page';

describe('FamilyActionsPage', () => {
  let component: FamilyActionsPage;
  let fixture: ComponentFixture<FamilyActionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyActionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
