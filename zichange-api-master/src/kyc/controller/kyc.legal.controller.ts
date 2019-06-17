import { Body, Controller, FileFieldsInterceptor, Param, ParseIntPipe, Post, Session, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { AccountType } from '../../account/const/account.type.enum';
import { IAccountSession } from '../../account/abstract/account.session.interface';
import { AccountAccessGuard } from '../../core/guard/account.access.guard';
import { InKycLegalCreateJsonDTO } from '../dto/legal/in.kyc.legal.create.json.dto';
import { KycExceptions } from '../const/kyc.exceptions';
import { OutKycDto } from '../dto/out.kyc.dto';
import { AccountService } from '../../account/service/account.service';
import { KycCreateService } from '../service/kyc.create.service';
import { AccountEntity } from '../../account/entitiy/account.entity';

@Controller('account')
@ApiUseTags('Legal KYC')
export class KycLegalController {
  constructor(
    private readonly accountService: AccountService,
    private readonly kycCreateService: KycCreateService,
  ) { }

  async verifyAccountType(account: AccountEntity) {
    if (account.type !== AccountType.LegalEntity) {
      throw new KycExceptions.AccountTypeNotMatchEndpoint();
    }
  }

  @Post(':accountId/kyc/legal')
  @ApiOperation({ title: 'Send KYC' })
  @UseInterceptors(FileFieldsInterceptor([]))  // Hotfix for formdata
  async sendKYC(
    @Param('accountId', new ParseIntPipe()) accountId: number,
    @Session() session: IAccountSession,
    @Body() dtoJSON: InKycLegalCreateJsonDTO,
    @UploadedFiles() files: any, // Hotfix for formdata
  ): Promise<OutKycDto> {
    AccountAccessGuard.verifyAccess(accountId, session);

    const account = await this.accountService.getAccountById(accountId);
    await this.verifyAccountType(account);

    const dto = await InKycLegalCreateJsonDTO.parseDTO(dtoJSON);
    return await this.kycCreateService.createLegal(account, dto);
  }
}