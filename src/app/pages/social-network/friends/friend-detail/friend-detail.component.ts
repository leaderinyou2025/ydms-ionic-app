import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateKeys } from '../../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../../shared/enums/page-routes';
import { NavController } from '@ionic/angular';

interface Friend {
  id: number;
  name: string;
  avatar: string;
  likeCount: number;
  rank?: number;
  achievements?: number;
  friendshipLevel?: number;
}

@Component({
  selector: 'app-friend-detail',
  templateUrl: './friend-detail.component.html',
  styleUrls: ['./friend-detail.component.scss'],
  standalone: false
})
export class FriendDetailComponent implements OnInit {
  friendId: number = 0;
  friend: Friend | undefined;

  friends: Friend[] = [
    { id: 1, name: 'Zoro Đầu rêu', avatar: 'assets/icons/avatars/zoro.png', likeCount: 100, rank: 5, achievements: 25, friendshipLevel: 120 },
    { id: 2, name: 'Bé thân thiện', avatar: 'assets/icons/avatars/be-than-thien.png', likeCount: 80, rank: 8, achievements: 15, friendshipLevel: 90 },
    { id: 3, name: 'Hoa tiêu Nami', avatar: 'assets/icons/avatars/nami.png', likeCount: 102, rank: 4, achievements: 30, friendshipLevel: 150 },
    { id: 4, name: 'Tứ hoàng Luffy', avatar: 'assets/icons/avatars/luffy.png', likeCount: 186, rank: 1, achievements: 38, friendshipLevel: 186 },
    { id: 5, name: 'Mèo Tom', avatar: 'assets/icons/avatars/tom.png', likeCount: 90, rank: 6, achievements: 20, friendshipLevel: 95 },
    { id: 6, name: 'Vịt Donald', avatar: 'assets/icons/avatars/donald.png', likeCount: 50, rank: 10, achievements: 12, friendshipLevel: 60 },
    { id: 7, name: 'Chuột Micky', avatar: 'assets/icons/avatars/micky.png', likeCount: 70, rank: 9, achievements: 18, friendshipLevel: 75 },
    { id: 8, name: 'Nhóc Conan', avatar: 'assets/icons/avatars/conan.png', likeCount: 186, rank: 3, achievements: 38, friendshipLevel: 186 },
  ];

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.friendId = +params['id']; // Convert string to number
      this.loadFriendDetails();
    });
  }

  loadFriendDetails() {
    // In a real app, this would be a service call
    this.friend = this.friends.find(f => f.id === this.friendId);
  }

  unfriend() {
    // In a real app, this would call a service to remove the friend
    console.log('Unfriending:', this.friend?.name);
    // After unfriending, navigate back to friends list
    this.navCtrl.navigateBack(`/${PageRoutes.FRIENDS}`);
  }

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly PageRoutes = PageRoutes;
}
