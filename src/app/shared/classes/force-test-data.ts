
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
import {
  IFamilyConflictSurveyHistory,
  IFamilyConflictSurveyQuestion
} from '../interfaces/family-conflict-survey/family-conflict-survey.interfaces';
import {
  IFamilyCommunicationQualitySurveyHistory,
  IFamilyCommunicationQualitySurveyDetail,
  IFamilyCommunicationQualitySurveyQuestion
} from '../interfaces/family-communication-quality-survey/family-communication-quality-survey.interfaces';
import {
  ISelfDiscoverySurveyHistory,
  ISelfDiscoverySurveyDetail,
  ISelfDiscoverySurveyQuestion
} from '../interfaces/self-discovery-survey/self-discovery-survey.interfaces';

import { EmotionType } from '../enums/personal-diary/personal-diary.enum';
import { IEmotionSuggestion, IPersonalDiaryEntry } from '../interfaces/personal-diary/personal-diary.interfaces';
import { IDailyEmotionJournal, IEmotionIcon, IEmotionStreakStatus, EmotionShareTargetType } from '../interfaces/daily-emotion-journal/daily-emotion-journal.interfaces';

export class ForceTestData {

  /**
   * Conflict level constants
   */
  static ConflictLevels = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    SEVERE: 'severe'
  };

  /**
   * Conflict level emojis
   */
  static ConflictLevelEmojis: Record<string, string> = {
    [ForceTestData.ConflictLevels.LOW]: '🟢',
    [ForceTestData.ConflictLevels.MEDIUM]: '🟡',
    [ForceTestData.ConflictLevels.HIGH]: '🟠',
    [ForceTestData.ConflictLevels.SEVERE]: '🔴'
  };

  /**
   * Get conflict level emoji
   * @param conflictLevel Conflict level
   * @returns Emoji for the conflict level
   */
  static getConflictLevelEmoji(conflictLevel: string): string {
    return ForceTestData.ConflictLevelEmojis[conflictLevel] || '🟢';
  }

  /**
   * Mock data for family conflict survey history
   */
  static mockFamilyConflictSurveyHistory: IFamilyConflictSurveyHistory[] = [
    {
      id: 1,
      date: new Date(2024, 10, 29),
      result: 'Mức độ xung đột thấp',
      conflictLevel: ForceTestData.ConflictLevels.LOW,
      score: 15
    },
    {
      id: 2,
      date: new Date(2024, 10, 22),
      result: 'Mức độ xung đột trung bình',
      conflictLevel: ForceTestData.ConflictLevels.MEDIUM,
      score: 35
    },
    {
      id: 3,
      date: new Date(2024, 10, 15),
      result: 'Mức độ xung đột cao',
      conflictLevel: ForceTestData.ConflictLevels.HIGH,
      score: 65
    },
    {
      id: 4,
      date: new Date(2024, 10, 8),
      result: 'Mức độ xung đột thấp',
      conflictLevel: ForceTestData.ConflictLevels.LOW,
      score: 20
    },
    {
      id: 5,
      date: new Date(2024, 10, 1),
      result: 'Mức độ xung đột trung bình',
      conflictLevel: ForceTestData.ConflictLevels.MEDIUM,
      score: 40
    },
    {
      id: 6,
      date: new Date(2024, 9, 24),
      result: 'Mức độ xung đột nghiêm trọng',
      conflictLevel: ForceTestData.ConflictLevels.SEVERE,
      score: 85
    },
    {
      id: 7,
      date: new Date(2024, 9, 17),
      result: 'Mức độ xung đột cao',
      conflictLevel: ForceTestData.ConflictLevels.HIGH,
      score: 70
    },
    {
      id: 8,
      date: new Date(2024, 9, 10),
      result: 'Mức độ xung đột thấp',
      conflictLevel: ForceTestData.ConflictLevels.LOW,
      score: 25
    },
    {
      id: 9,
      date: new Date(2024, 9, 3),
      result: 'Mức độ xung đột trung bình',
      conflictLevel: ForceTestData.ConflictLevels.MEDIUM,
      score: 45
    },
    {
      id: 10,
      date: new Date(2024, 8, 26),
      result: 'Mức độ xung đột cao',
      conflictLevel: ForceTestData.ConflictLevels.HIGH,
      score: 60
    },
    {
      id: 11,
      date: new Date(2024, 8, 19),
      result: 'Mức độ xung đột nghiêm trọng',
      conflictLevel: ForceTestData.ConflictLevels.SEVERE,
      score: 90
    },
    {
      id: 12,
      date: new Date(2024, 8, 12),
      result: 'Mức độ xung đột thấp',
      conflictLevel: ForceTestData.ConflictLevels.LOW,
      score: 10
    }
  ];

  /**
   * Mock data for family conflict survey questions
   */
  static mockFamilyConflictSurveyQuestions: IFamilyConflictSurveyQuestion[] = [
    {
      id: 1,
      text: 'Trong tuần qua, bạn có thường xuyên cãi vã với các thành viên trong gia đình không?',
      options: [
        {id: 1, text: 'Không bao giờ', selected: false, value: 0},
        {id: 2, text: 'Hiếm khi', selected: false, value: 1},
        {id: 3, text: 'Thỉnh thoảng', selected: false, value: 2},
        {id: 4, text: 'Thường xuyên', selected: true, value: 3},
        {id: 5, text: 'Rất thường xuyên', selected: false, value: 4}
      ]
    },
    {
      id: 2,
      text: 'Bạn có cảm thấy gia đình hiểu và tôn trọng ý kiến của bạn không?',
      options: [
        {id: 6, text: 'Không bao giờ', selected: false, value: 4},
        {id: 7, text: 'Hiếm khi', selected: false, value: 3},
        {id: 8, text: 'Thỉnh thoảng', selected: true, value: 2},
        {id: 9, text: 'Thường xuyên', selected: false, value: 1},
        {id: 10, text: 'Luôn luôn', selected: false, value: 0}
      ]
    },
    {
      id: 3,
      text: 'Khi có mâu thuẫn, gia đình bạn có giải quyết một cách bình tĩnh và hiệu quả không?',
      options: [
        {id: 11, text: 'Không bao giờ', selected: false, value: 4},
        {id: 12, text: 'Hiếm khi', selected: true, value: 3},
        {id: 13, text: 'Thỉnh thoảng', selected: false, value: 2},
        {id: 14, text: 'Thường xuyên', selected: false, value: 1},
        {id: 15, text: 'Luôn luôn', selected: false, value: 0}
      ]
    },
    {
      id: 4,
      text: 'Bạn có cảm thấy căng thẳng khi ở nhà với gia đình không?',
      options: [
        {id: 16, text: 'Không bao giờ', selected: false, value: 0},
        {id: 17, text: 'Hiếm khi', selected: false, value: 1},
        {id: 18, text: 'Thỉnh thoảng', selected: false, value: 2},
        {id: 19, text: 'Thường xuyên', selected: true, value: 3},
        {id: 20, text: 'Luôn luôn', selected: false, value: 4}
      ]
    },
    {
      id: 5,
      text: 'Các thành viên trong gia đình có thường xuyên nói to, quát tháo hoặc la hét với nhau không?',
      options: [
        {id: 21, text: 'Không bao giờ', selected: false, value: 0},
        {id: 22, text: 'Hiếm khi', selected: false, value: 1},
        {id: 23, text: 'Thỉnh thoảng', selected: false, value: 2},
        {id: 24, text: 'Thường xuyên', selected: false, value: 3},
        {id: 25, text: 'Luôn luôn', selected: true, value: 4}
      ]
    }
  ];

  /**
   * Get feedback based on conflict score
   * @param score Conflict score
   * @returns Feedback text
   */
  static getFeedbackForConflictScore(score: number): string {
    if (score <= 20) {
      return 'Mức độ xung đột trong gia đình bạn rất thấp. Đây là một môi trường gia đình lành mạnh và hỗ trợ. Hãy tiếp tục duy trì mối quan hệ tốt đẹp này.';
    } else if (score <= 40) {
      return 'Mức độ xung đột trong gia đình bạn ở mức thấp. Gia đình bạn có nền tảng giao tiếp tốt, nhưng vẫn có thể cải thiện thêm để giải quyết các mâu thuẫn hiệu quả hơn.';
    } else if (score <= 60) {
      return 'Mức độ xung đột trong gia đình bạn ở mức trung bình. Có một số vấn đề cần được giải quyết. Hãy thử cải thiện kỹ năng giao tiếp và lắng nghe trong gia đình.';
    } else if (score <= 80) {
      return 'Mức độ xung đột trong gia đình bạn ở mức cao. Có nhiều vấn đề cần được giải quyết. Hãy cân nhắc tìm kiếm sự hỗ trợ từ người thân hoặc chuyên gia tư vấn gia đình.';
    } else {
      return 'Mức độ xung đột trong gia đình bạn ở mức nghiêm trọng. Đây là tình trạng đáng lo ngại. Hãy tìm kiếm sự hỗ trợ từ chuyên gia tư vấn gia đình hoặc nhà tâm lý học càng sớm càng tốt.';
    }
  }

  /**
   * Get conflict level based on score
   * @param score Conflict score
   * @returns Conflict level
   */
  static getConflictLevelFromScore(score: number): string {
    if (score <= 20) {
      return ForceTestData.ConflictLevels.LOW;
    } else if (score <= 50) {
      return ForceTestData.ConflictLevels.MEDIUM;
    } else if (score <= 80) {
      return ForceTestData.ConflictLevels.HIGH;
    } else {
      return ForceTestData.ConflictLevels.SEVERE;
    }
  }

  /**
   * Get result text based on conflict level
   * @param conflictLevel Conflict level
   * @returns Result text
   */
  static getResultTextFromConflictLevel(conflictLevel: string): string {
    switch (conflictLevel) {
      case ForceTestData.ConflictLevels.LOW:
        return 'Mức độ xung đột thấp';
      case ForceTestData.ConflictLevels.MEDIUM:
        return 'Mức độ xung đột trung bình';
      case ForceTestData.ConflictLevels.HIGH:
        return 'Mức độ xung đột cao';
      case ForceTestData.ConflictLevels.SEVERE:
        return 'Mức độ xung đột nghiêm trọng';
      default:
        return 'Mức độ xung đột không xác định';
    }
  }

  // Original ForceTestData content starts here

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
    {
      id: 2,
      resource_url: '/assets/sounds/reload-124467.mp3',
      name: 'reload-124467',
      category: AssetResourceCategory.EFFECT
    },
    {
      id: 3,
      resource_url: '/assets/sounds/alert-234711.mp3',
      name: 'alert-234711',
      category: AssetResourceCategory.EFFECT
    },
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
   * Mock emotion icons for daily emotion journal
   */
  static emotionIcons: IEmotionIcon[] = [
  {
    id: 1,
    name: 'Vui vẻ',
    emoji: '😊',
  },
  {
    id: 2,
    name: 'Buồn',
    emoji: '😢',
  },
  {
    id: 3,
    name: 'Tức giận',
    emoji: '😡',
  },
  {
    id: 4,
    name: 'Lo lắng',
    emoji: '😰',
  },
  {
    id: 5,
    name: 'Hào hứng',
    emoji: '🤩',
  },
  {
    id: 6,
    name: 'Mệt mỏi',
    emoji: '😴',
  },
  {
    id: 7,
    name: 'Bình tĩnh',
    emoji: '😌',
  },
  {
    id: 8,
    name: 'Bối rối',
    emoji: '🤔',
  },
  {
    id: 9,
    name: 'Tự hào',
    emoji: '🥳',
  },
  {
    id: 10,
    name: 'Biết ơn',
    emoji: '🙏',
  }
];

  /**
   * Mock emotion streak status for daily emotion journal
   */
  static emotionStreakStatus: IEmotionStreakStatus = {
    currentStreak: 4,
    longestStreak: 7,
    streakMilestones: {
      days3: true,
      days5: false,
      days7: true,
      days15: false,
      days28: false
    }
  };

  /**
   * Mock daily emotion journal entries
   */
  static dailyEmotionJournalEntries: IDailyEmotionJournal[] = [
    {
      id: 1,
      date: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
      emotionIcon: this.emotionIcons[0], // Happy
      caption: 'Nay là 1 ngày tuyệt vời!',
      userId: 1
    },
    {
      id: 2,
      date: new Date(new Date().setDate(new Date().getDate() - 2)), // 2 days ago
      emotionIcon: this.emotionIcons[4], // Excited
      caption: 'Mong chờ đến cuối tuần!',
      userId: 1,
      sharedWith: [
        { id: 1, type: EmotionShareTargetType.CLASS_GROUP, name: 'Lớp 6A' },
        { id: 2, type: EmotionShareTargetType.FRIEND, name: 'Bạn thân' }
      ]
    },
    {
      id: 3,
      date: new Date(new Date().setDate(new Date().getDate() - 3)), // 3 days ago
      emotionIcon: this.emotionIcons[6], // Calm
      caption: 'Tận hưởng cuốn sách yêu thích',
      userId: 1
    },
    {
      id: 4,
      date: new Date(new Date().setDate(new Date().getDate() - 4)), // 4 days ago
      emotionIcon: this.emotionIcons[1], // Sad
      caption: 'Nhớ người bạn đã chuyển đi',
      userId: 1,
      sharedWith: [
        { id: 3, type: EmotionShareTargetType.FAMILY, name: 'Mẹ' }
      ]
    },
    {
      id: 5,
      date: new Date(new Date().setDate(new Date().getDate() - 7)), // 7 days ago
      emotionIcon: this.emotionIcons[8], // Proud
      caption: 'Nay được điểm cao trong bài kiểm tra!',
      userId: 1,
      sharedWith: [
        { id: 1, type: EmotionShareTargetType.CLASS_GROUP, name: 'Lớp 6A' },
        { id: 4, type: EmotionShareTargetType.TEACHER, name: 'Giáo viên' },
        { id: 3, type: EmotionShareTargetType.FAMILY, name: 'Mẹ' }
      ]
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

  /*
   * Family Communication Quality Survey Data
   */

  // Communication level constants
  static CommunicationLevels = {
    EXCELLENT: 'excellent',
    GOOD: 'good',
    AVERAGE: 'average',
    POOR: 'poor'
  };

  // Communication level emojis
  static CommunicationLevelEmojis: Record<string, string> = {
    [ForceTestData.CommunicationLevels.EXCELLENT]: '🟢',
    [ForceTestData.CommunicationLevels.GOOD]: '🟡',
    [ForceTestData.CommunicationLevels.AVERAGE]: '🟠',
    [ForceTestData.CommunicationLevels.POOR]: '🔴'
  };

  // Mock data for family communication quality survey history
  static familyCommunicationQualitySurveyHistory: IFamilyCommunicationQualitySurveyHistory[] = [
    {
      id: 1,
      date: new Date(2024, 10, 29),
      result: 'Chất lượng giao tiếp tốt',
      communicationLevel: ForceTestData.CommunicationLevels.GOOD,
      score: 75
    },
    {
      id: 2,
      date: new Date(2024, 10, 22),
      result: 'Chất lượng giao tiếp trung bình',
      communicationLevel: ForceTestData.CommunicationLevels.AVERAGE,
      score: 55
    },
    {
      id: 3,
      date: new Date(2024, 10, 15),
      result: 'Chất lượng giao tiếp kém',
      communicationLevel: ForceTestData.CommunicationLevels.POOR,
      score: 35
    },
    {
      id: 4,
      date: new Date(2024, 10, 8),
      result: 'Chất lượng giao tiếp xuất sắc',
      communicationLevel: ForceTestData.CommunicationLevels.EXCELLENT,
      score: 90
    },
    {
      id: 5,
      date: new Date(2024, 10, 1),
      result: 'Chất lượng giao tiếp tốt',
      communicationLevel: ForceTestData.CommunicationLevels.GOOD,
      score: 70
    },
    {
      id: 6,
      date: new Date(2024, 9, 24),
      result: 'Chất lượng giao tiếp kém',
      communicationLevel: ForceTestData.CommunicationLevels.POOR,
      score: 30
    },
    {
      id: 7,
      date: new Date(2024, 9, 17),
      result: 'Chất lượng giao tiếp trung bình',
      communicationLevel: ForceTestData.CommunicationLevels.AVERAGE,
      score: 50
    },
    {
      id: 8,
      date: new Date(2024, 9, 10),
      result: 'Chất lượng giao tiếp xuất sắc',
      communicationLevel: ForceTestData.CommunicationLevels.EXCELLENT,
      score: 85
    },
    {
      id: 9,
      date: new Date(2024, 9, 3),
      result: 'Chất lượng giao tiếp tốt',
      communicationLevel: ForceTestData.CommunicationLevels.GOOD,
      score: 65
    },
    {
      id: 10,
      date: new Date(2024, 8, 26),
      result: 'Chất lượng giao tiếp trung bình',
      communicationLevel: ForceTestData.CommunicationLevels.AVERAGE,
      score: 45
    },
    {
      id: 11,
      date: new Date(2024, 8, 19),
      result: 'Chất lượng giao tiếp kém',
      communicationLevel: ForceTestData.CommunicationLevels.POOR,
      score: 25
    },
    {
      id: 12,
      date: new Date(2024, 8, 12),
      result: 'Chất lượng giao tiếp xuất sắc',
      communicationLevel: ForceTestData.CommunicationLevels.EXCELLENT,
      score: 95
    }
  ];

  // Helper functions for family communication quality survey
  static getCommunicationLevelEmoji(communicationLevel: string): string {
    return ForceTestData.CommunicationLevelEmojis[communicationLevel] || '🟢';
  }

  static getFeedbackForCommunicationScore(score: number): string {
    if (score >= 80) {
      return 'Chất lượng giao tiếp trong gia đình bạn rất tốt. Các thành viên trong gia đình biết cách lắng nghe, chia sẻ và tôn trọng ý kiến của nhau. Hãy tiếp tục duy trì mối quan hệ tốt đẹp này.';
    } else if (score >= 60) {
      return 'Chất lượng giao tiếp trong gia đình bạn khá tốt. Các thành viên trong gia đình thường xuyên chia sẻ và lắng nghe nhau, nhưng vẫn có thể cải thiện thêm để giao tiếp hiệu quả hơn.';
    } else if (score >= 40) {
      return 'Chất lượng giao tiếp trong gia đình bạn ở mức trung bình. Có một số vấn đề cần được cải thiện. Hãy thử dành nhiều thời gian hơn để trò chuyện và lắng nghe các thành viên trong gia đình.';
    } else {
      return 'Chất lượng giao tiếp trong gia đình bạn còn hạn chế. Các thành viên trong gia đình cần dành nhiều thời gian hơn để trò chuyện, lắng nghe và chia sẻ với nhau. Hãy thử đề xuất các hoạt động gia đình để tăng cường giao tiếp.';
    }
  }

  static getCommunicationLevelFromScore(score: number): string {
    if (score >= 80) {
      return ForceTestData.CommunicationLevels.EXCELLENT;
    } else if (score >= 60) {
      return ForceTestData.CommunicationLevels.GOOD;
    } else if (score >= 40) {
      return ForceTestData.CommunicationLevels.AVERAGE;
    } else {
      return ForceTestData.CommunicationLevels.POOR;
    }
  }

  static getResultTextFromCommunicationLevel(communicationLevel: string): string {
    switch (communicationLevel) {
      case ForceTestData.CommunicationLevels.EXCELLENT:
        return 'Chất lượng giao tiếp xuất sắc';
      case ForceTestData.CommunicationLevels.GOOD:
        return 'Chất lượng giao tiếp tốt';
      case ForceTestData.CommunicationLevels.AVERAGE:
        return 'Chất lượng giao tiếp trung bình';
      case ForceTestData.CommunicationLevels.POOR:
        return 'Chất lượng giao tiếp kém';
      default:
        return 'Chất lượng giao tiếp không xác định';
    }
  }

  // Mock data for family communication quality survey questions
  static familyCommunicationQualitySurveyQuestions: IFamilyCommunicationQualitySurveyQuestion[] = [
    {
      id: 1,
      text: 'Các thành viên trong gia đình có thường xuyên chia sẻ cảm xúc và suy nghĩ với nhau không?',
      options: [
        { id: 1, text: 'Không bao giờ', selected: false, value: 0 },
        { id: 2, text: 'Hiếm khi', selected: false, value: 1 },
        { id: 3, text: 'Thỉnh thoảng', selected: false, value: 2 },
        { id: 4, text: 'Thường xuyên', selected: true, value: 3 },
        { id: 5, text: 'Rất thường xuyên', selected: false, value: 4 }
      ]
    },
    {
      id: 2,
      text: 'Khi có vấn đề, các thành viên trong gia đình có cùng nhau thảo luận để tìm giải pháp không?',
      options: [
        { id: 6, text: 'Không bao giờ', selected: false, value: 0 },
        { id: 7, text: 'Hiếm khi', selected: false, value: 1 },
        { id: 8, text: 'Thỉnh thoảng', selected: true, value: 2 },
        { id: 9, text: 'Thường xuyên', selected: false, value: 3 },
        { id: 10, text: 'Rất thường xuyên', selected: false, value: 4 }
      ]
    },
    {
      id: 3,
      text: 'Bạn có cảm thấy được lắng nghe khi nói chuyện với các thành viên trong gia đình không?',
      options: [
        { id: 11, text: 'Không bao giờ', selected: false, value: 0 },
        { id: 12, text: 'Hiếm khi', selected: false, value: 1 },
        { id: 13, text: 'Thỉnh thoảng', selected: false, value: 2 },
        { id: 14, text: 'Thường xuyên', selected: true, value: 3 },
        { id: 15, text: 'Rất thường xuyên', selected: false, value: 4 }
      ]
    },
    {
      id: 4,
      text: 'Các thành viên trong gia đình có tôn trọng ý kiến của nhau không?',
      options: [
        { id: 16, text: 'Không bao giờ', selected: false, value: 0 },
        { id: 17, text: 'Hiếm khi', selected: false, value: 1 },
        { id: 18, text: 'Thỉnh thoảng', selected: true, value: 2 },
        { id: 19, text: 'Thường xuyên', selected: false, value: 3 },
        { id: 20, text: 'Rất thường xuyên', selected: false, value: 4 }
      ]
    },
    {
      id: 5,
      text: 'Gia đình bạn có dành thời gian để trò chuyện cùng nhau không?',
      options: [
        { id: 21, text: 'Không bao giờ', selected: false, value: 0 },
        { id: 22, text: 'Hiếm khi', selected: false, value: 1 },
        { id: 23, text: 'Thỉnh thoảng', selected: false, value: 2 },
        { id: 24, text: 'Thường xuyên', selected: false, value: 3 },
        { id: 25, text: 'Rất thường xuyên', selected: true, value: 4 }
      ]
    }
  ];

  /**
   * Self Discovery Survey Data
   */

  // Discovery level constants
  static DiscoveryLevels = {
    EXCELLENT: 'excellent',
    GOOD: 'good',
    AVERAGE: 'average',
    POOR: 'poor'
  };

  // Discovery level emojis
  static DiscoveryLevelEmojis: Record<string, string> = {
    [ForceTestData.DiscoveryLevels.EXCELLENT]: '🌟',
    [ForceTestData.DiscoveryLevels.GOOD]: '✨',
    [ForceTestData.DiscoveryLevels.AVERAGE]: '⭐',
    [ForceTestData.DiscoveryLevels.POOR]: '💫'
  };

  // Mock data for self discovery survey history
  static selfDiscoverySurveyHistory: ISelfDiscoverySurveyHistory[] = [
    {
      id: 1,
      date: new Date(2024, 10, 29),
      result: 'Khám phá bản thân tốt',
      discoveryLevel: ForceTestData.DiscoveryLevels.GOOD,
      score: 75
    },
    {
      id: 2,
      date: new Date(2024, 10, 22),
      result: 'Khám phá bản thân trung bình',
      discoveryLevel: ForceTestData.DiscoveryLevels.AVERAGE,
      score: 55
    },
    {
      id: 3,
      date: new Date(2024, 10, 15),
      result: 'Khám phá bản thân kém',
      discoveryLevel: ForceTestData.DiscoveryLevels.POOR,
      score: 35
    },
    {
      id: 4,
      date: new Date(2024, 10, 8),
      result: 'Khám phá bản thân xuất sắc',
      discoveryLevel: ForceTestData.DiscoveryLevels.EXCELLENT,
      score: 90
    },
    {
      id: 5,
      date: new Date(2024, 10, 1),
      result: 'Khám phá bản thân tốt',
      discoveryLevel: ForceTestData.DiscoveryLevels.GOOD,
      score: 70
    },
    {
      id: 6,
      date: new Date(2024, 9, 24),
      result: 'Khám phá bản thân kém',
      discoveryLevel: ForceTestData.DiscoveryLevels.POOR,
      score: 30
    },
    {
      id: 7,
      date: new Date(2024, 9, 17),
      result: 'Khám phá bản thân trung bình',
      discoveryLevel: ForceTestData.DiscoveryLevels.AVERAGE,
      score: 50
    },
    {
      id: 8,
      date: new Date(2024, 9, 10),
      result: 'Khám phá bản thân xuất sắc',
      discoveryLevel: ForceTestData.DiscoveryLevels.EXCELLENT,
      score: 85
    },
    {
      id: 9,
      date: new Date(2024, 9, 3),
      result: 'Khám phá bản thân tốt',
      discoveryLevel: ForceTestData.DiscoveryLevels.GOOD,
      score: 65
    },
    {
      id: 10,
      date: new Date(2024, 8, 26),
      result: 'Khám phá bản thân trung bình',
      discoveryLevel: ForceTestData.DiscoveryLevels.AVERAGE,
      score: 45
    },
    {
      id: 11,
      date: new Date(2024, 8, 19),
      result: 'Khám phá bản thân kém',
      discoveryLevel: ForceTestData.DiscoveryLevels.POOR,
      score: 25
    },
    {
      id: 12,
      date: new Date(2024, 8, 12),
      result: 'Khám phá bản thân xuất sắc',
      discoveryLevel: ForceTestData.DiscoveryLevels.EXCELLENT,
      score: 95
    }
  ];

  // Helper functions for self discovery survey
  static getDiscoveryLevelEmoji(discoveryLevel: string): string {
    return ForceTestData.DiscoveryLevelEmojis[discoveryLevel] || '🌟';
  }

  static getFeedbackForDiscoveryScore(score: number): string {
    if (score >= 80) {
      return 'Bạn có khả năng tự nhận thức và hiểu bản thân rất tốt. Bạn biết rõ điểm mạnh, điểm yếu và giá trị cốt lõi của mình. Hãy tiếp tục phát triển và khám phá những khía cạnh mới của bản thân.';
    } else if (score >= 60) {
      return 'Bạn có khả năng tự nhận thức khá tốt. Bạn hiểu được nhiều điểm mạnh và điểm yếu của mình, nhưng vẫn có thể khám phá thêm về bản thân để hiểu rõ hơn về các giá trị và mục tiêu của mình.';
    } else if (score >= 40) {
      return 'Bạn có khả năng tự nhận thức ở mức trung bình. Bạn hiểu được một số điểm mạnh và điểm yếu của mình, nhưng còn nhiều khía cạnh cần khám phá thêm. Hãy dành thời gian để suy ngẫm và tìm hiểu bản thân nhiều hơn.';
    } else {
      return 'Bạn cần phát triển khả năng tự nhận thức nhiều hơn. Việc hiểu rõ bản thân là nền tảng quan trọng để phát triển và thành công. Hãy thử dành thời gian mỗi ngày để suy ngẫm về các giá trị, mục tiêu và cảm xúc của bản thân.';
    }
  }

  static getDiscoveryLevelFromScore(score: number): string {
    if (score >= 80) {
      return ForceTestData.DiscoveryLevels.EXCELLENT;
    } else if (score >= 60) {
      return ForceTestData.DiscoveryLevels.GOOD;
    } else if (score >= 40) {
      return ForceTestData.DiscoveryLevels.AVERAGE;
    } else {
      return ForceTestData.DiscoveryLevels.POOR;
    }
  }

  static getResultTextFromDiscoveryLevel(discoveryLevel: string): string {
    switch (discoveryLevel) {
      case ForceTestData.DiscoveryLevels.EXCELLENT:
        return 'Khám phá bản thân xuất sắc';
      case ForceTestData.DiscoveryLevels.GOOD:
        return 'Khám phá bản thân tốt';
      case ForceTestData.DiscoveryLevels.AVERAGE:
        return 'Khám phá bản thân trung bình';
      case ForceTestData.DiscoveryLevels.POOR:
        return 'Khám phá bản thân kém';
      default:
        return 'Khám phá bản thân không xác định';
    }
  }

  // Mock data for self discovery survey questions
  static selfDiscoverySurveyQuestions: ISelfDiscoverySurveyQuestion[] = [
    {
      id: 1,
      text: 'Bạn có thường xuyên suy ngẫm về các giá trị và niềm tin cốt lõi của bản thân không?',
      options: [
        { id: 1, text: 'Không bao giờ', selected: false, value: 0 },
        { id: 2, text: 'Hiếm khi', selected: false, value: 1 },
        { id: 3, text: 'Thỉnh thoảng', selected: false, value: 2 },
        { id: 4, text: 'Thường xuyên', selected: true, value: 3 },
        { id: 5, text: 'Rất thường xuyên', selected: false, value: 4 }
      ]
    },
    {
      id: 2,
      text: 'Bạn có hiểu rõ về điểm mạnh và điểm yếu của bản thân không?',
      options: [
        { id: 6, text: 'Không hiểu gì cả', selected: false, value: 0 },
        { id: 7, text: 'Hiểu rất ít', selected: false, value: 1 },
        { id: 8, text: 'Hiểu một phần', selected: true, value: 2 },
        { id: 9, text: 'Hiểu khá rõ', selected: false, value: 3 },
        { id: 10, text: 'Hiểu rất rõ', selected: false, value: 4 }
      ]
    },
    {
      id: 3,
      text: 'Bạn có thể nhận biết và kiểm soát cảm xúc của mình tốt đến mức nào?',
      options: [
        { id: 11, text: 'Rất kém', selected: false, value: 0 },
        { id: 12, text: 'Kém', selected: false, value: 1 },
        { id: 13, text: 'Trung bình', selected: false, value: 2 },
        { id: 14, text: 'Tốt', selected: true, value: 3 },
        { id: 15, text: 'Rất tốt', selected: false, value: 4 }
      ]
    },
    {
      id: 4,
      text: 'Bạn có mục tiêu rõ ràng cho tương lai của mình không?',
      options: [
        { id: 16, text: 'Không có mục tiêu nào', selected: false, value: 0 },
        { id: 17, text: 'Có vài ý tưởng mơ hồ', selected: false, value: 1 },
        { id: 18, text: 'Có một số mục tiêu cơ bản', selected: true, value: 2 },
        { id: 19, text: 'Có mục tiêu khá rõ ràng', selected: false, value: 3 },
        { id: 20, text: 'Có mục tiêu rất rõ ràng và chi tiết', selected: false, value: 4 }
      ]
    },
    {
      id: 5,
      text: 'Bạn có thường xuyên tìm hiểu về những sở thích và đam mê mới không?',
      options: [
        { id: 21, text: 'Không bao giờ', selected: false, value: 0 },
        { id: 22, text: 'Hiếm khi', selected: false, value: 1 },
        { id: 23, text: 'Thỉnh thoảng', selected: false, value: 2 },
        { id: 24, text: 'Thường xuyên', selected: false, value: 3 },
        { id: 25, text: 'Rất thường xuyên', selected: true, value: 4 }
      ]
    }
  ];
}
