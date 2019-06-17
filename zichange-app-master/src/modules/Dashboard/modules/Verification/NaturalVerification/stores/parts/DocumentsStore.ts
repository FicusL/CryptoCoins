import { ClassType } from 'class-transformer/ClassTransformer';
import { BaseFormStore, IValues } from '../../../../../../Shared/stores/Forms/BaseFormStore';
import { IsNotEmpty } from 'class-validator';
import ImageFile from 'react-dropzone';
import { action } from 'mobx';
import { inject } from 'inversify';
import { KycDataStore } from '../KycDataStore';

export enum KycDocumentType {
  ID_CARD = 'ID_CARD',
  PASSPORT = 'PASSPORT',
  DRIVERS = 'DRIVERS',
  RESIDENCE_PERMIT = 'RESIDENCE_PERMIT',
}

export class DocumentsValues implements IValues {
  // @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  identityDocument: ImageFile;

  // @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  identityDocumentBack: ImageFile;

  // @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  selfie: ImageFile;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  documentType: KycDocumentType;

  @IsNotEmpty({ message: 'dashboard.fieldIsRequired' })
  documentIsDoubleSided?: boolean;
}

export class DocumentsStore extends BaseFormStore<DocumentsValues> {
  get type(): ClassType<DocumentsValues> {
    return DocumentsValues;
  }

  @inject(KycDataStore)
  kycDataStore: KycDataStore;

  @action
  async validate(): Promise<boolean> {
    let result = true;

    try {
      result = await super.validate();
    } catch (e) {
      console.log(e);
    }

    const info = this.kycDataStore.lastSentDocumentsInfo;

    if (info && info.lastSentDocumentType === this.values.documentType) {
      if (info.selfie.mustSend && !this.values.selfie) {
        this.errors.selfie = 'dashboard.fieldIsRequired';
        result = false;
      }

      if (info.documentFront.mustSend && !this.values.identityDocument) {
        this.errors.identityDocument = 'dashboard.fieldIsRequired';
        result = false;
      }

      if (info.documentBack.mustSend && !this.values.identityDocumentBack) {
        this.errors.identityDocumentBack = 'dashboard.fieldIsRequired';
        result = false;
      }
    } else {
      if (!this.values.selfie) {
        this.errors.selfie = 'dashboard.fieldIsRequired';
        result = false;
      }

      if (!this.values.identityDocument) {
        this.errors.identityDocument = 'dashboard.fieldIsRequired';
        result = false;
      }

      if (this.values.documentIsDoubleSided && !this.values.identityDocumentBack) {
        this.errors.identityDocumentBack = 'dashboard.fieldIsRequired';
        result = false;
      }
    }

    return result;
  }

  @action
  loadLocalStorage() {
    const getCacheItem = (name: string) => window.localStorage.getItem(name);
    const kycData = () => (this.kycDataStore.kycData.documents || {});

    this.values.documentType = KycDocumentType[getCacheItem('documentType')] || kycData['documentType'] || null;
    this.values.documentIsDoubleSided  = getCacheItem('documentIsDoubleSided') === 'true';
  }
}