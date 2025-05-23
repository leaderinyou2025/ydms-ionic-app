import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { IAchievement, IBadge } from '../../../../shared/interfaces/rank/rank.interfaces';
import { TranslateKeys } from '../../../../shared/enums/translate-keys';
import { IonInfiniteHorizontalDirective } from '../../../../core/directive/ion-infinite-horizontal.directive';
import { AreaOfExpertise } from '../../../../shared/enums/area-of-expertise';
import { CommonConstants } from '../../../../shared/classes/common-constants';

@Component({
  selector: 'app-badge-horizontal-list',
  templateUrl: './badge-horizontal-list.component.html',
  styleUrls: ['./badge-horizontal-list.component.scss'],
  standalone: false,
})
export class BadgeHorizontalListComponent implements OnInit {

  @Input() achievements!: IAchievement[];
  @Input() badges!: IBadge[];
  @Input() areaOfExpertise!: AreaOfExpertise;
  @Output() ionInfinite = new EventEmitter<IonInfiniteHorizontalDirective>();
  achievementsFiltered!: IAchievement[];

  protected readonly TranslateKeys = TranslateKeys;
  protected readonly AreaOfExpertise = AreaOfExpertise;

  constructor() {
  }

  ngOnInit() {
    this.achievementsFiltered = new Array<IAchievement>();
    if (this.achievements?.length) {
      this.achievementsFiltered = this.achievements.filter(u => u.area_of_expertise === this.areaOfExpertise);
    }
  }

  /**
   * Get base64 resource url
   * @param base64Resource
   */
  public getResourceImageUrl(base64Resource?: string): string {
    if (!base64Resource) return CommonConstants.defaultBadgeImage;
    const type = CommonConstants.detectMimeType(base64Resource);
    if (!type) return CommonConstants.defaultBadgeImage;
    return `${type}${base64Resource}`;
  }

  /**
   * Emit output event infinite scroll
   * @param event
   */
  public loadMoreBadges(event: IonInfiniteHorizontalDirective): void {
    this.ionInfinite.emit(event);
  }

}
