import { KycPdfCreator } from './kyc.pdf-creator';
import { IKycPdfCreator } from './kyc.pdf-creator.interface';
import { InKycNaturalCreateDto } from '../dto/natural/in.kyc.natural.create.dto';
import { IFileElement } from '../../core/abstract/file.element.interface';

// http://pdfmake.org/playground.html

const commonFontSize = KycPdfCreator.commonFontSize;

export class KycNaturalPdfCreator implements IKycPdfCreator  {
  private kycPdfCreator = new KycPdfCreator();

  private getParagraph1() {
    const paragraphNumber = 1;

    const personalInformation = this.dto.personalInformation;

    let firstName = `${personalInformation.firstName}`;
    if (personalInformation.middleName) {
      firstName += ` ${personalInformation.middleName}`;
    }

    const lastName = personalInformation.lastName;
    const dateOfBirth = this.kycPdfCreator.getDateView(personalInformation.birthDate);
    const placeOfBirth = this.kycPdfCreator.getCountry(personalInformation.country);
    const countryOfResidence = this.kycPdfCreator.getCountry(personalInformation.residenceCountry);

    let addressOfResidence = [
      personalInformation.stateOrProvince,
      personalInformation.city,
      personalInformation.address1,
    ].join(', ');
    if (personalInformation.address2) {
      addressOfResidence += `, ${personalInformation.address2}, `;
    }
    addressOfResidence += `${personalInformation.zipOrPostalCode}`;
    if (personalInformation.additionalCitizenship) {
      const additionalCitizenship = personalInformation.additionalCitizenship.map(el => this.kycPdfCreator.getCountry(el));
      const add = additionalCitizenship.join(', ');
      addressOfResidence += `, ${add}`;
    }

    const taxCountry = this.kycPdfCreator.getCountry(personalInformation.TaxResidenceCountry);

    return [
      this.kycPdfCreator.paragraphLabel(`${paragraphNumber}. Personal information`),
      {
        layout: 'lightLines',
        table: {
          widths: [ '*', '*' ],

          body: [
            [
              {
                fontSize: commonFontSize,
                colSpan: 2,
                text: `${paragraphNumber}.1 First name: ${firstName}`,
              }, {},
            ],
            [
              {
                fontSize: commonFontSize,
                colSpan: 2,
                text: `${paragraphNumber}.2 Last name: ${lastName}`,
              }, {},
            ],
            [
              {
                fontSize: commonFontSize,
                colSpan: 2,
                text: `Sex: ${personalInformation.gender}`,
              }, {},
            ],
            [
              {
                fontSize: commonFontSize,
                colSpan: 2,
                text: `${paragraphNumber}.3 Date of birth (dd.mm.yyyy): ${dateOfBirth}`,
              }, {},
            ],
            [
              {
                fontSize: commonFontSize,
                colSpan: 2,
                text: `${paragraphNumber}.4 Place of birth (country): ${placeOfBirth}`,
              }, {},
            ],
            [
              {
                fontSize: commonFontSize,
                colSpan: 2,
                text: `${paragraphNumber}.5 Personal code:`,
              }, {},
            ],
            [
              {
                fontSize: commonFontSize,
                colSpan: 2,
                text: `${paragraphNumber}.6 Country of residence: ${countryOfResidence}`,
              }, {},
            ],
            [
              {
                fontSize: commonFontSize,
                colSpan: 2,
                text: `${paragraphNumber}.7 Address of residence (street, building-apartment, zip code, city, country)\n${addressOfResidence}`,
              }, {},
            ],
            [
              {
                fontSize: commonFontSize,
                text: `${paragraphNumber}.8 Which tax country do you belong to?\n${taxCountry}`,
              },
              {
                fontSize: commonFontSize,
                text: `${paragraphNumber}.9 Tax Identification Number (TIN):`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `${paragraphNumber}.10 Contact phone:\n${personalInformation.contactPhone}`,
              },
              {
                fontSize: commonFontSize,
                text: `${paragraphNumber}.11 E-mail:\n${personalInformation.email}`,
              },
            ],
            [
              {
                colSpan: 2,
                fontSize: commonFontSize,
                text: [
                  {
                    text: 'To legally identify an individual, ',
                    bold: true,
                  },
                  'the following valid documents ',
                  'can be used: an identity card issued by Estonian state authorities ',
                  '(identity card); the identity card of a citizen of the European Union; ',
                  'The Estonian passport; the passport of the foreign citizen; ',
                  'the passport of the foreigner; driver\'s license issued in ',
                  'the Republic of Estonia; driver\'s license issued abroad if ',
                  'the document contains the user\'s name, photo or image of ',
                  'the person, signature, date of birth or personal identification code.',
                ],
              }, {},
            ],
          ],
        },
      },
    ];
  }

