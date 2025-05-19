import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ResourceService } from '../../../services/resource/resource.service';
import { IResource } from '../../interfaces/resource/resource.interface';
import { ResourceType } from '../../enums/libary/resource-type.enum';
import { ResourceTopic } from '../../enums/libary/resource-topic.enum';
import { TranslateKeys } from '../../enums/translate-keys';

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss'],
  standalone: false,
})
export class ResourceListComponent implements OnInit, OnChanges {
  @Input() searchTerm: string = '';
  @Input() selectedType: ResourceType = ResourceType.ALL;
  @Output() resourceSelected = new EventEmitter<IResource>();

  resources: IResource[] = [];
  totalResources: number = 0;
  selectedTopic: ResourceTopic = ResourceTopic.ALL;
  isLoading: boolean = false;

  // Pagination parameters
  currentPage: number = 0;
  pageSize: number = 10;
  hasMoreData: boolean = true;

  // Enums for template
  protected readonly ResourceType = ResourceType;
  protected readonly ResourceTopic = ResourceTopic;
  protected readonly TranslateKeys = TranslateKeys;

  // Topic filters array for template - used to generate topic filter buttons
  topicFilters = [
    { topic: ResourceTopic.ALL, icon: 'apps-outline', translationKey: TranslateKeys.RESOURCE_TOPIC_ALL },
    { topic: ResourceTopic.MUSIC, icon: 'musical-notes-outline', translationKey: TranslateKeys.RESOURCE_TOPIC_MUSIC },
    { topic: ResourceTopic.EDUCATION, icon: 'school-outline', translationKey: TranslateKeys.RESOURCE_TOPIC_EDUCATION },
    { topic: ResourceTopic.SCIENCE, icon: 'flask-outline', translationKey: TranslateKeys.RESOURCE_TOPIC_SCIENCE },
    { topic: ResourceTopic.TECHNOLOGY, icon: 'code-outline', translationKey: TranslateKeys.RESOURCE_TOPIC_TECHNOLOGY },
    { topic: ResourceTopic.ARTS, icon: 'color-palette-outline', translationKey: TranslateKeys.RESOURCE_TOPIC_ARTS },
    { topic: ResourceTopic.SPORTS, icon: 'football-outline', translationKey: TranslateKeys.RESOURCE_TOPIC_SPORTS }
  ];

  // Topic thumbnail mapping
  topicThumbnails: Record<string, string> = {};

  constructor(
    private resourceService: ResourceService
  ) {
    // Initialize topic thumbnails
    Object.values(ResourceTopic).forEach(topic => {
      if (topic !== ResourceTopic.ALL) {
        this.topicThumbnails[topic] = this.resourceService.getTopicThumbnail(topic as ResourceTopic);
      }
    });
  }

  ngOnInit() {
    this.loadResources();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Reload resources when search term or selected type changes
    if ((changes['searchTerm'] && !changes['searchTerm'].firstChange) ||
        (changes['selectedType'] && !changes['selectedType'].firstChange)) {
      this.loadResources(null, true);
    }
  }


  loadResources(event?: any, refresh: boolean = false) {
    this.isLoading = true;

    // Reset pagination if refreshing
    if (refresh) {
      this.currentPage = 0;
      this.resources = [];
      this.hasMoreData = true;
    }

    // Calculate offset based on current page and page size
    const offset = this.currentPage * this.pageSize;

    // Call service with filtering and pagination parameters
    this.resourceService.getResources(
      this.searchTerm,
      this.selectedType,
      this.selectedTopic,
      offset,
      this.pageSize
    ).subscribe(result => {
      this.isLoading = false;

      // If refreshing, replace the list, otherwise append
      if (refresh) {
        this.resources = result.resources;
      } else {
        this.resources = [...this.resources, ...result.resources];
      }

      this.totalResources = result.total;

      // Check if we've loaded all available data
      this.hasMoreData = this.resources.length < result.total;

      // Complete the infinite scroll event if provided
      if (event) {
        event.target.complete();

        // Disable infinite scroll if no more data
        if (!this.hasMoreData) {
          event.target.disabled = true;
        }
      }
    });
  }

  loadMore(event: any) {
    // Increment page before loading more
    this.currentPage++;
    this.loadResources(event);
  }

  doRefresh(event: any) {
    // Reset and reload data
    this.loadResources(event, true);
  }

  /**
   * Handle search input changes
   */
  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    // Reset pagination and reload with search term
    this.loadResources(null, true);
  }

  /**
   * Handle resource type filter changes
   */
  onTypeChange(type: ResourceType) {
    this.selectedType = type;
    // Reset pagination and reload with new filter
    this.loadResources(null, true);
  }

  /**
   * Handle topic filter changes
   */
  onTopicChange(topic: ResourceTopic) {
    this.selectedTopic = topic;
    // Reset pagination and reload with new filter
    this.loadResources(null, true);
  }

  onResourceSelect(resource: IResource) {
    // Emit the event for parent component to handle navigation
    this.resourceSelected.emit(resource);
  }

  getResourceTypeIcon(type: ResourceType): string {
    return type === ResourceType.VIDEO ? 'videocam-outline' : 'document-text-outline';
  }

  getResourceTopicIcon(topic: ResourceTopic): string {
    switch (topic) {
      case ResourceTopic.MUSIC:
        return 'musical-notes-outline';
      case ResourceTopic.EDUCATION:
        return 'school-outline';
      case ResourceTopic.SCIENCE:
        return 'flask-outline';
      case ResourceTopic.TECHNOLOGY:
        return 'code-outline';
      case ResourceTopic.ARTS:
        return 'color-palette-outline';
      case ResourceTopic.SPORTS:
        return 'football-outline';
      case ResourceTopic.ALL:
      default:
        return 'apps-outline';
    }
  }

  getResourceTopicTranslation(topic: ResourceTopic): string {
    return `RESOURCE.topic_${topic.toLowerCase()}`;
  }
}
