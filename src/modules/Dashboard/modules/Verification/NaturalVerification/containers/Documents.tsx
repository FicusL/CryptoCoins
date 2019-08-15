import React from 'react';
import FileInput from '../../../../../Shared/components/Inputs/FileInput';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../IoC';
import { DocumentsStore, KycDocumentType } from '../stores/parts/DocumentsStore';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { LocaleStore } from '../../../../../Shared/stores/LocaleStore';
import { Tier1Store } from '../stores/Tier1Store';
import SelectSearch from '../../../../../Shared/components/Inputs/SelectSearch';
import { ColorStore } from '../../../../../Admin/modules/Counterparty/stores/Colors/ColorStore';
import { CounterpartyAccountStore } from '../../../../../Counterparty/stores/CounterpartyAccountStore';
import { KycDataStore } from '../stores/KycDataStore';
import CheckBox from '../../../../../Shared/components/Inputs/Checkbox/Checkbox';
import { observable } from 'mobx';

@observer
class Documents extends React.Component<InjectedIntlProps> {
  static readonly MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

  @lazyInject(DocumentsStore)
  readonly store: DocumentsStore;

  @lazyInject(KycDataStore)
  kycDataStore: KycDataStore;

  @lazyInject(ColorStore)
  color: ColorStore;

  @lazyInject(CounterpartyAccountStore)
  counterpartyAccountStore: CounterpartyAccountStore;

  @lazyInject(Tier1Store)
  tier1Store: Tier1Store;

  @lazyInject(LocaleStore)
  readonly localeStore: LocaleStore;

  @observable isDoubleSideDocument: boolean = false;

  componentWillMount(): void {
    this.store.loadLocalStorage();
  }

  handleChange = ({ name, value }) => {
    this.store.change(name, value);
    window.localStorage.setItem(name, value);
  };

