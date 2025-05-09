import { Component, OnInit } from '@angular/core';
import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../shared/enums/page-routes';

interface Friend {
  id: number;
  name: string;
  avatar: string;
  likeCount: number;
}

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
  standalone: false
})
export class FriendsPage implements OnInit {

  friends: Friend[] = [
    { id: 1, name: 'Zoro Đầu rêu', avatar: 'assets/icons/avatars/zoro.png', likeCount: 100 },
    { id: 2, name: 'Bé thân thiện', avatar: 'assets/icons/avatars/be-than-thien.png', likeCount: 80 },
    { id: 3, name: 'Hoa tiêu Nami', avatar: 'assets/icons/avatars/nami.png', likeCount: 102 },
    { id: 4, name: 'Tứ hoàng Luffy', avatar: 'assets/icons/avatars/luffy.png', likeCount: 186 },
    { id: 5, name: 'Mèo Tom', avatar: 'assets/icons/avatars/tom.png', likeCount: 90 },
    { id: 6, name: 'Vịt Donald', avatar: 'assets/icons/avatars/donald.png', likeCount: 50 },
    { id: 7, name: 'Chuột Micky', avatar: 'assets/icons/avatars/micky.png', likeCount: 70 },
  ];

  totalFriends: number = 100;

  constructor() { }

  ngOnInit() {
  }

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;
}
