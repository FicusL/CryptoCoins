import { KycPdfCreator } from './kyc.pdf-creator';
import { IKycPdfCreator } from './kyc.pdf-creator.interface';
import { InKycLegalCreateDTO } from '../dto/legal/in.kyc.legal.create.dto';
import { InKycLegalNestedPersonDto } from '../dto/legal/parts/nested/in.kyc.legal.nested.person.dto';
import { InKycLegalNestedPartnerDto } from '../dto/legal/parts/nested/in.kyc.legal.nested.partner.dto';
import { KycTotalTurnover } from '../const/kyc.total-turnover.enum';

// http://pdfmake.org/playground.html

const commonFontSize = KycPdfCreator.commonFontSize;

export class KycLegalPdfCreator implements IKycPdfCreator {
  private kycPdfCreator = new KycPdfCreator();

  private getPerson6(personNumber: number, person: InKycLegalNestedPersonDto) {
    const firstName = person.firstName;
    const lastName = person.lastName;
    const birthDate = this.kycPdfCreator.getDateView(new Date(person.birthDate));
    const country = this.kycPdfCreator.getCountry(person.country);
    const personalCode = person.personalCode || '';
    const residenceCountry = this.kycPdfCreator.getCountry(person.residenceCountry);

    const yes = person.politicallyExposed === 'yes';
    const yesLabel = yes ? 'X' : '   ';
    const noLabel = yes ? '   ' : 'X';

    const politicallyExposedName = yes ? person.politicallyExposedName : '';
    const politicallyExposedPosition = yes ? person.politicallyExposedPosition : '';
    const politicallyExposedRelation = yes ? person.politicallyExposedRelation : '';

    return [
      {
        margin: [0, 16, 0, 0],
        text: `6.${personNumber} Person ${personNumber}:`,
      },
      {
        layout: 'lightLines',
        table: {
          widths: [ '*' ],
          body: [
            [
              {
                fontSize: commonFontSize,
                text: `First name: ${firstName}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `Last name: ${lastName}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `Date of birth (dd.mm.yyyy): ${birthDate}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `Place of birth (country): ${country}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `Personal code (if any): ${personalCode}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `Country of residence: ${residenceCountry}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `Address of residence (street, building-apartment, zip code, city, country): ${person.addressOfResidence}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: [
                  'Is the natural person or their family member or a close associate PEP? Kindly tick the box:\n',
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
                    text: 'If the answer to the above is "Yes", kindly complete the following:\n',
                  },
                  `Full name of the official: ${politicallyExposedName}\n`,
                  `Position: ${politicallyExposedPosition}\n`,
                  'Contact with the person',
                  ' (1- I am a PEP, 2- Family member of a PEP, 3- Person known to be a close associate of a PEP): ',
                  `${politicallyExposedRelation}`,
                ],
              },
            ],
          ],
        },
      },
    ];
  }

  private getPerson7(personNumber: number, person: InKycLegalNestedPersonDto) {
    const firstName = person.firstName;
    const lastName = person.lastName;
    const birthDate = this.kycPdfCreator.getDateView(new Date(person.birthDate));
    const country = this.kycPdfCreator.getCountry(person.country);
    const personalCode = person.personalCode || '';
    const residenceCountry = this.kycPdfCreator.getCountry(person.residenceCountry);

    const yes = person.politicallyExposed === 'yes';
    const yesLabel = yes ? 'X' : '   ';
    const noLabel = yes ? '   ' : 'X';

    const politicallyExposedName = yes ? person.politicallyExposedName : '';
    const politicallyExposedPosition = yes ? person.politicallyExposedPosition : '';
    const politicallyExposedRelation = yes ? person.politicallyExposedRelation : '';

    return [
      {
        margin: [0, 16, 0, 0],
        text: `7.${personNumber} Person ${personNumber}:`,
      },

      {
        layout: 'lightLines',
        table: {
          widths: [ '*', '*' ],
          body: [
            [
              {
                fontSize: commonFontSize,
                text: `First name: ${firstName}`,
              },
              {
                fontSize: commonFontSize,
                text: `Last name: ${lastName}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `Date of birth (dd.mm.yyyy): ${birthDate}`,
              },
              {
                fontSize: commonFontSize,
                text: `Place of birth (country): ${country}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `Personal code (if any): ${personalCode}`,
              },
              {
                fontSize: commonFontSize,
                text: `Country of residence: ${residenceCountry}`,
              },
            ],
            [
              {
                colSpan: 2,
                fontSize: commonFontSize,
                text: `Address of residence (street, building-apartment, zip code, city, country): ${person.addressOfResidence}`,
              },
            ],
            [
              {
                colSpan: 2,
                fontSize: commonFontSize,
                text: [
                  'Is the natural person or their family member or a close associate PEP? Kindly tick the box:\n',
                  `Yes  [${yesLabel}]\n`,
                  `No   [${noLabel}]`,
                ],
              },
            ],
            [
              {
                colSpan: 2,
                fontSize: commonFontSize,
                text: [
                  {
                    color: 'red',
                    text: 'Please provide the following data if the answer in the above is "Yes":\n',
                  },
                  `Full name of the official: ${politicallyExposedName}\n`,
                  `Position: ${politicallyExposedPosition}\n`,
                  'Contact with the person',
                  ' (1- I am a PEP, 2- Family member of a PEP, 3- Person known to be a close associate of a PEP): ',
                  `${politicallyExposedRelation}`,
                ],
              },
            ],
          ],
        },
      },
    ];
  }

  private getPartner8(partnerNumber: number, partner: InKycLegalNestedPartnerDto) {
    return [
      {
        margin: [0, 16, 0, 0],
        text: `8.${partnerNumber} Partner ${partnerNumber}:`,
      },

      {
        layout: 'lightLines',
        table: {
          widths: [ '*', '*' ],

          body: [
            [
              {
                colSpan: 2,
                fontSize: commonFontSize,
                text: `Name: ${partner.name}`,
              }, {},
            ],
            [
              {
                fontSize: commonFontSize,
                text: `Reg. Number: ${partner.regNumber}`,
              },
              {
                fontSize: commonFontSize,
                text: `Country of registration: ${this.kycPdfCreator.getCountry(partner.regCountry)}`,
              },
            ],
            [
              {
                colSpan: 2,
                fontSize: commonFontSize,
                text: `Kind of activity: ${partner.activity}`,
              }, {},
            ],
          ],
        },
      },
    ];
  }

  private yesNoTable(yes: boolean) {
    const yesLabel = yes ? 'X' : '   ';
    const noLabel = yes ? '   ' : 'X';

    return {
      layout: 'lightLines',
      table: {
        widths: [ '*' ],
        body: [
          [
            {
              fontSize: commonFontSize,
              text: [
                `Yes  [${yesLabel}]\n`,
                `No   [${noLabel}]`,
              ],
            },
          ],
        ],
      },
    };
  }

  private getParagraph1() {
    const d = this.dto.customerInformation;

    return [
      this.kycPdfCreator.paragraphLabel('1. Customer information'),

      {
        layout: 'lightLines',
        table: {
          widths: [ '*', '*' ],

          body: [
            [
              {
                fontSize: commonFontSize,
                colSpan: 2,
                text: `1.1 Company full legal name: ${d.companyName}`,
              }, {},
            ],
            [
              {
                fontSize: commonFontSize,
                text: `1.2 Registration number: ${d.registrationNumber}`,
              },
              {
                fontSize: commonFontSize,
                text: `1.2.1 Country of Registration: ${d.countryOfRegistration}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                colSpan: 2,
                text: `1.3 Registration date (dd.mm.yyyy): ${this.kycPdfCreator.getDateView(new Date(d.registrationDate))}`,
              }, {},
            ],
            [
              {
                fontSize: commonFontSize,
                colSpan: 2,
                text: `1.4 Legal address (street, building-room, zip code, city, country):\n${this.kycPdfCreator.getCountry(d.legalAddress)}`,
              }, {},
            ],
            [
              {
                fontSize: commonFontSize,
                colSpan: 2,
                text: `1.5 Correspondence address [if it differs from 1.4]: ${d.correspondenceAddress}`,
              }, {},
            ],
            [
              {
                fontSize: commonFontSize,
                text: `1.6 Contact phone:\n${d.contactPhone}`,
              },
              {
                fontSize: commonFontSize,
                text: `1.7 E-mail of the company:\n${d.companyEmail}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                colSpan: 2,
                text: `1.8 Web-site: ${d.webPage || ''}`,
              }, {},
            ],
            [
              {
                colSpan: 2,
                fontSize: commonFontSize,
                text: [
                  '1.9 For the identification and verification of a legal entity registered in Estonia or a branch of a foreign ',
                  'company registered in Estonia kindly provide:\n',
                  '1.9.1 An original or certified copy of an extract from the relevant registry (not older than 15 days) or',
                  'another document legally equivalent to an extract from the registration card (such as a certificate of',
                  'incumbency); and\n',
                  '1.9.2 An original or certified copy of the latest Memorandum and Articles of Association (M&A).\n',
                  '\n',
                  '1.10 For the identification of a foreign legal entity, kindly provide:\n',
                  '1.10.1 An original or certified copy of the statement from the relevant register or certificate of ',
                  'registration or another official document legally equivalent to an extract from the register (such as a ',
                  'certificate of incumbency);\n',
                  '1.10.2 An original or certified copy of the latest Memorandum and Articles of Association (M&A).\n',
                  '\n',
                  '1.11 If the structure of the legal entity includes a trust kindly provide:\n',
                  '1.11.1 A certified copy of the trust deed or a written confirmation from the trustee confirming the ',
                  'following details:\n',
                  '- a. Name of trust\n',
                  '- b. Date of establishment/settlement\n',
                  '- c. Nature and purpose of the trust\n',
                  '- d. Jurisdiction whose laws govern the arrangement, as set out in the trust instrument\n',
                  '- e. Assets being held under trust\n',
                  '- f. Identification information of the: trustee; settlor(s); known beneficiary(ies) or class of ',
                  'beneficiaries; any protector(s); any other natural person excising ultimate control over the trust by ',
                  'means of direct or indirect ownership or by other means.\n',
                  '1.11.2 For other types of legal entities (such as a foundation) or legal arrangements similar to a trust ',
                  'which administer and distribute funds, kindly provide constitutional documents and details on the ',
                  'natural person(s) holding equivalent or similar positions to those referred to above.\n',
                  '\n',
                  '1.12 In addition, all legal entities must provide a full group structure, including an ownership and ',
                  'control structure chart. The chart should contain all the company(ies) registered name(s), registration ',
                  'numbers, country of registration, as well as the percentage of ownership of each layer until all the ',
                  'ultimate beneficial owners (UBOs) is/are identified. The chart should be dated and signed by the ',
                  'entity’s representative(s).',
                ],
              }, {},
            ],
          ],
        },
      },

      this.kycPdfCreator.lineBreak(),

      {
        layout: 'lightLines',
        table: {
          widths: [ '*' ],
          body: [
            [
              {
                fontSize: commonFontSize,
                text: [
                  ' Certification of documents is required as independent confirmation of authentication. Documents need ',
                  'to be certified by a notary and such certification should be evidenced by writing:\n',
                  '- the document is a true copy of the original document; and\n',
                  '- the document has been seen and verified by the certifier.\n',
                  'The certifier must also sign and date the document indicating his/her: name and surname; contact ',
                  'details; and profession, designation or capacity.\n',
                  'Additionally, any documentation which is not in English or Estonian, should be translated to English. ',
                  'Translation should be dated, signed and certified by an independent person of proven competence ',
                  'confirming that it is a faithful translation of the original. If obtained from overseas the document must be ',
                  'apostilled.',
                ],
              },
            ],
          ],
        },
      },
    ];
  }

  private getParagraph2() {
    const d = this.dto.customerInformation;

    const yes = d.subsidiaryCompany === 'yes';
    const yesLabel = yes ? 'X' : '   ';
    const noLabel = yes ? '   ' : 'X';

    const structure = d.companyStructure;

    return [
      this.kycPdfCreator.paragraphLabel('2. Is your company a subsidiary or has subsidiaries?'),
      {
        layout: 'lightLines',
        table: {
          widths: [ '*' ],
          body: [
            [
              {
                fontSize: commonFontSize,
                text: `2.1 Yes [${yesLabel}]   No [${noLabel}]`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `2.2 Please describe the structure if answer in 2.1 is "Yes":\n${structure}`,
              },
            ],
          ],
        },
      },
    ];
  }

  private getParagraph3() {
    const d = this.dto.customerInformation;

    const yes = d.registeredOrLicensedActivity === 'yes';
    const yesLabel = yes ? 'X' : '   ';
    const noLabel = yes ? '   ' : 'X';

    return [
      this.kycPdfCreator.paragraphLabel('3. The main activity of the company, the country of operation'),
      {
        layout: 'lightLines',
        table: {
          widths: [ '*' ],
          body: [
            [
              {
                fontSize: commonFontSize,
                text: [
                  '3.1 Please provide the following details: the main activity; number of branches; and number of ',
                  `employees of the company: ${d.companyActivity}`,
                ],
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: [
                  `3.2 Please provide the following details: main country of operation: `,
                  `${this.kycPdfCreator.getCountry(d.operationCountry)}`,
                ],
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `3.3 The activity is licensed or registered: Yes [${yesLabel}]   No [${noLabel}]`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `3.4 License or registration number (if any): ${d.licenseOrRegistrationNumber || ''}`,
              },
            ],
          ],
        },
      },
    ];
  }

  private getParagraph4() {
    const d = this.dto.customerInformation;

    const fiatToCryptoExchangeLabel = d.fiatToCryptoExchange ? 'X' : '   ';
    const cryptoToFiatExchangeLabel = d.cryptoToFiatExchange ? 'X' : '   ';
    const cryptoToCryptoExchangeLabel = d.cryptoToCryptoExchange ? 'X' : '   ';
    const otherLabel = d.other ? 'X' : '   ';

    const getTurnoverLabel = (turnover: KycTotalTurnover) => (turnover === d.totalTurnover) ? 'X' : '   ';

    return [
      this.kycPdfCreator.paragraphLabel('4. Purpose of the business relationship:'),

      {
        fontSize: commonFontSize,
        margin: [ 20, 10, 0, 0 ],
        text: '4.1 What is the legal entity’s total turnover per year (EUR)?',
        bold: true,
      },
      {
        margin: [ 40, 10, 40, 0 ],
        fontSize: commonFontSize,
        columns: [
          {
            stack: [
              `[${getTurnoverLabel(KycTotalTurnover.Less100)}] < 100,000`,
              `[${getTurnoverLabel(KycTotalTurnover.Between100_500)}] 100,000 – 500,000`,
              `[${getTurnoverLabel(KycTotalTurnover.Between500_1k)}] 500,000 – 1,000,000`,
              ``,
            ],
          },
          {
            stack: [
              `[${getTurnoverLabel(KycTotalTurnover.Between1k_2k)}] 1,000,000 – 2,000,000`,
              `[${getTurnoverLabel(KycTotalTurnover.Between2k_10k)}] 2,000,000 – 10,000,000`,
              `[${getTurnoverLabel(KycTotalTurnover.Between10k_50k)}] 10,000,000 – 50,000,000`,
              `[${getTurnoverLabel(KycTotalTurnover.More50k)}] > 50,000,000`,
            ],
          },
        ],
      },
      {
        fontSize: commonFontSize,
        margin: [ 20, 10, 0, 0 ],
        text: '4.2 What is the purpose of the use of Baguk Finance OÜ’s services?',
        bold: true,
      },
      {
        margin: [ 40, 10, 40, 0 ],
        fontSize: commonFontSize,
        stack: [
          `[${fiatToCryptoExchangeLabel}] Fiat to cryptocurrency exchange`,
          `[${cryptoToFiatExchangeLabel}] Cryptocurrency to fiat exchange`,
          `[${cryptoToCryptoExchangeLabel}] Cryptocurrency to cryptocurrency exchange`,
          `[${otherLabel}] Other: ${d.otherDetails}`,
        ],
      },
      {
        fontSize: commonFontSize,
        margin: [ 20, 10, 0, 0 ],
        text: [
          '4.3 Kindly provide a copy of the latest audited financial statements (not older than 2 years).\n',
          'If this is not available, please provide a copy of the management accounts.',
        ],
        bold: true,
      },
    ];
  }

  private getParagraph5() {
    const d = this.dto.representativeData;

    const yes = d.politicallyExposed === 'yes';
    const yesLabel = yes ? 'X' : '   ';
    const noLabel = yes ? '   ' : 'X';

    const politicallyExposedName = yes ? d.politicallyExposedName : '';
    const politicallyExposedPosition = yes ? d.politicallyExposedPosition : '';
    const politicallyExposedRelation = yes ? d.politicallyExposedRelation : '';

    return [
      this.kycPdfCreator.paragraphLabel('5. Personal data of the representative'),
      {
        layout: 'lightLines',
        table: {
          widths: [ '*', '*' ],

          body: [
            [
              {
                fontSize: commonFontSize,
                text: `5.1 First name: ${d.firstName}`,
              },
              {
                fontSize: commonFontSize,
                text: `5.2 Last name: ${d.lastName}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `5.3 Date of birth (dd.mm.yyyy): ${this.kycPdfCreator.getDateView(new Date(d.dateOfBirth))}`,
              },
              {
                fontSize: commonFontSize,
                text: `5.4 Place of birth (country): ${this.kycPdfCreator.getCountry(d.country)}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `5.5 Personal code (if any): ${d.personalCode}`,
              },
              {
                fontSize: commonFontSize,
                text: `5.6 Country of residence: ${this.kycPdfCreator.getCountry(d.countryOfResidence)}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                colSpan: 2,
                text: [
                  '5.7 Address of residence (street, building-apartment,',
                  'zip code, city, country)\n(',
                  {
                    decoration: 'underline',
                    text: 'not mandatory',
                  },
                  `): ${d.addressOfResidence}`,
                ],
              }, {},
            ],
            [
              {
                fontSize: commonFontSize,
                colSpan: 2,
                text: `5.8 Type of ID: ${d.idType}`,
              }, {},
            ],
            [
              {
                fontSize: commonFontSize,
                colSpan: 2,
                text: `5.9 ID number: ${d.idNumber}`,
              }, {},
            ],

            [
              {
                fontSize: commonFontSize,
                text: `5.10 The issuing country: ${this.kycPdfCreator.getCountry(d.issuingCountry)}`,
              },
              {
                fontSize: commonFontSize,
                rowSpan: 2,
                text: `5.12 Expiration date: ${this.kycPdfCreator.getDateView(new Date(d.expirationDate))}`,
              },
            ],
            [
              {
                fontSize: commonFontSize,
                text: `5.11 Date of issue: ${this.kycPdfCreator.getDateView(new Date(d.issueDate))}`,
              }, {},
            ],
            [
              {
                fontSize: commonFontSize,
                colSpan: 2,
                text: `5.13 Position within the Company: ${d.position}`,
              }, {},
            ],
            [
              {
                fontSize: commonFontSize,
                text: `5.14 Contact phone: ${d.contactPhone}`,
              },
              {
                fontSize: commonFontSize,
                text: `5.15 E-mail: ${d.representativeEmail}`,
              },
            ],
            [
              {
                colSpan: 2,
                fontSize: commonFontSize,
                text: [
                  {
                    bold: true,
                    text: 'To establish the identity of a representative of a legal entity, ',
                  },
                  'kindly provide one of the following valid, certified and unexpired documents:\n',
                  '- Identity card for EU citizens;\n',
                  '- Residence card for EU citizens;\n',
                  '- Passport (if the individual has dual or multiple citizenships, a copy of all the passports in the ',
                  'individual’s possession); or\n',
                  '- Driver’s licence.',
                ],
              },
            ],
            [
              {
                colSpan: 2,
                fontSize: commonFontSize,
                text: [
                  'A politically exposed person (PEP) means a natural person who is or who has been entrusted with\n' +
                  'prominent public functions including:\n' +
                  '- a head of State; head of government; minister and deputy or assistant minister; a member of parliament\n' +
                  'or of a similar legislative bodies; a member of the governing body of political party, a member of a\n' +
                  'supreme court, a member of a constitutional court or of other high-level judicial bodies the decisions of\n' +
                  'which are not subject to further appeal except in exceptional circumstances; a member of a court of\n' +
                  'auditors or of the board of a central bank; an ambassador, a chargé d\'affaires and a high-ranking officer\n' +
                  'in the armed forces; a member of an administrative, management or supervisory body of a State-owned\n' +
                  'enterprise; and a director, deputy director and member of the board or equivalent function of an\n' +
                  'international organisation, except middle-ranking or more junior officials.\n' +
                  '- ‘family members’ such as: the spouse, or a person considered to be equivalent to a spouse, of a PEP;\n' +
                  'and the children and their spouses, or persons considered to be equivalent to a spouse, of a PEP; the\n' +
                  'parents of a PEP.\n' +
                  '- ‘persons known to be close associates’ such as: natural persons who are known to have joint beneficial\n' +
                  'ownership of legal entities or legal arrangements, or any other close business relations, with a PEP; and\n' +
                  'natural persons who have sole beneficial ownership of a legal entity or legal arrangement which is\n' +
                  'known to have been set up for the de facto benefit of a PEP.',
                ],
              },
            ],
            [
              {
                colSpan: 2,
                fontSize: commonFontSize,
                text: [
                  '5.17 Is the representative of the legal entity a PEP or its family member or a close associate? Kindly tick ',
                  'the box:\n',
                  `Yes  [${yesLabel}]\n`,
                  `No   [${noLabel}]`,
                ],
              },
            ],
            [
              {
                colSpan: 2,
                fontSize: commonFontSize,
                text: [
                  {
                    color: 'red',
                    text: 'If the answer in 5.17 is "Yes", kindly complete 5.18; 5.19; 5.20\n',
                  },
                  `5.18 Name and surname of the official: ${politicallyExposedName}\n`,
                  `5.19 Position: ${politicallyExposedPosition}\n`,
                  '5.20  Contact with the client (1- I am a PEP, 2- Family member of a PEP, 3- Person known to be a close ',
                  `associate of a PEP):\n${politicallyExposedRelation}`,
                ],
              },
            ],
          ],
        },
      },

      this.kycPdfCreator.lineBreak(),

      {
        layout: 'lightLines',
        table: {
          widths: [ '*' ],
          body: [
            [
              {
                fontSize: commonFontSize,
                text: [
                  'Certification of documents is required as independent confirmation of authentication. Documents need ',
                  'to be certified by a notary and such certification should be evidenced by writing:\n',
                  '- the document is a true copy of the original document;\n',
                  '- the document has been seen and verified by the certifier; and\n',
                  '- the photo is true likeness of the applicant.\n',
                  'The certifier must also sign and date the document indicating his/her: name and surname; contact ',
                  'details; and profession, designation or capacity.\n',
                  'Additionally, any documentation which is not in English or Estonian, should be translated in English.\n',
                  'Translation should be dated, signed and certified by an independent person of proven competence ',
                  'confirming that it is a faithful translation of the original. If obtained from overseas the document must be ',
                  'apostilled',
                ],
              },
            ],
          ],
        },
      },
    ];
  }