  private getParagraph2() {
    const paragraphNumber = 2;

    const benefic = this.dto.beneficiariesAndRepresentatives;
    const yes = benefic.representedByThirdParty === 'yes';

    const firstName = yes ? benefic.beneficFirstName3Party : '';
    const lastName = yes ? benefic.beneficLastName3Party : '';
    const dateOfBirth = yes ? this.kycPdfCreator.getDateView(benefic.beneficBirthDate3Party) : '';
    const basis = yes ? benefic.basisPowerAttorney : '';
    const field = yes ? benefic.fieldPowerAttorney : '';
    const term = yes ? benefic.termPowerAttorney : '';

    return [
      this.kycPdfCreator.paragraphLabel(
        `${paragraphNumber}. Representative data (if the client is represented by third party)`,
      ),
      {
        layout: 'lightLines',
        table: {
          widths: [ '*' ],

          body: [
            [
              {
                fontSize: commonFontSize,
                text: `${paragraphNumber}.1 First name: ${firstName}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `${paragraphNumber}.2 Last name: ${lastName}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `${paragraphNumber}.3 Date of birth (dd.mm.yyyy): ${dateOfBirth}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `${paragraphNumber}.4 Basis for the Power of Attorney: ${basis}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `${paragraphNumber}.5 Field of the Power of Attorney: ${field}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `${paragraphNumber}.6 Term of the Power of Attorney: ${term}`,
              },
            ],
          ],
        },
      },
    ];
  }

  private getParagraph3() {
    const paragraphNumber = 3;

    const benefic = this.dto.beneficiariesAndRepresentatives;

    const yes = benefic.PEP === 'yes';

    const yesLabel = yes ? 'X' : '   ';
    const noLabel = yes ? '   ' : 'X';

    const name = yes ? benefic.officialFullName : '';
    const position = yes ? benefic.officialPosition : '';
    const relation = yes ? benefic.politicallyExposedRelation : '';

    return [
      this.kycPdfCreator.paragraphLabel(
        `${paragraphNumber}. Is the client or their representative or their family member ` +
        'or a close associate a politically exposed person?',
      ),
      {
        layout: 'lightLines',
        table: {
          widths: [ '*' ],

          body: [
            [
              {
                fontSize: commonFontSize,
                text: [
                  'A politically exposed person is a natural person who is or who has been entrusted ',
                  'with prominent public functions including being head of State ',
                  'head of government, minister and deputy or assistant minister; ',
                  'a member of the parliament or a similar legislative body ',
                  'a member of a governing body or a political party, a member of the supreme court, ',
                  'a member of a court of auditors or the board of a central bank; an ambassador,',
                  'a chargé d\'affaires and a high-ranking officer in the armed forces; ',
                  'a member of an administrative, management or supervisory body ',
                  'of a State-owned enterprise; a director, deputy director and member of the board or equivalent ',
                  'function of an international organisation, except middle-ranking or more junior officials.',
                ],
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: [
                  `${paragraphNumber}.1 Is the client or their representative or their family member or `,
                  'a close associate a politically exposed person?\n',
                  `Yes  [${yesLabel}]\n`,
                  `No   [${noLabel}]`,
                ],
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: [
                  {
                    color: 'red',
                    text: [
                      `Please fill ${paragraphNumber}.2, ${paragraphNumber}.3`,
                      `and ${paragraphNumber}.4 if the answer in ${paragraphNumber}.1 is "Yes"\n`,
                    ],
                  },
                  `${paragraphNumber}.2 Name and surname of the official: ${name}\n`,
                  `${paragraphNumber}.3 Position: ${position}\n`,
                  `${paragraphNumber}.4 Contact with the client (1-I am a politically `,
                  'exposed person, 2-Family member of a politically exposed ',
                  'person, 3-Person known to be a close associate of a politically exposed person):\n',
                  `${relation}`,
                ],
              },
            ],
          ],
        },
      },
    ];
  }

  private getParagraph4() {
    const paragraphNumber = 4;

    const benefic = this.dto.beneficiariesAndRepresentatives;

    const no = benefic.ultimateBeneficiary === 'no';

    const yesLabel = no ? '   ' : 'X';
    const noLabel = no ? 'X' : '   ';

    const firstName = no ? benefic.beneficFirstNameUltBeneficiary : '';
    const lastName = no ? benefic.beneficLastNameUltBeneficiary : '';
    const dateOfBirth = no ? this.kycPdfCreator.getDateView(benefic.beneficBirthDateUltBeneficiary) : '';
    const placeOfBirth = this.kycPdfCreator.getCountry(no ? benefic.beneficBirthPlace : '');
    const personalCode = no ? benefic.personalCode : '';
    const country = this.kycPdfCreator.getCountry(no ? benefic.beneficResidenceCountry : '');

    return [
      this.kycPdfCreator.paragraphLabel(`${paragraphNumber}. Provision of data`),
      {
        layout: 'lightLines',
        table: {
          widths: [ '*' ],

          body: [
            [
              {
                fontSize: commonFontSize,
                text: [
                  `${paragraphNumber}.1 I am the ultimate beneficiary:\n`,
                  `Yes  [${yesLabel}]\n`,
                  `No   [${noLabel}]`,
                ],
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: [
                  `The ultimate beneficiary is: (please fill in if the answer in ${paragraphNumber}.1 is "No"):\n`,
                  `${paragraphNumber}.2 First name: ${firstName}\n`,
                  `${paragraphNumber}.3 Last name: ${lastName}\n`,
                  `${paragraphNumber}.4 Date of birth (dd.mm.yyyy): ${dateOfBirth}\n`,
                  `${paragraphNumber}.5 Place of birth (country): ${placeOfBirth}\n`,
                  `${paragraphNumber}.6 Personal code: ${personalCode}\n`,
                  `${paragraphNumber}.7 Country of residence: ${country}`,
                ],
              },
            ],
          ],
        },
      },
    ];
  }

  private getParagraph5() {
    const paragraphNumber = 5;

    return [
      this.kycPdfCreator.paragraphLabel(`${paragraphNumber}. Additional information and notes`),
      this.kycPdfCreator.emptyTable(''),
    ];
  }

  private getParagraph6() {
    const paragraphNumber = 6;
    return [
      this.kycPdfCreator.paragraphLabel(`${paragraphNumber}. Customer Representative`),
      {
        layout: 'lightLines',
        table: {
          widths: [ '*' ],

          body: [
            [
              {
                fontSize: commonFontSize,
                text: [
                  `${paragraphNumber}.1 First name:\n`,
                  `${paragraphNumber}.2 Last name:\n`,
                  `${paragraphNumber}.3 Signature:\n`,
                  `${paragraphNumber}.4 Date of completion (dd.mm.yyyy):`,
                ],
              },
            ],
          ],
        },
      },
    ];
  }

  private getParagraph7() {
    const paragraphNumber = 7;

    return [
      this.kycPdfCreator.paragraphLabel(`${paragraphNumber}. BaGuk Finance OÜ representative`),
      {
        layout: 'lightLines',
        table: {
          widths: [ '*' ],

          body: [
            [
              {
                fontSize: commonFontSize,
                text: [
                  `${paragraphNumber}.1 First name:\n`,
                  `${paragraphNumber}.2 Last name\n`,
                  `${paragraphNumber}.3 Signature:`,
                ],
              },
            ],
          ],
        },
      },
    ];
  }

  private getPhoto() {
    const defaultWidth = 510;
    const labelOptions = {
      pageBreak: 'before' as 'before',
    };

    let backSide: any = [];
    if (this.files.documentBack && this.dto.personalInformation.documentIsDoubleSided) {
      backSide = [
        this.kycPdfCreator.paragraphLabel('Back side of identity document', labelOptions),
        {
          width: defaultWidth,
          image: this.files.documentBack.buffer,
        },
      ];
    }

    return [
      this.kycPdfCreator.paragraphLabel('Front side of identity document', labelOptions),
      {
        width: defaultWidth,
        image: this.files.documentFront.buffer,
      },

      ...backSide,

      this.kycPdfCreator.paragraphLabel('Selfie', labelOptions),
      {
        width: defaultWidth,
        image: this.files.selfie.buffer,
      },
    ];
  }

  getDocDefinition() {
    return {
      content: [
        this.kycPdfCreator.getMainLabel('Questionnaire for a natural person'),

        this.getParagraph1(),
        this.getParagraph2(),
        this.getParagraph3(),
        this.getParagraph4(),
        this.getParagraph5(),
        this.kycPdfCreator.getInfo(),
        this.getParagraph6(),
        this.getParagraph7(),

        this.getPhoto(),

        this.kycPdfCreator.getAccountInfo(this.email, this.accountId),
      ],

      footer: this.kycPdfCreator.getFooter(),
      header: this.kycPdfCreator.getHeader(),
    };
  }

  constructor(
    private readonly dto: InKycNaturalCreateDto,
    private readonly files: IFiles,
    private readonly email: string,
    private readonly accountId: number,
  ) { }
}

interface IFiles {
  readonly selfie: IFileElement;
  readonly documentFront: IFileElement;
  readonly documentBack?: IFileElement;
}