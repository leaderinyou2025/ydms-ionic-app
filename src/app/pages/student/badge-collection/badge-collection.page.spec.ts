import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeCollectionPage } from './badge-collection.page';

describe('BadgeCollectionPage', () => {
  let component: BadgeCollectionPage;
  let fixture: ComponentFixture<BadgeCollectionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeCollectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
