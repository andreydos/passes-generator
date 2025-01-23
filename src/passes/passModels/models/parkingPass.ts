import {PassQueryParams} from "../../passes.types";
import {format} from "date-fns/format";
import {dateFormat} from "../../android/generic/class/config";

export const getParkingSubscriptionPass = (data: PassQueryParams) => {
  const startDate = format(data.startDate, dateFormat);
  const endDate = format(data.endDate, dateFormat);

  return {
    logoText: data.typeName.toUpperCase(),
    expirationDate: new Date(data.endDate).toISOString(),
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
