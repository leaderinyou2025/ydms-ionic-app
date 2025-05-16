import { IAuthData } from '../interfaces/auth/auth-data';
import { Theme } from '../enums/theme';
import { IAssetsResource } from '../interfaces/settings/assets-resource';
import { TextZoomSize } from '../enums/text-zoom-size';
import { AssetResourceCategory } from '../enums/asset-resource-category';
import { StatusItemType } from '../enums/home/status-item-type.enum';
import { ICharacter, IStatusItem, ITask } from '../interfaces/home/home.interfaces';
import { IFriend } from '../interfaces/friend/friend';
import { IRankItem } from '../interfaces/rank/rank.interfaces';
import { IAchievementCategory } from '../interfaces/rank/achievement.interfaces';

import { EmotionType } from '../enums/personal-diary/personal-diary.enum';
import { IEmotionSuggestion, IPersonalDiaryEntry } from '../interfaces/personal-diary/personal-diary.interfaces';

export class ForceTestData {

  static background_images: Array<IAssetsResource> = [
    {id: 1, resource_url: 'assets/images/background/pexels-eugene-golovesov-1810803-30980499.jpg', name: 'Nụ thường xuân'},
    {id: 2, resource_url: 'assets/images/background/beach-5234306_1920.jpg', name: 'Biển Đông'},
    {id: 3, resource_url: 'assets/images/background/bananas-7840213_1920.jpg', name: 'Chuối vườn nhà'},
    {id: 4, resource_url: 'assets/images/background/santa-claus-6845491_1920.jpg', name: 'Ông già Noel'},
    {id: 5, resource_url: 'assets/images/background/city-7629244_1920.jpg', name: 'Thành phố phồn hoa'},
    {id: 6, resource_url: 'assets/images/background/pexels-rahulp9800-1212487.jpg', name: 'Cúc họa mi'},
  ];
  static avatar_images: Array<IAssetsResource> = [
    {id: 1, resource_url: 'assets/images/avatar/conan.png', name: 'Thám tử Conan'},
    {id: 2, resource_url: 'assets/images/avatar/Shiba-Inu-Dog-1.png', name: 'Shiba-Inu-Dog-1'},
    {id: 3, resource_url: 'assets/images/avatar/Shiba-Inu-Dog-2.png', name: 'Shiba-Inu-Dog-2'},
    {id: 4, resource_url: 'assets/images/avatar/Shiba-Inu-Dog-3.png', name: 'Shiba-Inu-Dog-3'},
    {id: 5, resource_url: 'assets/images/avatar/Shiba-Inu-Dog-Showing-Muscles.png', name: 'Shiba-Inu-Dog-Showing-Muscles'},
    {id: 6, resource_url: 'assets/images/avatar/Shiba-Inu-Dog.png', name: 'Shiba-Inu-Dog'},
  ];
  static background_sounds: Array<IAssetsResource> = [
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
    imagePath: '/assets/images/avatar/conan.png',
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

  static authData: IAuthData = {
    id: 1,
    login: '0964164434',
    name: 'Phạm Bá Việt',
    is_teenager: true,
    is_parent: false,
    is_teacher: false,
    nickname: 'Sóc nâu',
    phone: '0964164434',
    email: 'viet220994@gmail.com',
    // birthday: '1994-09-22',
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
          {text: 'Đúng', selected: true},
          {text: 'Tôi thấy hơi xấu hổ', selected: false}
        ]
      },
      {
        text: 'Đôi khi tôi gặp khó khăn trong việc tin vào mọi điều mẹ/cha nói với tôi.',
        options: [
          {text: 'Đúng', selected: false},
          {text: 'Không đúng', selected: true},
          {text: 'Tôi không rõ', selected: false}
        ]
      },
      {
        text: 'Mẹ/cha tôi luôn là người biết lắng nghe.',
        options: [
          {text: 'Đúng', selected: true},
          {text: 'Không đúng', selected: false}
        ]
      },
      {
        text: 'Mẹ/cha tôi luôn là người không biết lắng nghe.',
        options: [
          {text: 'Đúng', selected: false},
          {text: 'Không đúng', selected: false}
        ]
      }
    ]
  };

  static rankData: Array<IRankItem> = [
    {userId: 1, position: 1, nickname: 'Zoro Đầu rêu', points: 250, avatar: null},
    {userId: 2, position: 2, nickname: 'Bé thân thiện', points: 245, avatar: null},
    {userId: 3, position: 3, nickname: 'Hoa tiêu Nami', points: 220, avatar: null},
    {userId: 4, position: 4, nickname: 'Tứ hoàng Luffy', points: 186, avatar: null},
    {userId: 5, position: 5, nickname: 'Mèo Tom', points: 180, avatar: null},
    {userId: 6, position: 6, nickname: 'Vịt Donald', points: 168, avatar: null},
    {userId: 7, position: 7, nickname: 'Chuột Micky', points: 160, avatar: null},
    {userId: 8, position: 8, nickname: 'Chuột Micky1', points: 160, avatar: null},
    {userId: 9, position: 9, nickname: 'Chuột Micky2', points: 160, avatar: null},
    {userId: 10, position: 10, nickname: 'Chuột Micky3', points: 160, avatar: null},
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
        {name: 'Hoa hậu thân thiện', desc: '', unlocked: true, isNew: true, image: 'https://64.media.tumblr.com/9c7a316de427182c4404dd7189a37047/843c0e4a552c60eb-e8/s540x810/06a658046765d7b0d7089655004a877f66d2b181.jpg'},
        {name: 'Thiện xạ', desc: '3 trên 5', unlocked: true, isNew: true, image: 'https://preview.redd.it/tell-me-who-would-be-simping-for-these-characters-v0-n1p8f6n9e52e1.png?width=277&format=png&auto=webp&s=b3af047af94f561002f6af879cf84d8c4c161cc6'},
        {name: 'Vị thần KN', desc: '3 trên 10', unlocked: true, isNew: true, image: 'https://i.redd.it/tell-me-who-would-be-simping-for-these-characters-v0-3booxv46e52e1.png?width=277&format=png&auto=webp&s=3bff9a7a4658f7d9b54ace423823bc89b1ecfa70'},
      ],
    },
    {
      title: 'Giảm mâu thuẫn gia đình',
      badges: [
        {name: 'Đại gia từ vựng', desc: '2 trên 10', unlocked: true, isNew: true, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMVSrt0AjNphqU5mPFHoFUpQ-kfgKXCuWsDQ&s'},
        {name: 'Thợ săn nhiệm vụ', desc: '', unlocked: false, isNew: false, image: 'https://preview.redd.it/duolingo-be-looking-strangely-familiar-with-those-sunglasses-v0-mqv1u18vyomc1.jpeg?auto=webp&s=2b9336a9479bf4dac9acef4772244015cc97d7c0'},
        {name: 'Thợ sửa lỗi sai', desc: '', unlocked: false, isNew: false, image: 'https://preview.redd.it/duolingo-be-looking-strangely-familiar-with-those-sunglasses-v0-mqv1u18vyomc1.jpeg?auto=webp&s=2b9336a9479bf4dac9acef4772244015cc97d7c0'},
      ],
    },
    {
      title: 'Cải thiện giao tiếp',
      badges: [
        {name: 'Người tiếp lửa', desc: '', unlocked: false, isNew: false, image: 'https://preview.redd.it/duolingo-be-looking-strangely-familiar-with-those-sunglasses-v0-mqv1u18vyomc1.jpeg?auto=webp&s=2b9336a9479bf4dac9acef4772244015cc97d7c0'},
        {name: 'Quán quân', desc: '', unlocked: false, isNew: false, image: 'https://preview.redd.it/duolingo-be-looking-strangely-familiar-with-those-sunglasses-v0-mqv1u18vyomc1.jpeg?auto=webp&s=2b9336a9479bf4dac9acef4772244015cc97d7c0'},
        {name: 'Thợ săn đêm', desc: '', unlocked: false, isNew: false, image: 'https://preview.redd.it/duolingo-be-looking-strangely-familiar-with-those-sunglasses-v0-mqv1u18vyomc1.jpeg?auto=webp&s=2b9336a9479bf4dac9acef4772244015cc97d7c0'},
      ],
    },
    {
      title: 'Khám phá bản thân',
      badges: [
        {name: 'Dậy sớm', desc: '', unlocked: false, isNew: false, image: 'https://preview.redd.it/duolingo-be-looking-strangely-familiar-with-those-sunglasses-v0-mqv1u18vyomc1.jpeg?auto=webp&s=2b9336a9479bf4dac9acef4772244015cc97d7c0'},
        {name: 'Huyền thoại', desc: '', unlocked: false, isNew: false, image: 'https://preview.redd.it/duolingo-be-looking-strangely-familiar-with-those-sunglasses-v0-mqv1u18vyomc1.jpeg?auto=webp&s=2b9336a9479bf4dac9acef4772244015cc97d7c0'},
        {name: 'Tay đua tốc độ', desc: '', unlocked: false, isNew: false, image: 'https://preview.redd.it/duolingo-be-looking-strangely-familiar-with-those-sunglasses-v0-mqv1u18vyomc1.jpeg?auto=webp&s=2b9336a9479bf4dac9acef4772244015cc97d7c0'},
      ],
    },
  ];

  static friends: Array<IFriend> = [
    {id: 1, name: 'Zoro Đầu rêu', avatar: 'assets/images/avatar/Shiba-Inu-Dog-1.png', likeCount: 100, rank: 5, achievements: 25, friendshipLevel: 120},
    {id: 2, name: 'Bé thân thiện', avatar: 'assets/images/avatar/Shiba-Inu-Dog-2.png', likeCount: 80, rank: 8, achievements: 15, friendshipLevel: 90},
    {id: 3, name: 'Hoa tiêu Nami', avatar: 'assets/images/avatar/Shiba-Inu-Dog-3.png', likeCount: 102, rank: 4, achievements: 30, friendshipLevel: 150},
    {id: 4, name: 'Tứ hoàng Luffy', avatar: 'assets/images/avatar/Shiba-Inu-Dog.png', likeCount: 186, rank: 1, achievements: 38, friendshipLevel: 186},
    {id: 5, name: 'Mèo Tom', avatar: 'assets/images/avatar/Shiba-Inu-Dog-Showing-Muscles.png', likeCount: 90, rank: 6, achievements: 20, friendshipLevel: 95},
    {id: 6, name: 'Vịt Donald', avatar: 'assets/images/avatar/Shiba-Inu-Dog-1.png', likeCount: 50, rank: 10, achievements: 12, friendshipLevel: 60},
    {id: 7, name: 'Chuột Micky', avatar: 'assets/images/avatar/Shiba-Inu-Dog-2.png', likeCount: 70, rank: 9, achievements: 18, friendshipLevel: 75},
    {id: 8, name: 'Nhóc Conan', avatar: 'assets/images/avatar/Shiba-Inu-Dog-3.png', likeCount: 186, rank: 3, achievements: 38, friendshipLevel: 186},
  ];

  /**
   * Mock user for shared entries in personal diary
   */
  static mockDiaryUser: IAuthData = {
    id: 2,
    name: 'Bạn lớp 6A',
    nickname: 'Bạn lớp 6A',
    login: 'student2',
    is_teenager: true,
    is_parent: false,
    is_teacher: false,
    avatar_128: 'assets/icons/svg/avatar.svg'
  };

  /**
   * Mock diary entries for personal diary
   */
  static personalDiaryEntries: IPersonalDiaryEntry[] = [
    {
      id: 1,
      user: this.authData,
      content: 'Hôm nay mình cảm thấy vui vì đã hoàn thành bài tập về nhà sớm.',
      emotionType: EmotionType.HAPPY,
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isAnonymous: false,
      isPublic: true,
      likes: 5,
      reactions: {
        love: 3,
        happy: 2,
        sad: 0,
        angry: 0
      },
      userReactions: [
        {userId: 2, reactionType: 'love'},
        {userId: 3, reactionType: 'love'},
        {userId: 4, reactionType: 'love'},
        {userId: 5, reactionType: 'happy'},
        {userId: 6, reactionType: 'happy'}
      ]
    },
    {
      id: 2,
      user: this.mockDiaryUser,
      content: 'Mình đang lo lắng về bài kiểm tra ngày mai. Mình chưa ôn tập đủ.',
      emotionType: EmotionType.ANXIOUS,
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      isAnonymous: false,
      isPublic: true,
      likes: 3,
      reactions: {
        love: 1,
        happy: 0,
        sad: 2,
        angry: 0
      },
      userReactions: [
        {userId: 1, reactionType: 'sad'},
        {userId: 3, reactionType: 'sad'},
        {userId: 5, reactionType: 'love'}
      ]
    },
    {
      id: 3,
      user: this.authData,
      content: 'Mình cảm thấy buồn vì đã làm mất cuốn sách yêu thích.',
      emotionType: EmotionType.SAD,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isAnonymous: false,
      isPublic: false,
      likes: 0
    },
    {
      id: 4,
      user: this.mockDiaryUser,
      content: 'Mình rất tức giận vì bạn trong nhóm không hoàn thành phần việc của mình.',
      emotionType: EmotionType.ANGRY,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      isAnonymous: true,
      isPublic: true,
      likes: 7,
      reactions: {
        love: 2,
        happy: 0,
        sad: 1,
        angry: 4
      },
      userReactions: [
        {userId: 1, reactionType: 'angry'},
        {userId: 3, reactionType: 'angry'},
        {userId: 5, reactionType: 'angry'},
        {userId: 6, reactionType: 'angry'},
        {userId: 7, reactionType: 'love'},
        {userId: 8, reactionType: 'love'},
        {userId: 9, reactionType: 'sad'}
      ]
    },
    {
      id: 5,
      user: this.authData,
      content: 'Mình rất phấn khích vì sắp được đi dã ngoại cùng lớp!',
      emotionType: EmotionType.EXCITED,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isAnonymous: false,
      isPublic: true,
      likes: 10
    }
  ];

  /**
   * Mock emotion suggestions for personal diary
   */
  static emotionSuggestions: IEmotionSuggestion[] = [
    {
      id: 1,
      emotionType: EmotionType.HAPPY,
      suggestions: [
        'Chia sẻ niềm vui với bạn bè',
        'Viết nhật ký về những điều tích cực',
        'Tận hưởng cảm xúc vui vẻ này'
      ]
    },
    {
      id: 2,
      emotionType: EmotionType.SAD,
      suggestions: [
        'Nói chuyện với người thân hoặc bạn bè',
        'Nghe nhạc thư giãn',
        'Viết ra cảm xúc của bạn',
        'Tập thể dục nhẹ nhàng'
      ]
    },
    {
      id: 3,
      emotionType: EmotionType.ANGRY,
      suggestions: [
        'Hít thở sâu và đếm đến 10',
        'Viết ra điều khiến bạn tức giận',
        'Tập thể dục để giải tỏa năng lượng tiêu cực',
        'Nói chuyện với người bạn tin tưởng'
      ]
    },
    {
      id: 4,
      emotionType: EmotionType.ANXIOUS,
      suggestions: [
        'Thực hành các bài tập thở sâu',
        'Tập trung vào hiện tại',
        'Chia sẻ lo lắng với người lớn',
        'Viết ra những điều bạn lo lắng'
      ]
    },
    {
      id: 5,
      emotionType: EmotionType.EXCITED,
      suggestions: [
        'Chia sẻ niềm vui với bạn bè',
        'Lập kế hoạch cho những điều thú vị',
        'Ghi lại cảm xúc trong nhật ký'
      ]
    },
    {
      id: 6,
      emotionType: EmotionType.TIRED,
      suggestions: [
        'Nghỉ ngơi đầy đủ',
        'Uống nhiều nước',
        'Đi ngủ sớm hơn',
        'Tập thể dục nhẹ nhàng'
      ]
    },
    {
      id: 7,
      emotionType: EmotionType.CALM,
      suggestions: [
        'Thực hành thiền định',
        'Đọc sách yêu thích',
        'Dành thời gian cho sở thích'
      ]
    },
    {
      id: 8,
      emotionType: EmotionType.CONFUSED,
      suggestions: [
        'Viết ra những điều bạn đang băn khoăn',
        'Nói chuyện với giáo viên hoặc phụ huynh',
        'Chia nhỏ vấn đề để giải quyết từng phần'
      ]
    }
  ];

}
