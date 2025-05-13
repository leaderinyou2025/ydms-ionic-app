import { IAuthData } from '../interfaces/auth/auth-data';
import { UserRoles } from '../enums/user-roles';
import { Theme } from '../enums/theme';
import { ILiyYdmsAssetsResource } from '../interfaces/models/liy-ydms-assets-resource';
import { TextZoomSize } from '../enums/text-zoom-size';
import { AssetResourceCategory } from '../enums/asset-resource-category';
import { StatusItemType } from '../enums/home/status-item-type.enum';
import { IStatusItem, ITask, ICharacter } from '../interfaces/home/home.interfaces';
import { IFriend } from '../interfaces/friend/friend';
import { IRankItem } from '../interfaces/rank/rank.interfaces';
import { IAchievementCategory } from '../interfaces/rank/achievement.interfaces';
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
    { id: 1, name: 'Zoro Đầu rêu', avatar: 'assets/images/avatar/Shiba-Inu-Dog-1.png', likeCount: 100 },
    { id: 2, name: 'Bé thân thiện', avatar: 'assets/images/avatar/Shiba-Inu-Dog-1.png', likeCount: 80 },
    { id: 3, name: 'Hoa tiêu Nami', avatar: 'assets/images/avatar/Shiba-Inu-Dog-1.png', likeCount: 102 },
    { id: 4, name: 'Tứ hoàng Luffy', avatar: 'assets/images/avatar/Shiba-Inu-Dog-1.png', likeCount: 186 },
    { id: 5, name: 'Mèo Tom', avatar: 'assets/images/avatar/Shiba-Inu-Dog-1.png', likeCount: 90 },
    { id: 6, name: 'Vịt Donald', avatar: 'assets/images/avatar/Shiba-Inu-Dog-1.png', likeCount: 50 },
    { id: 7, name: 'Chuột Micky', avatar: 'assets/images/avatar/Shiba-Inu-Dog-1.png', likeCount: 70 },
  ];

  static authData: IAuthData = {
    id: 1,
    login: '0964164434',
    name: 'Phạm Bá Việt',
    role: UserRoles.STUDENT,
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

  /**
   * Tasks detail
   */
  static tasksDetail = {
    id: 1,
    name: 'Nhiệm vụ 1',
    questions: [
      {
        text: 'Tôi có thể thảo luận về niềm tin của mình với mẹ/cha mà không cảm thấy bị gò bó hay xấu hổ.',
        options: [
          { text: 'Đúng', selected: true },
          { text: 'Tôi thấy hơi xấu hổ', selected: false }
        ]
      },
      {
        text: 'Đôi khi tôi gặp khó khăn trong việc tin vào mọi điều mẹ/cha nói với tôi.',
        options: [
          { text: 'Đúng', selected: false },
          { text: 'Không đúng', selected: true },
          { text: 'Tôi không rõ', selected: false }
        ]
      },
      {
        text: 'Mẹ/cha tôi luôn là người biết lắng nghe.',
        options: [
          { text: 'Đúng', selected: true },
          { text: 'Không đúng', selected: false }
        ]
      },
      {
        text: 'Mẹ/cha tôi luôn là người không biết lắng nghe.',
        options: [
          { text: 'Đúng', selected: false },
          { text: 'Không đúng', selected: false }
        ]
      }
    ]
  };

  static rankData: Array<IRankItem> = [
    { userId: 1, position: 1, nickname: 'Zoro Đầu rêu', points: 250, avatar: null },
    { userId: 2, position: 2, nickname: 'Bé thân thiện', points: 245, avatar: null },
    { userId: 3, position: 3, nickname: 'Hoa tiêu Nami', points: 220, avatar: null },
    { userId: 4, position: 4, nickname: 'Tứ hoàng Luffy', points: 186, avatar: null },
    { userId: 5, position: 5, nickname: 'Mèo Tom', points: 180, avatar: null },
    { userId: 6, position: 6, nickname: 'Vịt Donald', points: 168, avatar: null },
    { userId: 7, position: 7, nickname: 'Chuột Micky', points: 160, avatar: null },
    { userId: 8, position: 8, nickname: 'Chuột Micky1', points: 160, avatar: null },
    { userId: 9, position: 9, nickname: 'Chuột Micky2', points: 160, avatar: null },
    { userId: 10, position: 10, nickname: 'Chuột Micky3', points: 160, avatar: null },
  ];


  static currentUserRank: IRankItem = {
    userId: 999,
    position: 11,
    nickname: 'Nhóc Conan',
    points: 120,
    avatar: null,
    isCurrentUser: true,
  };

  static achievementCategories: Array<IAchievementCategory> = [
    {
      title: 'Cảm xúc',
      badges: [
        { name: 'Hoa hậu thân thiện', desc: '', unlocked: true, isNew: true, image: 'https://64.media.tumblr.com/9c7a316de427182c4404dd7189a37047/843c0e4a552c60eb-e8/s540x810/06a658046765d7b0d7089655004a877f66d2b181.jpg' },
        { name: 'Thiện xạ', desc: '3 trên 5', unlocked: true, isNew: true, image: 'https://preview.redd.it/tell-me-who-would-be-simping-for-these-characters-v0-n1p8f6n9e52e1.png?width=277&format=png&auto=webp&s=b3af047af94f561002f6af879cf84d8c4c161cc6' },
        { name: 'Vị thần KN', desc: '3 trên 10', unlocked: true, isNew: true, image: 'https://i.redd.it/tell-me-who-would-be-simping-for-these-characters-v0-3booxv46e52e1.png?width=277&format=png&auto=webp&s=3bff9a7a4658f7d9b54ace423823bc89b1ecfa70' },
      ],
    },
    {
      title: 'Giảm mâu thuẫn gia đình',
      badges: [
        { name: 'Đại gia từ vựng', desc: '2 trên 10', unlocked: true, isNew: true, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMVSrt0AjNphqU5mPFHoFUpQ-kfgKXCuWsDQ&s' },
        { name: 'Thợ săn nhiệm vụ', desc: '', unlocked: false, isNew: false, image: 'https://preview.redd.it/duolingo-be-looking-strangely-familiar-with-those-sunglasses-v0-mqv1u18vyomc1.jpeg?auto=webp&s=2b9336a9479bf4dac9acef4772244015cc97d7c0' },
        { name: 'Thợ sửa lỗi sai', desc: '', unlocked: false, isNew: false, image: 'https://preview.redd.it/duolingo-be-looking-strangely-familiar-with-those-sunglasses-v0-mqv1u18vyomc1.jpeg?auto=webp&s=2b9336a9479bf4dac9acef4772244015cc97d7c0' },
      ],
    },
    {
      title: 'Cải thiện giao tiếp',
      badges: [
        { name: 'Người tiếp lửa', desc: '', unlocked: false, isNew: false, image: 'https://preview.redd.it/duolingo-be-looking-strangely-familiar-with-those-sunglasses-v0-mqv1u18vyomc1.jpeg?auto=webp&s=2b9336a9479bf4dac9acef4772244015cc97d7c0' },
        { name: 'Quán quân', desc: '', unlocked: false, isNew: false, image: 'https://preview.redd.it/duolingo-be-looking-strangely-familiar-with-those-sunglasses-v0-mqv1u18vyomc1.jpeg?auto=webp&s=2b9336a9479bf4dac9acef4772244015cc97d7c0' },
        { name: 'Thợ săn đêm', desc: '', unlocked: false, isNew: false, image: 'https://preview.redd.it/duolingo-be-looking-strangely-familiar-with-those-sunglasses-v0-mqv1u18vyomc1.jpeg?auto=webp&s=2b9336a9479bf4dac9acef4772244015cc97d7c0' },
      ],
    },
    {
      title: 'Khám phá bản thân',
      badges: [
        { name: 'Dậy sớm', desc: '', unlocked: false, isNew: false, image: 'https://preview.redd.it/duolingo-be-looking-strangely-familiar-with-those-sunglasses-v0-mqv1u18vyomc1.jpeg?auto=webp&s=2b9336a9479bf4dac9acef4772244015cc97d7c0' },
        { name: 'Huyền thoại', desc: '', unlocked: false, isNew: false, image: 'https://preview.redd.it/duolingo-be-looking-strangely-familiar-with-those-sunglasses-v0-mqv1u18vyomc1.jpeg?auto=webp&s=2b9336a9479bf4dac9acef4772244015cc97d7c0' },
        { name: 'Tay đua tốc độ', desc: '', unlocked: false, isNew: false, image: 'https://preview.redd.it/duolingo-be-looking-strangely-familiar-with-those-sunglasses-v0-mqv1u18vyomc1.jpeg?auto=webp&s=2b9336a9479bf4dac9acef4772244015cc97d7c0' },
      ],
    },
  ];

  static friends: Array<IFriend> = [
    { id: 1, name: 'Zoro Đầu rêu', avatar: 'assets/images/avatar/Shiba-Inu-Dog-1.png', likeCount: 100 },
    { id: 2, name: 'Bé thân thiện', avatar: 'assets/images/avatar/Shiba-Inu-Dog-1.png', likeCount: 80 },
    { id: 3, name: 'Hoa tiêu Nami', avatar: 'assets/images/avatar/Shiba-Inu-Dog-1.png', likeCount: 102 },
    { id: 4, name: 'Tứ hoàng Luffy', avatar: 'assets/images/avatar/Shiba-Inu-Dog-1.png', likeCount: 186 },
    { id: 5, name: 'Mèo Tom', avatar: 'assets/images/avatar/Shiba-Inu-Dog-1.png', likeCount: 90 },
    { id: 6, name: 'Vịt Donald', avatar: 'assets/images/avatar/Shiba-Inu-Dog-1.png', likeCount: 50 },
    { id: 7, name: 'Chuột Micky', avatar: 'assets/images/avatar/Shiba-Inu-Dog-1.png', likeCount: 70 },
  ];
}
