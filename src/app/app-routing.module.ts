import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/student/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/student/profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'parent-dashboard',
    loadChildren: () => import('./pages/parent/parent-dashboard/parent-dashboard.module').then(m => m.ParentDashboardPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'teacher-dashboard',
    loadChildren: () => import('./pages/teacher/teacher-dashboard/teacher-dashboard.module').then(m => m.TeacherDashboardPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'school-dashboard',
    loadChildren: () => import('./pages/school/school-dashboard/school-dashboard.module').then(m => m.SchoolDashboardPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'badge-collection',
    loadChildren: () => import('./pages/student/badge-collection/badge-collection.module').then(m => m.BadgeCollectionPageModule)
  },
  {
    path: 'family-group',
    loadChildren: () => import('./pages/social-network/family-group/family-group.module').then(m => m.FamilyGroupPageModule)
  },
  {
    path: 'class-group',
    loadChildren: () => import('./pages/social-network/class-group/class-group.module').then(m => m.ClassGroupPageModule)
  },
  {
    path: 'school-group',
    loadChildren: () => import('./pages/social-network/school-group/school-group.module').then(m => m.SchoolGroupPageModule)
  },
  {
    path: 'personal-diary',
    loadChildren: () => import('./pages/student/personal-diary/personal-diary.module').then(m => m.PersonalDiaryPageModule)
  },
  {
    path: 'friends',
    loadChildren: () => import('./pages/student/friends/friends.module').then( m => m.FriendsPageModule)
  },
  {
    path: 'chatbot',
    loadChildren: () => import('./pages/chatbot/chatbot.module').then(m => m.ChatbotPageModule)
  },
  {
    path: 'rank',
    loadChildren: () => import('./pages/student/rank/rank.module').then(m => m.RankPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
