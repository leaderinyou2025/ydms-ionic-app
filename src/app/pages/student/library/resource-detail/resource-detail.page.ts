import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IHeaderAnimation, IHeaderAnimeImage, IHeaderSearchbar } from '../../../../shared/interfaces/header/header';
import { IResource } from '../../../../shared/interfaces/resource/resource.interface';
import { ResourceService } from '../../../../services/resource/resource.service';
import { TranslateKeys } from '../../../../shared/enums/translate-keys';
import { InputTypes } from '../../../../shared/enums/input-types';

@Component({
  selector: 'app-resource-detail',
  templateUrl: './resource-detail.page.html',
  styleUrls: ['./resource-detail.page.scss'],
  standalone: false

})
export class ResourceDetailPage implements OnInit {
  resource?: IResource;
  isLoading: boolean = true;

  // Header configuration
  searchbarConfig!: IHeaderSearchbar;

  animation!: IHeaderAnimation;
  animeImage!: IHeaderAnimeImage;

  protected readonly TranslateKeys = TranslateKeys;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private resourceService: ResourceService
  ) { }

  ngOnInit() {
    this.initHeader();
    this.loadResource();
  }

  /**
   * Initialize header configuration
   */
  private initHeader(): void {
    // Initialize searchbar configuration
    this.searchbarConfig = {
      placeholder:"Tìm kiếm video, tài liệu...",
      type: InputTypes.TEXT,
      inputmode: InputTypes.TEXT,
      animated: true,
      showClearButton: true,
      debounce: 300
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
   * Load resource data based on route parameter
   */
  private loadResource(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;
      this.resourceService.getResourceById(Number(id)).subscribe({
        next: (resource) => {
          this.resource = resource;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading resource:', error);
          this.isLoading = false;
        }
      });
    }
  }

  /**
   * Navigate back to the resource list
   */
  onBackToList(): void {
    this.router.navigate(['/library']);
  }
}
