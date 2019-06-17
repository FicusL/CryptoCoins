import { HttpService, Injectable, InternalServerErrorException, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigsService } from '../../../core/service/configs.service';
import * as FormData from 'form-data';
import { ISumsubAddingDocumentMetadata } from '../types/adding-document/sumsub.adding-document-metadata.interface';
import { SumsubConvertAddingDocumentMetadataToRequest } from '../utils/sumsub.convert-utils';
import { ISumsubCreateApplicantBody } from '../types/create-applicant/sumsub.create-applicant-body.interface';
import { InSumsubCreateApplicantDTO } from '../dto/in.sumsub.create-applicant.dto';
import { InSumsubGettingApplicantStatusDTO } from '../dto/in.sumsub.getting-applicant-status.dto';
import { InSumsubAddingDocumentDTO } from '../dto/in.sumsub.adding-document.dto';
import { SumsubApiBaseService } from './sumsub-api.base.service';
import { InSumsubGetApplicantDataDTO } from '../dto/in.sumsub.get-applicant-data.dto';
import { ISumsubCreateApplicantInfo } from '../types/create-applicant/sumsub.create-applicant-info.interface';
import { IFileElement } from '../../../core/abstract/file.element.interface';
import { FileUtils } from '../../../core/util/file-utils';
import { ISumsubCreateApplicantRequiredDocs } from '../types/create-applicant/sumsub-create-applicant-required-docs.interface';

// TODO: validate DTO from sumsub

@Injectable()
export class SumsubApiService extends SumsubApiBaseService implements OnApplicationBootstrap {
  protected token: string = '';

  constructor(
    protected readonly httpService: HttpService,
  ) {
    super();
  }

  onApplicationBootstrap() {
    this.updateToken();
  }

  // region Public methods

  async createApplicant(params: ISumsubCreateApplicantBody): Promise<InSumsubCreateApplicantDTO> {
    return await this.wrapper(this._createApplicant.bind(this), params);
  }

  async changeApplicantData(applicantId: string, info: ISumsubCreateApplicantInfo, oldInfo: ISumsubCreateApplicantInfo | undefined): Promise<void> {
    return await this.wrapper(this._changeApplicantData.bind(this), applicantId, info, oldInfo);
  }

  async changeRequiredDocumentSet(applicantId: string, docSet: ISumsubCreateApplicantRequiredDocs): Promise<ISumsubCreateApplicantRequiredDocs> {
    return await this.wrapper(this._changeRequiredDocumentSet.bind(this), applicantId, docSet);
  }

  async addDocument(applicantId: string, metadata: ISumsubAddingDocumentMetadata, content: Buffer, fileExtension: string)
    : Promise<InSumsubAddingDocumentDTO> {
    return await this.wrapper(this._addDocument.bind(this), applicantId, metadata, content, fileExtension);
  }

  async getApplicantStatus(applicantId: string): Promise<InSumsubGettingApplicantStatusDTO> {
    return await this.wrapper(this._getApplicantStatus.bind(this), applicantId);
  }

  async getApplicantData(applicantId: string): Promise<InSumsubGetApplicantDataDTO> {
    return await this.wrapper(this._getApplicantData.bind(this), applicantId);
  }

  async getPhoto(inspectionId: string, imageId: number): Promise<IFileElement> {
    return await this.wrapper(this._getPhoto.bind(this), inspectionId, imageId);
  }

  // endregion

  // region Protected methods

  protected async wrapper(method: (...args: any[]) => Promise<any>, ...args: any[]) {
    try {
      return await method(...args);
    } catch (e) {
      Logger.error(e.message, undefined, SumsubApiService.name);
      Logger.error(JSON.stringify((e.response || {}).data), undefined, SumsubApiService.name);

      if (e.response.status === 401) {
        await this.updateToken();

        return await method(...args);
      }

      throw e;
    }
  }

  protected async updateToken() {
    try {
      this.token = await this.generateToken();

      Logger.log('SumSub token updated', SumsubApiService.name);
    } catch (e) {
      Logger.error(e.message, undefined, SumsubApiService.name);
    }
  }