  render() {

    const { intl } = this.props;
    const documentTypes = [
      {value: KycDocumentType.PASSPORT, label: intl.formatMessage({
          id: 'dashboard.kyc.tier1.documents.type.passport',
          defaultMessage: 'Passport',
        })},
      {value: KycDocumentType.DRIVERS, label: intl.formatMessage({
          id: 'dashboard.kyc.tier1.documents.type.drivers',
          defaultMessage: 'Driver’s License',
        })},
      {value: KycDocumentType.ID_CARD, label: intl.formatMessage({
          id: 'dashboard.kyc.tier1.documents.type.idCard',
          defaultMessage: 'ID Card',
        })},
      {value: KycDocumentType.RESIDENCE_PERMIT, label: intl.formatMessage({
          id: 'dashboard.kyc.tier1.documents.type.residencePermit',
          defaultMessage: 'Residence permit',
        })},
    ];

    const getDocumentType = (name) => documentTypes.find(doc => doc.value === name);
    const lastSentDocumentsInfo = this.kycDataStore.lastSentDocumentsInfo || {};

    // const lastSentDocumentsInfo = {
    //   'lastSentDocumentType': 'ID_CARD',
    //   'inspectionId': 'string',
    //   'documentIsDoubleSided': false,
    //   'selfie': {
    //     'mustSend': true,
    //     'imageId': 0,
    //     'reviewAnswer': 'GREEN',
    //     'moderationComment': 'string',
    //     'clientComment': 'string',
    //     'idDocSubType': 'string',
    //   },
    //   'documentFront': {
    //     'mustSend': false,
    //     'imageId': 0,
    //     'reviewAnswer': 'GREEN',
    //     'moderationComment': 'string',
    //     'clientComment': 'string',
    //     'idDocSubType': 'string',
    //   },
    //   'documentBack': {
    //     'mustSend': false,
    //     'imageId': 0,
    //     'reviewAnswer': 'RED',
    //     'moderationComment': 'hyi sosi',
    //     'clientComment': 'string',
    //     'idDocSubType': 'string',
    //   },
    // };

    return (
      <div className='container tier1__form-section'>
        <p className='header_description mb-3 ml-2'>
          {
            intl.formatMessage({
              id: 'dashboard.kyc.tier1.documents.identityDocumentTitle',
              defaultMessage: 'Please provide photos/scans according to the type of documents you choose in the ' +
                'first step. All three fields are required.',
            })
          }
        </p>
        <SelectSearch
          name='documentType'
          label={intl.formatMessage({
            id: 'dashboard.kyc.tier1.documents.documentTypeLabel',
            defaultMessage: 'Document type',
          })}
          value={getDocumentType(this.store.values.documentType)}
          options={documentTypes}
          placeholder={intl.formatMessage({
            id: 'dashboard.kyc.tier1.documents.documentTypePlaceholder',
            defaultMessage: 'Select your document type',
          })}
          onChange={this.handleChange}
          showError={!!this.store.errors.documentType}
          errorMessage={this.store.errors.documentType && intl.formatMessage({
            id: this.store.errors.documentType,
            defaultMessage: 'Field is required',
          })}
          colors={this.counterpartyAccountStore.isAgent && this.color.styles.selectSearch}
        />
        {this.store.values.documentType !== lastSentDocumentsInfo.lastSentDocumentType ||
          lastSentDocumentsInfo.documentFront.mustSend ?
          <FileInput
            name='identityDocument'
            value={this.store.values.identityDocument}
            label={
              intl.formatMessage({
                id: 'dashboard.kyc.tier1.documents.identityDocumentFrontLabel',
                defaultMessage: 'Identity Document (Passport, Driver License etc.)',
              })
            }
            placeholder={
              intl.formatMessage({
                id: 'dashboard.kyc.tier1.documents.identityDocumentPlaceholder',
                defaultMessage: 'Allowed format JPG, PNG, or PDF (25MB max)',
              })
            }
            maxSize={Documents.MAX_FILE_SIZE_BYTES}
            onChange={this.handleChange}
            errorMessage={this.store.errors.identityDocument && intl.formatMessage({
              id: this.store.errors.identityDocument,
              defaultMessage: 'Field is required',
            })}
            sumsubErrorMessage={
              this.store.values.documentType === lastSentDocumentsInfo.lastSentDocumentType
              && lastSentDocumentsInfo.documentFront.mustSend &&
              lastSentDocumentsInfo.documentFront.moderationComment
            }
            colors={this.counterpartyAccountStore.isAgent && this.color.styles.body}
            disabled={this.store.values.documentType === lastSentDocumentsInfo.lastSentDocumentType
            && !lastSentDocumentsInfo.documentFront.mustSend}

          /> : null
        }

        {this.store.values.documentType !== lastSentDocumentsInfo.lastSentDocumentType
          ? <CheckBox name='documentIsDoubleSided'
                      label={intl.formatMessage({
                        id: 'dashboard.kyc.tier1.documents.myDocumentIsDoubleSided',
                        defaultMessage: 'My document is double-sided',
                      })}
                      checked={this.store.values.documentIsDoubleSided}
                      onChange={this.handleChange}
                      className='mb-3'
                      colors={this.counterpartyAccountStore.isAgent && this.color.styles.checkBox}
          />
          : null
        }

        {(this.store.values.documentType !== lastSentDocumentsInfo.lastSentDocumentType &&
        this.store.values.documentIsDoubleSided) ||
        (this.store.values.documentType === lastSentDocumentsInfo.lastSentDocumentType &&
        lastSentDocumentsInfo.documentBack.mustSend) ?
          <FileInput
            name='identityDocumentBack'
            value={this.store.values.identityDocumentBack}
            label={
              intl.formatMessage({
                id: 'dashboard.kyc.tier1.documents.identityDocumentBackLabel',
                defaultMessage: 'Identity Document (Passport, Driver License etc.)',
              })
            }
            placeholder={
              intl.formatMessage({
                id: 'dashboard.kyc.tier1.documents.identityDocumentPlaceholder',
                defaultMessage: 'Allowed format JPG, PNG, or PDF (25MB max)',
              })
            }
            maxSize={Documents.MAX_FILE_SIZE_BYTES}
            onChange={this.handleChange}
            errorMessage={this.store.errors.identityDocumentBack && intl.formatMessage({
              id: this.store.errors.identityDocumentBack,
              defaultMessage: 'Field is required',
            })}
            sumsubErrorMessage={
              this.store.values.documentType === lastSentDocumentsInfo.lastSentDocumentType
              && lastSentDocumentsInfo.documentBack.mustSend &&
              lastSentDocumentsInfo.documentBack.moderationComment
            }
            colors={this.counterpartyAccountStore.isAgent && this.color.styles.body}
            disabled={this.store.values.documentType === lastSentDocumentsInfo.lastSentDocumentType
            && !lastSentDocumentsInfo.documentBack.mustSend}
          /> : null
        }
        {this.store.values.documentType !== lastSentDocumentsInfo.lastSentDocumentType ||
          lastSentDocumentsInfo.selfie.mustSend ?
          <FileInput
            name='selfie'
            value={this.store.values.selfie}
            label={
              intl.formatMessage({
                id: 'dashboard.kyc.tier1.documents.selfieLabel',
                defaultMessage: 'Selfie of You Holding Your ID',
              })
            }
            placeholder={
              intl.formatMessage({
                id: 'dashboard.kyc.tier1.documents.selfiePlaceholder',
                defaultMessage: 'Allowed format JPG, PNG, or PDF (25MB max)',
              })
            }
            maxSize={Documents.MAX_FILE_SIZE_BYTES}
            onChange={this.handleChange}
            errorMessage={this.store.errors.selfie && intl.formatMessage({
              id: this.store.errors.selfie,
              defaultMessage: 'Field is required',
            })}
            sumsubErrorMessage={
              this.store.values.documentType === lastSentDocumentsInfo.lastSentDocumentType
              && lastSentDocumentsInfo.selfie.mustSend &&
              lastSentDocumentsInfo.selfie.moderationComment
            }
            colors={this.counterpartyAccountStore.isAgent && this.color.styles.body}
            disabled={this.store.values.documentType === lastSentDocumentsInfo.lastSentDocumentType
            && !lastSentDocumentsInfo.selfie.mustSend}
          /> : null
        }
        <p className='header_description mb-3 ml-2 d-md-none'>
          {
            intl.formatMessage({
              id: 'dashboard.kyc.tier1.documents.selfiePlaceholder',
              defaultMessage: 'Allowed format JPG, PNG, or PDF (25MB max)',
            })
          }
        </p>
      </div>
    );
  }
}

export default injectIntl(Documents);
