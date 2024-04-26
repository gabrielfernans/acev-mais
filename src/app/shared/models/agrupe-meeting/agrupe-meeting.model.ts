import { IAgrupe } from '../agrupe';
import { ILesson } from '../lesson';
import { IMemberMinimal } from '../member';

export interface IAgrupeMeeting {
  id: string;
  agrupe: IAgrupe;
  date: string;
  lesson?: ILesson;
  customLesson: boolean;
  customLessonTitle?: string;
  participants: IMemberMinimal[];
  guests: string[];
  photoUrl: string;
  createdAt: string;
  updatedAt: string;
}
