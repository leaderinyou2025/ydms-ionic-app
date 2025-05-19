import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpertGuidePage } from './expert-guide.page';

describe('ExpertGuidePage', () => {
  let component: ExpertGuidePage;
  let fixture: ComponentFixture<ExpertGuidePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertGuidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
