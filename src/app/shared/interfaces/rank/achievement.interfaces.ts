export interface IBadge {
  id?: number;
  name: string;
  desc: string;
  unlocked: boolean;
  isNew: boolean;
  image: string;
}

export interface IAchievementCategory {
  id?: number;
  title: string;
  badges: IBadge[];
}