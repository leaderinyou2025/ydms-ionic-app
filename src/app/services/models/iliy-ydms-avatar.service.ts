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

  private liyYdmsAvatarFields = ['name', 'tags', 'image_512'];

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
        resource_url: `${CommonConstants.detectMimeType(avatar.image_512)}${avatar.image_512}`,
        resource_string: avatar.image_512
      });
    }

    return avatarAssets;
  }

  /**
   * Get avatar image by id
   * @param id
   */
  public async getImageById(id: number): Promise<ILiyYdmsAvatar | undefined> {
    const avatars = await this.odooService.read<ILiyYdmsAvatar>(ModelName.AVATAR, [id], this.liyYdmsAvatarFields);
    return avatars?.[0];
  }
}
