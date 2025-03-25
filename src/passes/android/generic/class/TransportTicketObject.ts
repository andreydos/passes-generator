import {PassTypeEnum} from "../../../passes.types";
import {format} from "date-fns/format";
import {bgImgUrl, dateFormat, dateTimeFormat, logoUrl} from "./config";
import {fromZonedTime} from "date-fns-tz";
import {walletobjects_v1} from "googleapis";

export default class TransportTicketObject {
  static getClass(id) {
    return {
      "id": id,
      "classTemplateInfo": {
        "cardTemplateOverride": {
          "cardRowTemplateInfos": [
            {
              "twoItems": {
                "startItem": {
                  "firstValue": {
                    "fields": [
                      {
                        "fieldPath": "object.textModulesData['field_1']",
                      },
                    ],
                  },
                },
                "endItem": {
                  "firstValue": {
                    "fields": [
                      {
                        "fieldPath": "object.textModulesData['field_2']",
                      },
                    ],
                  },
                },
              },
            },
            {
              "twoItems": {
                "startItem": {
                  "firstValue": {
                    "fields": [
                      {
                        "fieldPath": "object.textModulesData['field_3']",
                      },
                    ],
                  },
                },
                "endItem": {
                  "firstValue": {
                    "fields": [
                      {
                        "fieldPath": "object.textModulesData['field_4']",
                      },
                    ],
                  },
                },
              },
            },
            {
              "twoItems": {
                "startItem": {
                  "firstValue": {
                    "fields": [
                      {
                        "fieldPath": "object.textModulesData['field_5']",
                      },
                    ],
                  },
                },
                "endItem": {
                  "firstValue": {
                    "fields": [
                      {
                        "fieldPath": "object.textModulesData['field_6']",
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    }
  }

  static getObject(id, classId, params) {
    const startDateTz = fromZonedTime(params.startDate, 'Europe/Kiev')
    const startDate = params.type === PassTypeEnum.TRANSPORT_SUBSCRIPTION
      ? format(startDateTz, dateFormat)
      : format(startDateTz, dateTimeFormat);

    const endDateTz = fromZonedTime(params.endDate, 'Europe/Kiev')
    const endDate = params.type === PassTypeEnum.TRANSPORT_SUBSCRIPTION
      ? format(endDateTz, dateFormat)
      : format(endDateTz, dateTimeFormat);

    return {
      'id': id,
      'classId': classId,
      'state': 'ACTIVE',
      'heroImage': {
        'sourceUri': {
          'uri': bgImgUrl
        },
        'contentDescription': {
          'defaultValue': {
            'language': 'en-US',
            'value': 'Dnipro city'
          }
        }
      },

      'textModulesData': [
        {
          "id": "field_1",
          "header": "Дійсний до",
          "body": endDate,
        },
        {
          "id": "field_2",
          // "header": "Номер",
          "header": "Дата придбання",
          "body":  startDate,
        },
        {
          "id": "field_3",
          "header": "Серія",
          "body": params.number,
        },
        {
          "id": "field_4",
          "header": "Вартість",
          "body":  params.price + ' UAH',
        },
        {
          "id": "field_5",
          "header": "Організація",
          "body":  "КП Дніпровський електротранспорт ДМР",
        },
        {
          "id": "field_6",
          "header": "Бортовий номер",
          "body": params.bortNumber,
        },
      ],
      'cardTitle': {
        'defaultValue': {
          'language': 'en-US',
          'value': 'Квиток'
        }
      },
      'header': {
        'defaultValue': {
          'language': 'en-US',
          'value': params.typeName,
        }
      },
      'hexBackgroundColor': '#1E3A88',
      'logo': {
        'sourceUri': {
          // 'uri': 'https://erp.test.parkovka.app/passes-generator/e-Dnipro-logo.png'
          'uri': logoUrl
        },
        'contentDescription': {
          'defaultValue': {
            'language': 'en-US',
            'value': 'eDnipro'
          }
        }
      }
    } as walletobjects_v1.Schema$GenericObject
  }
}
