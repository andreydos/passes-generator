import {fromZonedTime} from 'date-fns-tz';
import {format} from "date-fns/format";
import {PassQueryParams, PassTypeEnum} from "../../passes.types";
import {dateFormat, dateTimeFormat} from "../../android/generic/class/config";

// Назва КП "Дніпровський електротранспорт" ДМР
// Дата та час придбання
// Серія квитка
// Бортовий номер
// Вартість
// Дійсний до ( дата та час до якої квиток є дійсним)

export const getTransportPass = (data: PassQueryParams) => {
  const description = data.type === PassTypeEnum.TRANSPORT_SUBSCRIPTION ? 'Проїзний' : 'Квиток';
  const startDateTz = fromZonedTime(data.startDate, 'Europe/Kiev')
  const startDate = data.type === PassTypeEnum.TRANSPORT_SUBSCRIPTION
    ? format(startDateTz, dateFormat)
    : format(startDateTz, dateTimeFormat);

  const endDateTz = fromZonedTime(data.endDate, 'Europe/Kiev')
  const endDate = data.type === PassTypeEnum.TRANSPORT_SUBSCRIPTION
    ? format(endDateTz, dateFormat)
    : format(endDateTz, dateTimeFormat);

  const auxiliaryFields = [];
  auxiliaryFields.push({
    "row": 0,
    "key": "number",
    "label": "Серія",
    "value": data.number,
    // "textAlignment": "PKTextAlignmentRight"
  });
  data.type === PassTypeEnum.TRANSPORT_TICKET && auxiliaryFields.push({
    "row": 0,
    "key": "bortNumber",
    "label": "Бортовий номер",
    "value": `${data.bortNumber}`
  })
  auxiliaryFields.push({
    "row": 1,
    "key": "organization",
    "label": "Організація",
    "value": "КП Дніпровський електротранспорт ДМР",
    // "textAlignment": "PKTextAlignmentLeft"
  })



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
