import {PassTypeEnum} from "../../../passes.types";
import {format} from "date-fns/format";
import {bgImgUrl, dateFormat, dateTimeFormat, logoUrl, organization} from "./config";
import {fromZonedTime} from "date-fns-tz";
import {walletobjects_v1} from "googleapis";

export default class TransportSubscriptionObject {
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
      ? format(startDateTz, dateTimeFormat)
      : format(startDateTz, dateTimeFormat);

    const endDateTz = fromZonedTime(params.endDate, 'Europe/Kiev')
    const endDate = params.type === PassTypeEnum.TRANSPORT_SUBSCRIPTION
      ? format(endDateTz, dateTimeFormat)
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
          "header": "Серія",
          "body": params.number,
        },
        {
          "id": "field_3",
          "header": "Дата придбання",
          "body":  startDate,
        },
        {
          "id": "field_4",
          "header": "Вартість",
          "body":  params.price + ' UAH',
        },
        {
          "id": "field_5",
          "header": "Організація",
          "body": params.companyName || organization,
        },
        {
          "id": "field_6",
          "header": "",
          "body": "",
        },
      ],
      // 'linksModuleData': {
      //   'uris': [
      //     {
      //       'uri': 'http://maps.google.com/',
      //       'description': 'Link module URI description',
      //       'id': 'LINK_MODULE_URI_ID'
      //     },
      //     {
      //       'uri': 'tel:6505555555',
      //       'description': 'Link module tel description',
      //       'id': 'LINK_MODULE_TEL_ID'
      //     }
      //   ]
      // },
      // 'imageModulesData': [
      //   {
      //     'mainImage': {
      //       'sourceUri': {
      //         'uri': 'https://drive.google.com/u/0/drive-viewer/AKGpihbZ4_nJUQ_JIEBKYoynF5o-oOuhBJz0FM5p6OgMx-B8KX5l3VjvcIruwWCw6dhNjL28141krvN_EqWbGyfymMT9w2H3y8KWc2c=s2560'
      //       },
      //       'contentDescription': {
      //         'defaultValue': {
      //           'language': 'en-US',
      //           'value': 'Image module description'
      //         }
      //       }
      //     },
      //     'id': 'IMAGE_MODULE_ID'
      //   }
      // ],
      'cardTitle': {
        'defaultValue': {
          'language': 'en-US',
          'value': 'Проїзний'
        }
      },
      'header': {
        'defaultValue': {
          'language': 'en-US',
          'value': params.typeName,
        }
      },
      // 'subheader': {
      //   'defaultValue': {
      //     'language': 'en-US',
      //     'value': 'КП Дніпровський електротранспорт ДМР',
      //   },
      // },
      'hexBackgroundColor': '#1E3A88',
      'logo': {
        'sourceUri': {
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
