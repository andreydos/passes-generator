export type CreatePassBody = {
  type: 'SUBSCRIPTION',
  data: SubscriptionPassCreateData;
}

export type SubscriptionPassCreateData = {
  id: string,
  type: string;
  startDate: string;
  endDate: string;
  number: string;
  price: string;
  typePeriod: string;
  typeName: string;
}
