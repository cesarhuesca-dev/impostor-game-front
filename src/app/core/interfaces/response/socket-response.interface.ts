import { GameSocketTopic } from '@/enums/game-topics.enum';

export interface SocketResponse<T> {
  topic: GameSocketTopic;
  data: T[];
  success: boolean;
  error?: unknown;
}
