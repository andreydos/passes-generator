import {fromZonedTime} from 'date-fns-tz';
import {format} from "date-fns/format";
import {PassQueryParams, PassTypeEnum} from "../../passes.types";
import {dateFormat, dateTimeFormat} from "../../android/generic/class/config";

export const getTransportPass = (data: PassQueryParams) => {
  const startDateTz = fromZonedTime(data.startDate, 'Europe/Kiev')
  const startDate = data.type === PassTypeEnum.TRANSPORT_SUBSCRIPTION
    ? format(startDateTz, dateFormat)
    : format(startDateTz, dateTimeFormat);

  const endDateTz = fromZonedTime(data.endDate, 'Europe/Kiev')
  const endDate = data.type === PassTypeEnum.TRANSPORT_SUBSCRIPTION
    ? format(endDateTz, dateFormat)
    : format(endDateTz, dateTimeFormat);

  return {
    logoText: data.typeName.toUpperCase(),
      expirationDate: new Date(endDateTz).toISOString(),
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