  private getParagraph6() {
    const persons = this.dto.managementPersonalData.persons;
    const items = persons.map((el, index) => this.getPerson6(index + 1, el));

    return [
      this.kycPdfCreator.paragraphLabel('6. Personal data of the directors/members of the management board if applicable'),

      ...items,

      this.kycPdfCreator.lineBreak(),

      {
        layout: 'lightLines',
        table: {
          widths: [ '*' ],
          body: [
            [
              {
                fontSize: commonFontSize,
                text: [
                  {
                    bold: true,
                    text: 'To establish and verify the identity of directors/members of the management board or CEO, ',
                  },
                  'kindly provide one of the following valid, certified and unexpired documents:\n',
                  '- Identity card for EU citizens;\n',
                  '- Residence card for EU citizens;\n',
                  '- Passport (if the individual has dual or multiple citizenships, a copy of all the passports in the ',
                  'individual’s possession); or\n',
                  '- Driver’s licence.',
                ],
              },
            ],
          ],
        },
      },
    ];
  }

  private getParagraph7() {
    const persons = this.dto.beneficiariesData.persons;
    const items = persons.map((el, index) => this.getPerson7(index + 1, el));

    return [
      this.kycPdfCreator.paragraphLabel('7. Personal data of Beneficial Owners'),

      this.kycPdfCreator.emptyTable(
        'A beneficial owner means any natural person(s) who ultimately owns or controls a legal person ' +
        'and/or the natural person(s) on whose behalf a transaction or activity is being conducted and includes ' +
        'at least direct or indirect ownership of a sufficient percentage (a shareholding of 25% plus one share ' +
        'or an ownership interest of more than 25%), including through bearer shareholdings, or through ' +
        'control via other means.',
      ),

      ...items,

      this.kycPdfCreator.lineBreak(),

      {
        layout: 'lightLines',
        table: {
          widths: [ '*' ],
          body: [
            [
              {
                fontSize: commonFontSize,
                text: [
                  {
                    bold: true,
                    text: 'To establish and verify the identity of the UBOs, ',
                  },
                  'kindly provide one of the following valid, certified, and unexpired documents:\n',
                  '- Identity card for EU citizens;\n',
                  '- Residence card for EU citizens;\n',
                  '- Passport (if the individual has dual or multiple citizenships, a copy of all the passports in the',
                  'individual’s possession); or\n',
                  '- Driver’s licence.',
                ],
              },
            ],
          ],
        },
      },
    ];
  }

