import { IAuthData } from '../interfaces/auth/auth-data';
import { IUserRoles } from '../enums/user-roles';
import { Theme } from '../enums/theme';
import { ILiyYdmsAssetsResource } from '../interfaces/models/liy-ydms-assets-resource';
import { TextZoomSize } from '../enums/text-zoom-size';
import { AssetResourceCategory } from '../enums/asset-resource-category';

export class ForceTestData {

  static background_images: Array<ILiyYdmsAssetsResource> = [
    {id: 1, resource_url: 'assets/images/background/bananas-7840213_1920.jpg', name: 'Chuối vườn nhà'},
    {id: 2, resource_url: 'assets/images/background/beach-5234306_1920.jpg', name: 'Biển Đông'},
    {id: 3, resource_url: 'assets/images/background/city-7629244_1920.jpg', name: 'Thành phố phồn hoa'},
    {id: 4, resource_url: 'assets/images/background/santa-claus-6845491_1920.jpg', name: 'Ông già Noel'},
  ];
  static avatar_images: Array<ILiyYdmsAssetsResource> = [
    {id: 1, resource_url: 'assets/images/avatar/Shiba-Inu-Dog.png', name: 'Shiba-Inu-Dog'},
    {id: 2, resource_url: 'assets/images/avatar/Shiba-Inu-Dog-1.png', name: 'Shiba-Inu-Dog-1'},
    {id: 3, resource_url: 'assets/images/avatar/Shiba-Inu-Dog-2.png', name: 'Shiba-Inu-Dog-2'},
    {id: 4, resource_url: 'assets/images/avatar/Shiba-Inu-Dog-3.png', name: 'Shiba-Inu-Dog-3'},
    {id: 5, resource_url: 'assets/images/avatar/Shiba-Inu-Dog-Showing-Muscles.png', name: 'Shiba-Inu-Dog-Showing-Muscles'},
  ];
  static background_sounds: Array<ILiyYdmsAssetsResource> = [
    {id: 1, resource_url: '/assets/sounds/cork-85200.mp3', name: 'cork-85200', category: AssetResourceCategory.EFFECT},
    {id: 2, resource_url: '/assets/sounds/reload-124467.mp3', name: 'reload-124467', category: AssetResourceCategory.EFFECT},
    {id: 3, resource_url: '/assets/sounds/alert-234711.mp3', name: 'alert-234711', category: AssetResourceCategory.EFFECT},
    {id: 4, resource_url: '/assets/sounds/background.mp3', name: 'Pikachu', category: AssetResourceCategory.BACKGROUND},
  ]

  static loginResult = {result: 1};
  static authData: IAuthData = {
    id: 1,
    login: '0964164434',
    name: 'Phạm Bá Việt',
    role: IUserRoles.STUDENT,
    nickname: 'Sóc nâu',
    phone: '0964164434',
    email: 'viet220994@gmail.com',
    birthday: '1994-09-22',
    user_settings: {
      notification: {enabled: true},
      sound: {
        touch: {
          enabled: true,
          volume: 0.7,
          sound: this.background_sounds[0]
        },
        reload: {
          enabled: true,
          volume: 0.7,
          sound: this.background_sounds[1]
        },
        notification: {
          enabled: true,
          volume: 0.7,
          sound: this.background_sounds[2]
        },
        background: {
          enabled: true,
          volume: 0.5,
          sound: this.background_sounds[3]
        },
      },
      theme: {
        theme_model: Theme.DARK,
        background: this.background_images[0],
        avatar: this.avatar_images[0],
        text_size: TextZoomSize.MEDIUM
      },
      account_security: {},
      privacy_rights: {}
    }
  };
}
