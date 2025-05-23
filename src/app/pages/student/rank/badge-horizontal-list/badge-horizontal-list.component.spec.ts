import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BadgeHorizontalListComponent } from './badge-horizontal-list.component';

describe('BadgeHorizontalListComponent', () => {
  let component: BadgeHorizontalListComponent;
  let fixture: ComponentFixture<BadgeHorizontalListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BadgeHorizontalListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeHorizontalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
