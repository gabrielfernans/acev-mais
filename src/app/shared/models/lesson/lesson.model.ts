export interface ILesson {
  id: string;
  idSeries: string;
  seriesName?: string;
  title: string;
  origin?: string;
  adaptation?: string;
  revision?: string;
  greeting?: string;
  musicSuggestions?: string[];
  pdfUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
