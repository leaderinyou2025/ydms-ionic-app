import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';

import { TranslateKeys } from '../../../../shared/enums/translate-keys';
import { PageRoutes } from '../../../../shared/enums/page-routes';
import { IFriend } from '../../../../shared/interfaces/friend/friend';
import { FriendService } from '../../../../services/friend/friend.service';

@Component({
  selector: 'app-friend-detail',
  templateUrl: './friend-detail.component.html',
  styleUrls: ['./friend-detail.component.scss'],
  standalone: false
})
export class FriendDetailComponent implements OnInit {
  friendId: number = 0;
  friend: IFriend | undefined;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private friendService: FriendService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.friendId = +params['id']; // Convert string to number
      this.loadFriendDetails();
    });
  }

  async loadFriendDetails() {
    this.isLoading = true;

    // Show loading indicator
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'circles'
    });
    await loading.present();

    // Get friend details from service
    this.friendService.getFriendById(this.friendId).subscribe(
      (friend) => {
        this.friend = friend;
        loading.dismiss();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading friend details:', error);
        loading.dismiss();
        this.isLoading = false;
      }
    );
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