  protected async generateToken(): Promise<string> {
    const url = `${ConfigsService.sumsubHost}/resources/auth/login`;

    const response = await this.httpService.post(url, {}, {
      auth: {
        username: ConfigsService.sumsubUsername,
        password: ConfigsService.sumsubPassword,
      },
    }).toPromise();

    if (response.data.status !== 'ok') {
      throw new InternalServerErrorException(JSON.stringify(response.data));
    }

    return response.data.payload;
  }

  protected async _createApplicant(params: ISumsubCreateApplicantBody): Promise<InSumsubCreateApplicantDTO> {
    const url = `${ConfigsService.sumsubHost}/resources/applicants`;

    const response = await this.httpService.post(url, params, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    }).toPromise();

    return response.data;
  }

  protected getDifferences(data: any, oldData: any): any {
    if (!oldData) {
      return data;
    }

    return Object.keys(data).reduce((accumulator, currentValue) => {
      const newValue = data[currentValue];
      const oldValue = oldData[currentValue];

      // stringify for array
      if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
        accumulator[currentValue] = data[currentValue];
      }

      return accumulator;
    }, {});
  }

  protected async _changeApplicantData(
    applicantId: string,
    info: ISumsubCreateApplicantInfo,
    oldInfo: ISumsubCreateApplicantInfo | undefined,
  ): Promise<void> {
    const url = `${ConfigsService.sumsubHost}/resources/applicants/${applicantId}/info`;
    const data = this.getDifferences(info, oldInfo);

    if (Object.keys(data || {}).length === 0) {
      return;
    }

    await this.httpService.patch(url, data, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    }).toPromise();
  }

  protected async _changeRequiredDocumentSet(applicantId: string, docSet: ISumsubCreateApplicantRequiredDocs)
    : Promise<ISumsubCreateApplicantRequiredDocs> {
    const url = `${ConfigsService.sumsubHost}/resources/applicants/${applicantId}/requiredIdDocs`;

    const response = await this.httpService.post(url, docSet, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    }).toPromise();

    return response.data;
  }

  protected async _addDocument(applicantId: string, metadata: ISumsubAddingDocumentMetadata, content: Buffer, fileExtension: string)
    : Promise<InSumsubAddingDocumentDTO> {
    const url = `${ConfigsService.sumsubHost}/resources/applicants/${applicantId}/info/idDoc`;

    const convertedMetadata = SumsubConvertAddingDocumentMetadataToRequest(metadata);

    const formData = new FormData();
    formData.append('metadata', JSON.stringify(convertedMetadata));
    formData.append('content',  content, {
      filename: `${applicantId}.${fileExtension}`,
    });

    const response = await this.httpService.post(url, formData, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        ...formData.getHeaders(),
      },
    }).toPromise();

    return response.data;
  }

  protected async _getApplicantStatus(applicantId: string): Promise<InSumsubGettingApplicantStatusDTO> {
    const url = `${ConfigsService.sumsubHost}/resources/applicants/${applicantId}/state`;

    const response = await this.httpService.get(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    }).toPromise();

    return response.data;
  }

  protected async _getApplicantData(applicantId: string): Promise<InSumsubGetApplicantDataDTO> {
    const url = `${ConfigsService.sumsubHost}/resources/applicants/${applicantId}`;

    const response = await this.httpService.get(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    }).toPromise();

    return response.data;
  }

  protected async _getPhoto(inspectionId: string, imageId: number): Promise<IFileElement> {
    const url = `${ConfigsService.sumsubHost}/resources/inspections/${inspectionId}/resources/${imageId}`;

    const response = await this.httpService.get(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      responseType: 'arraybuffer',
    }).toPromise();

    const contentType = response.headers['content-type'];
    const baseForName = `${inspectionId}.${imageId}`;

    return {
      buffer: Buffer.from(response.data),
      fieldname: baseForName,
      originalname: `${baseForName}.${FileUtils.getFileExtensionForMimetype(contentType)}`,
      mimetype: contentType,
    };
  }

  // endregion
}