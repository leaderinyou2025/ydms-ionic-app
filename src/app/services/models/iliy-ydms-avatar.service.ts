import { Injectable } from '@angular/core';

import { OdooService } from '../odoo/odoo.service';
import { IAssetsResource } from '../../shared/interfaces/settings/assets-resource';
import { ILiyYdmsAvatar } from '../../shared/interfaces/models/liy.ydms.avatar';
import { ModelName } from '../../shared/enums/model-name';
import { CommonConstants } from '../../shared/classes/common-constants';
import { OrderBy } from '../../shared/enums/order-by';

@Injectable({
  providedIn: 'root'
})
export class LiyYdmsAvatarService {

  private liyYdmsAvatarFields = ['name', 'tags', 'image_256'];

  constructor(
    private odooService: OdooService,
  ) {
  }

  /**
   * Get all avatar image from server
   */
  public async getImages(): Promise<Array<IAssetsResource>> {
    const avatars = await this.odooService.searchRead<ILiyYdmsAvatar>(
      ModelName.AVATAR, [], this.liyYdmsAvatarFields, 0, 0, OrderBy.CREATE_AT_ASC
    );
    if (!avatars?.length) return [];

    const avatarAssets = new Array<IAssetsResource>();
    for (const avatar of avatars) {
      avatarAssets.push({
        id: avatar.id,
        name: avatar.name,
        resource_url: `${CommonConstants.detectMimeType(avatar.image_256)}${avatar.image_256}`,
        resource_string: avatar.image_256
      });
    }

    return avatarAssets;
  }
}