  private getParagraph8() {
    const partners = this.dto.mainPartners.partners;
    const items = partners.map((el, index) => this.getPartner8(index + 1, el));

    return [
      this.kycPdfCreator.paragraphLabel('8. The main partners of the company'),
      ...items,
    ];
  }

  private getParagraph9() {
    const d = this.dto.otherInfo;

    return [
      this.kycPdfCreator.paragraphLabel('9. Does the company conduct any activity with other countries (international activity)?'),
      this.yesNoTable(this.dto.otherInfo.internationalActivity === 'yes'),

      {
        layout: 'lightLines',
        table: {
          widths: [ '*' ],
          body: [
            [
              {
                fontSize: commonFontSize,
                text: [
                  {
                    color: 'red',
                    text: 'If the answer to the above is “Yes” kindly complete the following:\n',
                  },
                  `List of countries that the company intends to conduct activity with:\n${d.descriptionInternationalActivity}`,
                ],
              },
            ],
          ],
        },
      },
    ];
  }

  private getParagraph10() {
    const d = this.dto.otherInfo;

    return [
      this.kycPdfCreator.paragraphLabel('10. Does the company work with offshore companies / banks?'),
      this.yesNoTable(this.dto.otherInfo.workOffshore === 'yes'),

      {
        layout: 'lightLines',
        table: {
          widths: [ '*' ],
          body: [
            [
              {
                fontSize: commonFontSize,
                text: [
                  {
                    color: 'red',
                    text: 'If the answer to the above is “Yes” kindly complete the following:\n',
                  },
                  `List of offshore companies / banks that the company works with:\n${d.descriptionWorkOffshore}`,
                ],
              },
            ],
          ],
        },
      },
    ];
  }

