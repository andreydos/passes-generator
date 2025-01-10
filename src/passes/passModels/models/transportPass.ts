import {format} from "date-fns/format";
import {PassQueryParams, PassTypeEnum} from "../../passes.types";

export const getTransportPass = (data: PassQueryParams) => {
  const startDate = data.type === PassTypeEnum.TRANSPORT_SUBSCRIPTION
    ? format(data.startDate, 'dd-M-y')
    : format(data.startDate, 'dd-M-y HH:mm');

  const endDate = data.type === PassTypeEnum.TRANSPORT_SUBSCRIPTION
    ? format(data.endDate, 'dd-M-y')
    : format(data.endDate, 'dd-M-y HH:mm');

  return {
    logoText: data.typeName.toUpperCase(),
      expirationDate: new Date(data.endDate).toISOString(),
    generic: {
    headerFields: [{
      "key": "subscriptionType",
      "label": "Тип",
      "value": `${data.typePeriod}`,
    }],
    barcodes: [{
      message: data.id,
      format: 'PKBarcodeFormatQR',
      messageEncoding: 'iso-8859-1',
    }],
    primaryFields: [
      {
        "key": "endDate",
        "label": "Дійсний до",
        "value": endDate,
      }
    ],
      "secondaryFields": [
      {
        "key": "number",
        "label": "Номер",
        "value": data.number,
      },
      {
        "key": "startDate",
        "label": "Дата придбання",
        "value": startDate,
        "textAlignment": "PKTextAlignmentRight"
      }
    ],
      "auxiliaryFields": [
      {
        "key": "price",
        "label": "Вартість",
        "value": `${data.price} UAH`
      },
      {
        "key": "organization",
        "label": "Організація",
        "value": "КП Дніпровський ЕДМР",
        "textAlignment": "PKTextAlignmentRight"
      }
    ]
  }
  }
};
