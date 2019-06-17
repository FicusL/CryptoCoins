import { Countries } from '../const/countries';
import { isDate } from 'util';

export class KycPdfCreator {
  static commonFontSize = 10;

  getCountry(value: string) {
    const result = Countries.find(el => el.value === value);
    return result ? result.label : value;
  }

  getDateView(date: Date) {
    // dd.mm.yyyy
    if (!isDate(date)) {
      return date;
    }

    const dd = `${date.getDate()}`.padStart(2, '0');
    const mm = `${date.getMonth() + 1}`.padStart(2, '0');
    const yyyy = date.getFullYear();

    return `${dd}.${mm}.${yyyy}`;
  }

  getHeader() {
    return () => {
      return {
        margin: [0, 10, 30, 0],
        alignment: 'right',
        text: 'ZiChange',
        bold: true,
        fontSize: 18,
      };
    };
  }

  getFooter() {
    return (page, pages) => {
      return {
        columns: [
          {
            margin: [30, 0, 0, 0],
            fontSize: 8,
            text: [
              'BaGuk Finance OÜ reg. code: 14432499\n',
              'Narva mnt 13, 10151 Tallinn, Estonia\n',
              'Operating Licenses: №FVR000064, №FRK000047, №FFA000300',
            ],
          },
          {
            margin: [0, 0, 30, 0],
            alignment: 'right',
            text: [
              {
                text: page.toString(),
              },
            ],
          },
        ],
        margin: [10, 0],
      };
    };
  }

  getAccountInfo(email: string, accountId: number) {
    return {
      margin: [0, 30, 0, 0],
      layout: 'lightLines',
      table: {
        widths: [ '*' ],
          body: [
          [
            {
              fontSize: KycPdfCreator.commonFontSize,
              text: `Email: ${email}`,
            },
          ],
          [
            {
              fontSize: KycPdfCreator.commonFontSize,
              text: `Account id: ${accountId}`,
            },
          ],
        ],
      },
    };
  }

  getMainLabel(label: string) {
    return {
      text: label,
      alignment: 'center',
      bold: true,
      fontSize: 15,
    };
  }

  getInfo() {
    return [
      {
        margin: [0, 16, 0, 5],
        layout: 'lightLines',
        table: {
          widths: [ '*' ],

          body: [
            [{
              fontSize: KycPdfCreator.commonFontSize,
              stack: [
                'By signing this questionnaire:',
                {
                  ul: [
                    {
                      text: [
                        'I confirm that the information provided in this ',
                        's questionnaire is current, complete and accurate;',
                      ],
                    },
                    {
                      text: [
                        'I undertake to notify BaGuk Finance OÜ within 15 days of ',
                        'any changes in the circumstances in which the information ',
                        'provided herein is deemed to be incorrect, incomplete, or obsolete;',
                      ],
                    },
                    {
                      text: [
                        'I confirm that I am aware of my responsibility to provide ',
                        'correct data. I consent to the processing of my personal data.',
                      ],
                    },
                    {
                      text: [
                        'I permit BaGuk Finance OÜ (location: Narva mnt 13, Tallinn 10151, Estonia, registration code ',
                        '14432499) to transfer the information contained in this form to the regulatory authorities, in order ',
                        'to comply with the requirements of applicable law, including with regard to combating the ',
                        'legalization (laundering) of proceeds from crime and financing of terrorism, as well as reporting to ',
                        'the tax authorities. I permit BaGuk Finance OÜ to transfer information contained in this form to ',
                        'third parties for the purpose of assisting with the customer due diligence processes;',
                      ],
                    },
                    {
                      text: [
                        'I confirm that any failure to act in terms of the above will constitute a breach of these General Terms ',
                        'and BaGuk Finance OÜ will be entitled to terminate the relationship by cancelling or closing any ',
                        'product or service, subject to BaGuk Finance OÜ’s right to demand payment of any fee or charge ',
                        'that is due for any such service or product.',
                      ],
                    },
                  ],
                },
              ],
            }],
          ],
        },
      },
    ];
  }

  lineBreak() {
    return {
      margin: [0, 16, 0, 0],
      text: '',
    };
  }

  paragraphLabel(label: string, options?: {pageBreak: 'before'|'after'}) {
    return {
      text: label,
      bold: true,
      margin: [0, 16, 0, 0],
      ...options,
    };
  }

  emptyTable(content: string) {
    return {
      layout: 'lightLines',
      table: {
        widths: [ '*' ],
        body: [
          [
            {
              fontSize: KycPdfCreator.commonFontSize,
              text: content,
            },
          ],
        ],
      },
    };
  }
}