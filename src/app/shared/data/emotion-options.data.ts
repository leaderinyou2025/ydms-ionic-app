import { EmotionType } from '../enums/personal-diary/personal-diary.enum';
import { EmotionOption } from '../interfaces/personal-diary/personal-diary.interfaces';
import { TranslateKeys } from '../enums/translate-keys';

/**
 * Shared emotion options data
 */
export const EMOTION_OPTIONS: EmotionOption[] = [
  {
    value: EmotionType.HAPPY,
    emoji: '😊',
    label: TranslateKeys.EMOTION_HAPPY,
    bgClass: 'bg-green-100 dark:bg-green-900'
  },
  {
    value: EmotionType.SAD,
    emoji: '😢',
    label: TranslateKeys.EMOTION_SAD,
    bgClass: 'bg-blue-100 dark:bg-blue-900'
  },
  {
    value: EmotionType.ANGRY,
    emoji: '😡',
    label: TranslateKeys.EMOTION_ANGRY,
    bgClass: 'bg-red-100 dark:bg-red-900'
  },
  {
    value: EmotionType.ANXIOUS,
    emoji: '😰',
    label: TranslateKeys.EMOTION_ANXIOUS,
    bgClass: 'bg-yellow-100 dark:bg-yellow-900'
  },
  {
    value: EmotionType.EXCITED,
    emoji: '🤩',
    label: TranslateKeys.EMOTION_EXCITED,
    bgClass: 'bg-purple-100 dark:bg-purple-900'
  },
  {
    value: EmotionType.TIRED,
    emoji: '😴',
    label: TranslateKeys.EMOTION_TIRED,
    bgClass: 'bg-gray-100 dark:bg-gray-900'
  },
  {
    value: EmotionType.CALM,
    emoji: '😌',
    label: TranslateKeys.EMOTION_CALM,
    bgClass: 'bg-teal-100 dark:bg-teal-900'
  },
  {
    value: EmotionType.CONFUSED,
    emoji: '🤔',
    label: TranslateKeys.EMOTION_CONFUSED,
    bgClass: 'bg-orange-100 dark:bg-orange-900'
  }
];

/**
 * Get emotion emoji based on emotion type
 * @param emotionType Emotion type
 * @returns Emotion emoji
 */
export function getEmotionEmoji(emotionType: EmotionType): string {
  const emotion = EMOTION_OPTIONS.find(e => e.value === emotionType);
  return emotion ? emotion.emoji : '😊';
}
