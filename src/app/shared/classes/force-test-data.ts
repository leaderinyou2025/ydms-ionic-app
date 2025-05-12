import { IAuthData } from '../interfaces/auth/auth-data';
import { IUserRoles } from '../enums/user-roles';
import { Theme } from '../enums/theme';
import { ILiyYdmsAssetsResource } from '../interfaces/models/liy-ydms-assets-resource';
import { TextZoomSize } from '../enums/text-zoom-size';
import { AssetResourceCategory } from '../enums/asset-resource-category';
import { StatusItemType } from '../enums/home/status-item-type.enum';
import { IStatusItem, ITask, ICharacter } from '../interfaces/home/home.interfaces';
import { IFriend } from '../interfaces/friend/friend';

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

  /**
   * Status bar items data
   */
  static statusItems: IStatusItem[] = [
    {
      type: StatusItemType.BADGE,
      value: 38,
      label: 'Huy hiệu',
    },
    {
      type: StatusItemType.RANK,
      value: 3,
      label: 'Xếp hạng',
    },
    {
      type: StatusItemType.MISSION,
      value: 15,
      label: 'Nhiệm vụ',
    },
    {
      type: StatusItemType.FRIENDLY,
      value: 186,
      label: 'Thân thiện',
    }
  ];

  /**
   * Character information
   */
  static character: ICharacter = {
    name: 'Nhóc Conan',
    imagePath: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSF10h3GYPGAgmRRGUuxqwMCc42yX8WLiw_UnxYIkHmxHYveDoa',
  };

  /**
   * Tasks data
   */
  static tasks: ITask[] = [
    {
      id: 1,
      description: 'Nếu cảm xúc của con là thời tiết, thì hôm nay là nắng, mưa hay nhiều mây?',
      points: 5
    },
    {
      id: 2,
      description: 'Tuần lễ cảm xúc tích cực',
      points: 15
    },
    {
      id: 3,
      description: 'Bạn thích sáng tạo? Hãy thử khóa học vẽ tranh sơ dành cho người mới bắt đầu.',
      points: 10
    },
  ];

  static loginResult = {result: 1};
  static friends: Array<IFriend> = [
    { id: 1, name: 'Zoro Đầu rêu', avatar: 'assets/images/avatar/Shiba-Inu-Dog-1.png', likeCount: 100, rank: 5, achievements: 25, friendshipLevel: 120 },
    { id: 2, name: 'Bé thân thiện', avatar: 'assets/images/avatar/Shiba-Inu-Dog-2.png', likeCount: 80, rank: 8, achievements: 15, friendshipLevel: 90 },
    { id: 3, name: 'Hoa tiêu Nami', avatar: 'assets/images/avatar/Shiba-Inu-Dog-3.png', likeCount: 102, rank: 4, achievements: 30, friendshipLevel: 150 },
    { id: 4, name: 'Tứ hoàng Luffy', avatar: 'assets/images/avatar/Shiba-Inu-Dog.png', likeCount: 186, rank: 1, achievements: 38, friendshipLevel: 186 },
    { id: 5, name: 'Mèo Tom', avatar: 'assets/images/avatar/Shiba-Inu-Dog-Showing-Muscles.png', likeCount: 90, rank: 6, achievements: 20, friendshipLevel: 95 },
    { id: 6, name: 'Vịt Donald', avatar: 'assets/images/avatar/Shiba-Inu-Dog-1.png', likeCount: 50, rank: 10, achievements: 12, friendshipLevel: 60 },
    { id: 7, name: 'Chuột Micky', avatar: 'assets/images/avatar/Shiba-Inu-Dog-2.png', likeCount: 70, rank: 9, achievements: 18, friendshipLevel: 75 },
    { id: 8, name: 'Nhóc Conan', avatar: 'assets/images/avatar/Shiba-Inu-Dog-3.png', likeCount: 186, rank: 3, achievements: 38, friendshipLevel: 186 },
  ];

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
