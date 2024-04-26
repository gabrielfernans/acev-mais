import { FeedbackEnum, FeedbackStatusEnum } from '../enums';
import { IServerFeedback } from '../models';
import { EMPTY_FEEDBACK_DESCRIPTION, SERVER_ERROR_FEEDBACK_DESCRIPTION } from './constants.util';

export const getServerFeedback = (serverError?: boolean): IServerFeedback => {
  return {
    status: serverError ? FeedbackStatusEnum.ERROR : FeedbackStatusEnum.NOT_FOUND,
    title: serverError ? FeedbackEnum.ERROR : FeedbackEnum.EMPTY,
    subtitle: serverError ? SERVER_ERROR_FEEDBACK_DESCRIPTION : EMPTY_FEEDBACK_DESCRIPTION,
  };
};

export const getFormattedPageTitle = (title: string) => {
  return `${title} | acev+`;
};

export const getGreeting = (): string => {
  const currentHour = new Date().getHours();
  return currentHour < 12 ? 'Bom dia' : currentHour < 18 ? 'Boa tarde' : 'Boa noite';
};

export const getInitials = (name: string): string => {
  const words: string[] = name.split(' ');
  return words[0][0] + (words.length > 1 ? words[1][0] : '') || '';
};

export const applyPhoneMask = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, ''); // Remove todos os caracteres que não são dígitos

  if (cleaned.length === 11) {
    // Se possuir 11 dígitos (com DDD e 9 dígitos)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  } else if (cleaned.length === 10) {
    // Se possuir 10 dígitos (com DDD e 8 dígitos)
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
  } else {
    return cleaned; // Retorna o número original se não corresponder a nenhum dos formatos
  }
};

export const getConvertedDate = (dateString: string): string => {
  const day = parseInt(dateString.slice(0, 2), 10);
  const month = parseInt(dateString.slice(2, 4), 10) - 1;
  const year = parseInt(dateString.slice(4), 10);

  const isoDate = new Date(year, month, day);

  return isoDate.toISOString();
};

export const formatDateToForm = (inputDate: string): string => {
  const dateObject = new Date(inputDate);
  if (isNaN(dateObject.getTime())) {
    throw new Error('Data inválida.');
  }

  const day = String(dateObject.getDate()).padStart(2, '0');
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const year = String(dateObject.getFullYear());

  return day + month + year;
};
