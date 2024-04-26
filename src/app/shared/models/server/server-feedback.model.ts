import { FeedbackEnum, FeedbackStatusEnum } from '@app/shared';

export interface IServerFeedback {
  status: FeedbackStatusEnum;
  title: FeedbackEnum;
  subtitle?: string;
}
