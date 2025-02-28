import {PassQueryParams} from "../../passes.types";
import {format} from "date-fns/format";
import {dateFormat} from "../../android/generic/class/config";
import {fromZonedTime} from "date-fns-tz";

export const getParkingSubscriptionPass = (data: PassQueryParams) => {

  const startDateTz = fromZonedTime(data.startDate, 'Europe/Kiev')
  const endDateTz = fromZonedTime(data.endDate, 'Europe/Kiev')

  const startDate = format(startDateTz, dateFormat);
  const endDate = format(endDateTz, dateFormat);

  return {
    logoText: data.typeName.toUpperCase(),
    expirationDate: new Date(endDate).toISOString(),
    generic: {
      headerFields: [{
        "key": "subscriptionType",
        "label": "Тип",
        "value": `${data.typePeriod}`,
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
        // {
        //   "key": "price",
        //   "label": "Вартість",
        //   "value": `${data.price} UAH`
        // },
        {
          "key": "organization",
          "label": "Організація",
          "value": "КП Дніпровський ЕДМР",
          // "textAlignment": "PKTextAlignmentRight"
        }
      ]
    }
  }
};
