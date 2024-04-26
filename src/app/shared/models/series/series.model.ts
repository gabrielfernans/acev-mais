import { ILesson } from '../lesson';

export interface ISeries {
  id: string;
  title: string;
  period: string;
  author: string;
  photoUrl?: string;
  lessons: ILesson[];
  createdAt?: string;
  updatedAt?: string;
}
