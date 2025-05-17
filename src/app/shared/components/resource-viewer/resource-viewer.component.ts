import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { IResource } from '../../interfaces/resource/resource.interface';
import { ResourceType } from '../../enums/libary/resource-type.enum';
import { TranslateKeys } from '../../enums/translate-keys';

@Component({
  selector: 'app-resource-viewer',
  templateUrl: './resource-viewer.component.html',
  styleUrls: ['./resource-viewer.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule
  ]
})
export class ResourceViewerComponent implements OnInit, OnChanges {
  @Input() resource?: IResource;

  isLoading: boolean = true;
  safeResourceUrl?: SafeResourceUrl;

  // Enums for template
  protected readonly ResourceType = ResourceType;
  protected readonly TranslateKeys = TranslateKeys;

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.processResource();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['resource']) {
      this.processResource();
    }
  }

  /**
   * Process the resource to prepare for display
   */
  private processResource() {
    if (!this.resource) return;

    this.isLoading = true;

    // Create safe URL for iframe
    if (this.resource.resourceUrl) {
      this.safeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.resource.resourceUrl);
    }
  }

  /**
   * Handle iframe load event
   */
  onIframeLoad() {
    this.isLoading = false;
  }

  /**
   * Check if the resource is a PDF document
   */
  isPdfDocument(): boolean {
    return this.resource?.type === ResourceType.DOCUMENT &&
           (this.resource?.fileType === 'pdf' || this.resource?.resourceUrl?.endsWith('.pdf'));
  }

  /**
   * Check if the resource is a video
   */
  isVideo(): boolean {
    return this.resource?.type === ResourceType.VIDEO;
  }

  /**
   * Check if the resource is an external video (e.g., YouTube)
   */
  isExternalVideo(): boolean {
    return this.isVideo() && !!this.resource?.isExternal;
  }

}