  private getParagraph11() {
    return [
      this.kycPdfCreator.paragraphLabel('11. List the main source of the legal entity\'s funds (income)'),
      this.kycPdfCreator.emptyTable(this.dto.otherInfo.incomeSource),
    ];
  }

  private getParagraph12() {
    return [
      this.kycPdfCreator.paragraphLabel('12. List the basic payments of the legal entity (costs)'),
      this.kycPdfCreator.emptyTable(this.dto.otherInfo.costs),
    ];
  }

  private getParagraph13() {
    return [
      this.kycPdfCreator.paragraphLabel('13. Additional information and notes'),
      this.kycPdfCreator.emptyTable(this.dto.otherInfo.additionalInfo || ''),
    ];
  }

  private getParagraph14() {
    const d = this.dto.otherInfo;

    const yes = d.controlStructure === 'yes';
    const yesLabel = yes ? 'X' : '   ';
    const noLabel = yes ? '   ' : 'X';

    return [
      this.kycPdfCreator.paragraphLabel('14. Bearer Share Declaration'),

      {
        layout: 'lightLines',
        table: {
          widths: [ '*' ],
          body: [
            [
              {
                fontSize: commonFontSize,
                text: [
                  'Has the legal entity or any entity within the control structure issued bearer shares?\n',
                  `Yes  [${yesLabel}]\n`,
                  `No   [${noLabel}]\n`,
                  {
                    color: 'red',
                    text: 'If the answer to the above is “Yes” kindly provide further information:\n',
                  },
                  `${d.descriptionControlStructure}`,
                ],
              },
            ],
          ],
        },
      },
    ];
  }

