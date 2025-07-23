import {PassQueryParams} from "../../passes.types";
import {format} from "date-fns/format";
import {dateFormat, organization} from "../../android/generic/class/config";
import {fromZonedTime} from "date-fns-tz";

export const getParkingSubscriptionPass = (data: PassQueryParams) => {

  const startDateTz = fromZonedTime(data.startDate, 'Europe/Kiev')
  const endDateTz = fromZonedTime(data.endDate, 'Europe/Kiev')

  const startDate = format(startDateTz, dateFormat);
  const endDate = format(endDateTz, dateFormat);

  return {
    logoText: 'Парковка',
    expirationDate: new Date(endDateTz).toISOString(),
    description: 'Парковка',
    eventTicket: {
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
          "key": "startDate",
          "label": "Дата придбання",
          "value": startDate,
          // "textAlignment": "PKTextAlignmentRight"
        },
      ],
      "auxiliaryFields": [
        // {
        //   "key": "price",
        //   "label": "Вартість",
        //   "value": `${data.price} UAH`
        // },
        {
          "row": 0,
          "key": "number",
          "label": "Номер",
          "value": data.number,
        },
        {
          "row": 1,
          "key": "organization",
          "label": "Організація",
          "value": data.companyName || organization,
          // "textAlignment": "PKTextAlignmentRight"
        },
      ]
    }
  }
};
