import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

import { FriendDetailComponent } from './friend-detail.component';
import { FriendService } from '../../../../services/friend/friend.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('FriendDetailComponent', () => {
  let component: FriendDetailComponent;
  let fixture: ComponentFixture<FriendDetailComponent>;
  let friendServiceSpy: jasmine.SpyObj<FriendService>;

  beforeEach(waitForAsync(() => {
    const spy = jasmine.createSpyObj('FriendService', ['getFriends']);
    spy.getFriends.and.returnValue(of({
      friends: [
        { id: 1, name: 'Test Friend', avatar: 'assets/images/avatar/Shiba-Inu-Dog-1.png', likeCount: 100 }
      ],
      total: 1
    }));

    TestBed.configureTestingModule({
      declarations: [FriendDetailComponent],
      imports: [
        IonicModule.forRoot(),
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: FriendService, useValue: spy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' }))
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    friendServiceSpy = TestBed.inject(FriendService) as jasmine.SpyObj<FriendService>;
    fixture = TestBed.createComponent(FriendDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load friend details on init', () => {
    expect(friendServiceSpy.getFriends).toHaveBeenCalled();
    expect(component.friendId).toBe(1);
    expect(component.friend).toBeDefined();
    expect(component.friend?.name).toBe('Test Friend');
  });
});
