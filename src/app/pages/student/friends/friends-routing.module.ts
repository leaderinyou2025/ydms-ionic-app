import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FriendsPage } from './friends.page';
import { FriendDetailComponent } from './friend-detail/friend-detail.component';

const routes: Routes = [
  {
    path: '',
    component: FriendsPage
  },
  {
    path: `:id`,
    component: FriendDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FriendsPageRoutingModule {
}
