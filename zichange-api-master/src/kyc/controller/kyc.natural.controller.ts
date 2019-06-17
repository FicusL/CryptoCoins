import { Body, Controller, FileFieldsInterceptor, Param, ParseIntPipe, Post, Session, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AccountType } from '../../account/const/account.type.enum';
import { KycExceptions } from '../const/kyc.exceptions';
import { IAccountSession } from '../../account/abstract/account.session.interface';
import { InKycNaturalCreateJsonDto } from '../dto/natural/parts/in.kyc.natural.create.json.dto';
import { AccountAccessGuard } from '../../core/guard/account.access.guard';
import { OutKycDto } from '../dto/out.kyc.dto';
import { IKycFiles } from '../const/kyc.file.interfaces';
import { AccountService } from '../../account/service/account.service';
import { AccountEntity } from '../../account/entitiy/account.entity';
import { KycCreateService } from '../service/kyc.create.service';

@Controller('account')
export class KycNaturalController {
  constructor(
    private readonly accountService: AccountService,
    private readonly kycCreateService: KycCreateService,
  ) { }

  async verifyAccountType(account: AccountEntity) {
    if (account.type !== AccountType.Natural) {
      throw new KycExceptions.AccountTypeNotMatchEndpoint();
    }
  }

  @Post(':accountId/kyc/natural')
  @ApiOperation({ title: 'Send KYC' })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'identityDocument', maxCount: 1 }, // front side
    { name: 'identityDocumentBack', maxCount: 1 }, // back side
    { name: 'selfie', maxCount: 1 },
  ]))
  async sendKYC(
    @Param('accountId', new ParseIntPipe()) accountId: number,
    @Session() session: IAccountSession,
    @Body() kycJSON: InKycNaturalCreateJsonDto,
    @UploadedFiles() files: IKycFiles,
  ): Promise<OutKycDto> {
    AccountAccessGuard.verifyAccess(accountId, session);

    const account = await this.accountService.getAccountById(accountId);
    await this.verifyAccountType(account);

    const dto = await InKycNaturalCreateJsonDto.parseDTO(kycJSON);

    const selfie = files.selfie ? files.selfie[0] : undefined;
    const documentFront = files.identityDocument ? files.identityDocument[0] : undefined;
    const documentBack = files.identityDocumentBack ? files.identityDocumentBack[0] : undefined;

    return await this.kycCreateService.createNatural(account, dto, { selfie, documentFront, documentBack });
  }
}