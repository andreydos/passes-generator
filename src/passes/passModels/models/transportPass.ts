import {fromZonedTime} from 'date-fns-tz';
import {format} from "date-fns/format";
import {PassQueryParams, PassTypeEnum} from "../../passes.types";
import {dateFormat, dateTimeFormat, organization, transportTypeName} from "../../android/generic/class/config";

// Назва КП "Дніпровський електротранспорт" ДМР
// Дата та час придбання
// Серія квитка
// Бортовий номер
// Вартість
// Дійсний до ( дата та час до якої квиток є дійсним)

export const getTransportSubscriptionPass = (data: PassQueryParams) => {
  const description = 'Проїзний';
  const startDateTz = fromZonedTime(data.startDate, 'Europe/Kiev')
  const startDate = format(startDateTz, dateFormat);

  const endDateTz = fromZonedTime(data.endDate, 'Europe/Kiev')
  const endDate = format(endDateTz, dateFormat);

  const auxiliaryFields = [
    {
      "row": 0,
      "key": "number",
      "label": "Серія",
      "value": data.number,
      // "textAlignment": "PKTextAlignmentRight"
    },
    {
      "row": 1,
      "key": "organization",
      "label": "Організація",
      "value": organization,
      // "textAlignment": "PKTextAlignmentLeft"
    }
  ];

  return {
    logoText: description,
    expirationDate: new Date(endDateTz).toISOString(),
    description: description,
    eventTicket: {
      headerFields: [{
        "key": "price",
        "label": "Вартість",
        "value": `${data.price} UAH`,
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
          "key": "startDate",
          "label": "Дата придбання",
          "value": startDate,
        },
      ],
      "auxiliaryFields": auxiliaryFields,
    }
  }
};

export const getTransportTicketPass = (data: PassQueryParams) => {
  const description = 'Квиток';
  const startDateTz = fromZonedTime(data.startDate, 'Europe/Kiev')
  const startDate = format(startDateTz, dateTimeFormat);

  const endDateTz = fromZonedTime(data.endDate, 'Europe/Kiev')
  const endDate = format(endDateTz, dateTimeFormat);

  const headerFields = [];
  transportTypeName[data.transportType] && headerFields.push(
    {
      "key": "type",
      "label": "Тип",
      "value": transportTypeName[data.transportType],
    }
  );

  const auxiliaryFields = [
    {
      "row": 0,
      "key": "number",
      "label": "Серія",
      "value": data.number,
      // "textAlignment": "PKTextAlignmentRight"
    },
    {
      "row": 0,
      "key": "bortNumber",
      "label": "Бортовий номер",
      "value": `${data.bortNumber}`
    },
    {
      "row": 0,
      "key": "price",
      "label": "Вартість",
      "value": `${data.price} UAH`,
    },
    {
      "row": 1,
      "key": "organization",
      "label": "Організація",
      "value": organization,
      // "textAlignment": "PKTextAlignmentLeft"
    }
  ];

  return {
    logoText: description,
    expirationDate: new Date(endDateTz).toISOString(),
    description: description,
    eventTicket: {
      headerFields: headerFields,
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
      secondaryFields: [
        {
          "key": "startDate",
          "label": "Дата придбання",
          "value": startDate,
        },
      ],
      auxiliaryFields: auxiliaryFields,
    }
  }
};
