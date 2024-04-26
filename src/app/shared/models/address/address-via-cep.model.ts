import { StateEnum } from '@app/shared/enums';

export interface IAddressViaCep {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: StateEnum;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}
