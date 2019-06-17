import { IAccountSession } from '../abstract/account.session.interface';

export class OutAccountSessionDTO {
  accountId: number;
  isLoggedIn: boolean;
  isAuthorized: boolean;
  isActivated: boolean;

  isAdmin?: boolean;
  isTrader?: boolean;
  isAmlOfficer?: boolean;
  isPartner?: boolean;
  isCounterparty?: boolean;

  constructor(session: IAccountSession) {
    this.accountId = session.accountId || -1;
    this.isLoggedIn = Boolean(!!session.accountId && session.accountId !== -1);
    this.isAuthorized = Boolean(session.isAuthorized);
    this.isActivated = Boolean(session.isActivated);

    this.isAdmin = session.isAdmin ? session.isAdmin : undefined;
    this.isTrader = session.isTrader ? session.isTrader : undefined;
    this.isAmlOfficer = session.isAmlOfficer ? session.isAmlOfficer : undefined;
    this.isPartner = session.isPartner ? session.isPartner : undefined;
    this.isCounterparty = session.isCounterparty ? session.isCounterparty : undefined;
  }
}