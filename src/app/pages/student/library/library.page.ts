import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InputTypes } from '../../../shared/enums/input-types';
import { ResourceType } from '../../../shared/enums/libary/resource-type.enum';
import { TranslateKeys } from '../../../shared/enums/translate-keys';
import { IHeaderAnimation, IHeaderAnimeImage, IHeaderSearchbar, IHeaderSegment } from '../../../shared/interfaces/header/header';
import { IResource } from '../../../shared/interfaces/resource/resource.interface';
import { PageRoutes } from 'src/app/shared/enums/page-routes';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
  standalone: false
})
export class LibraryPage implements OnInit {
  protected readonly PageRoutes = PageRoutes;

  searchTerm: string = '';
  selectedType: ResourceType = ResourceType.DOCUMENT;

  // Header searchbar configuration
  searchbarConfig!: IHeaderSearchbar;

  segment!: IHeaderSegment;
  animation!: IHeaderAnimation;
  animeImage!: IHeaderAnimeImage;
  activeTab: 'document' | 'video' = 'document';

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly ResourceType = ResourceType;

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.initHeader();
  }

  /**
   * Khởi tạo header giống rank.page.ts
   */
  private initHeader(): void {
    // Initialize searchbar configuration
    this.searchbarConfig = {
      placeholder: 'Tìm kiếm video, tài liệu...',
      type: InputTypes.SEARCH,
      inputmode: InputTypes.SEARCH,
      animated: true,
      showClearButton: true,
      debounce: 300
    };

    this.segment = {
      value: this.activeTab,
      buttons: [
        { value: 'document', label: TranslateKeys.RESOURCE_TYPE_DOCUMENT },
        { value: 'video', label: TranslateKeys.RESOURCE_TYPE_VIDEO }
      ]
    };
    this.animeImage = {
      name: 'library',
      imageUrl: '/assets/images/rank/ranking.png',
      width: '120px',
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

  /**
   * Handle search input from header
   */
  onSearchChange(searchTerm: string) {
    this.searchTerm = searchTerm;
  }

  /**
   * Handle segment change from header
   */
  onSegmentChange(value: string | number) {
    this.selectedType = value as ResourceType;
    this.activeTab = value as 'document' | 'video';
  }

  /**
   * Handle resource selection - navigate to detail page
   */
  onResourceSelected(resource: IResource) {
    if (resource && resource.id) {
      this.router.navigateByUrl(`${PageRoutes.LIBRARY}/${resource.id}`);
    }
  }
}
