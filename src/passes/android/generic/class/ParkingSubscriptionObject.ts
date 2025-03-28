import {format} from "date-fns/format";
import {bgImgUrl, dateFormat, logoUrl} from "./config";
import {fromZonedTime} from "date-fns-tz";

export default class ParkingSubscriptionObject {
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
    const endDateTz = fromZonedTime(params.endDate, 'Europe/Kiev')

    const startDate = format(startDateTz, dateFormat);
    const endDate = format(endDateTz, dateFormat);



    return  {
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
            'value': 'Hero image description'
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
          "header": "Дата придбання",
          "body":  startDate,
        },
        {
          "id": "field_3",
          "header": "Номер",
          "body": params.number,
        },
        // {
        //   "id": "field_4",
        //   "header": ""
        //   // "header": "Вартість",
        //   // "body":  params.price + ' UAH',
        // },
        {
          "id": "field_5",
          "header": "Організація",
          "body":  "КП Дніпровський електротранспорт ДМР",
        },
        {
          "id": "field_4",
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
          'value': 'Парковка'
        }
      },
      'header': {
        'defaultValue': {
          'language': 'en-US',
          'value': params.typePeriod,
        }
      },
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
    }
  }
}
