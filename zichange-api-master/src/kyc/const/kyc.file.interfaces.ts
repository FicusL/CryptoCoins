import { IFileElement } from '../../core/abstract/file.element.interface';

export interface IKycFiles {
  identityDocument?: IFileElement[];
  selfie?: IFileElement[];
  identityDocumentBack?: IFileElement[];
}