/**
 * Interface for rank item
 */
export interface IRankItem {
  userId: number;
  avatar?: string | null
  position: number;
  nickname: string;
  points: number;
  isCurrentUser?: boolean;
}