  private getParagraph15() {
    return [
      this.kycPdfCreator.paragraphLabel('15 Customer Representative'),
      {
        layout: 'lightLines',
        table: {
          widths: [ '*' ],
          body: [
            [
              {
                fontSize: commonFontSize,
                text: [
                  '15.1 First name:\n',
                  '15.2 Last name:\n',
                  '15.3 Signature:\n',
                  '15.4 Date of completion (dd.mm.yyyy):',
                ],
              },
            ],
          ],
        },
      },
    ];
  }

  private getParagraph16() {
    return [
      this.kycPdfCreator.paragraphLabel('16 Company representative for BaGuk Finance OÜ'),
      {
        layout: 'lightLines',
        table: {
          widths: [ '*' ],
          body: [
            [
              {
                fontSize: commonFontSize,
                text: [
                  '16.1 First name:\n',
                  '16.2 Last name:\n',
                  '16.3 Signature:',
                ],
              },
            ],
          ],
        },
      },
    ];
  }

  getDocDefinition() {
    return {
      content: [
        this.kycPdfCreator.getMainLabel('Questionnaire for a legal entity'),

        this.getParagraph1(),
        this.getParagraph2(),
        this.getParagraph3(),
        this.getParagraph4(),
        this.getParagraph5(),
        this.getParagraph6(),
        this.getParagraph7(),
        this.getParagraph8(),
        this.getParagraph9(),
        this.getParagraph10(),
        this.getParagraph11(),
        this.getParagraph12(),
        this.getParagraph13(),
        this.getParagraph14(),
        this.kycPdfCreator.getInfo(),
        this.getParagraph15(),
        this.getParagraph16(),

        this.kycPdfCreator.getAccountInfo(this.email, this.accountId),
      ],

      footer: this.kycPdfCreator.getFooter(),
      header: this.kycPdfCreator.getHeader(),
    };
  }

  constructor(
    private readonly dto: InKycLegalCreateDTO,
    private readonly email: string,
    private readonly accountId: number,
  ) { }
}