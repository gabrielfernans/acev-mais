import {
  AgrupeCategoryEnum,
  AgrupeCategoryLabelEnum,
  GenderEnum,
  GenderLabelEnum,
  MaritalStatusEnum,
  MaritalStatusLabelEnum,
  MemberEntryCategoryEnum,
  MemberEntryCategoryLabelEnum,
  StateEnum,
  StateLabelEnum,
  WeekdayEnum,
  WeekdayLabelEnum,
} from '../enums';

export const TODAY = new Date();

export const SERVER_ERROR_FEEDBACK_DESCRIPTION =
  'Não foi possível recuperar informações, tente novamente. Se o erro persistir, comunique a equipe de tecnologia.';

export const EMPTY_FEEDBACK_DESCRIPTION = 'Não encontramos resultados para esta busca.';

export const AGRUPE_CATEGORIES: { title: AgrupeCategoryLabelEnum; category: AgrupeCategoryEnum }[] =
  Object.keys(AgrupeCategoryEnum).map((label) => ({
    title: AgrupeCategoryLabelEnum[label as keyof typeof AgrupeCategoryLabelEnum],
    category: AgrupeCategoryEnum[label as keyof typeof AgrupeCategoryEnum],
  }));

export const WEEKDAYS: { title: WeekdayLabelEnum; day: WeekdayEnum }[] = Object.keys(
  WeekdayEnum,
).map((sigla) => ({
  title: WeekdayLabelEnum[sigla as keyof typeof WeekdayLabelEnum],
  day: WeekdayEnum[sigla as keyof typeof WeekdayEnum],
}));

export const STATES: { title: StateLabelEnum; value: StateEnum }[] = Object.keys(StateEnum).map(
  (label) => ({
    title: StateLabelEnum[label as keyof typeof StateEnum],
    value: StateEnum[label as keyof typeof StateLabelEnum],
  }),
);

export const GENDERS: { title: GenderLabelEnum; value: GenderEnum }[] = Object.keys(GenderEnum).map(
  (label) => ({
    title: GenderLabelEnum[label as keyof typeof GenderEnum],
    value: GenderEnum[label as keyof typeof GenderLabelEnum],
  }),
);

export const ENTRY_CATEGORIES: {
  title: MemberEntryCategoryLabelEnum;
  value: MemberEntryCategoryEnum;
}[] = Object.keys(MemberEntryCategoryEnum).map((label) => ({
  title: MemberEntryCategoryLabelEnum[label as keyof typeof MemberEntryCategoryEnum],
  value: MemberEntryCategoryEnum[label as keyof typeof MemberEntryCategoryLabelEnum],
}));

export const MARITAL_STATUSES: { title: MaritalStatusLabelEnum; value: MaritalStatusEnum }[] =
  Object.keys(MaritalStatusEnum).map((label) => ({
    title: MaritalStatusLabelEnum[label as keyof typeof MaritalStatusEnum],
    value: MaritalStatusEnum[label as keyof typeof MaritalStatusLabelEnum],
  }));
