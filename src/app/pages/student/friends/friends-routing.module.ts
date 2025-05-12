import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FriendsPage } from './friends.page';
import { FriendDetailComponent } from './friend-detail/friend-detail.component';
import { PageRoutes } from '../../../shared/enums/page-routes';

const routes: Routes = [
  {
    path: '',
    component: FriendsPage
  },
  {
    path: `${PageRoutes.FRIEND_DETAIL}/:id`,
    component: FriendDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendsPageRoutingModule {}