export type PassQueryParams = {
  type: PassTypeEnum;
} & TransportPassData;

export enum PassTypeEnum {
  TRANSPORT_SUBSCRIPTION = 'TRANSPORT_SUBSCRIPTION',
  TRANSPORT_TICKET = 'TRANSPORT_TICKET',
}

export type TransportPassData = {
  id: string;
  startDate: string;
  endDate: string;
  number: string;
  price: string;
  typePeriod: string;
  typeName: string;
}
