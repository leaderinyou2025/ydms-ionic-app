import { Component, OnInit } from '@angular/core';
import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { IHeaderAnimation, IHeaderAnimeImage, IHeaderSegment } from '../../../shared/interfaces/header/header';
import { PageRoutes } from '../../../shared/enums/page-routes';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
  standalone: false
})
export class TaskPage implements OnInit {

  animeImage!: IHeaderAnimeImage;
  animation!: IHeaderAnimation;

  activeTab: 'task' | 'activity' = 'task';

  protected readonly PageRoutes = PageRoutes;
  protected readonly TranslateKeys = TranslateKeys;

  constructor() {
  }

  ngOnInit() {
    this.initHeader();
  }


  /**
   * init header
   * @private
   */
  private initHeader(): void {
    this.animeImage = {
      name: 'rank',
      imageUrl: '/assets/images/rank/ranking.png',
      width: '130px',
      height: 'auto',
      position: {
        position: 'absolute',
        right: '-20px'
      }
    };
    this.animation = {
      animation: {
        path: '/assets/animations/1747072943679.json',
        loop: true,
        autoplay: true,
      },
      width: '130px',
      height: '130px',
      position: {
        position: 'absolute',
        top: '-30px',
        right: '50px',
      }
    }
  }
}
