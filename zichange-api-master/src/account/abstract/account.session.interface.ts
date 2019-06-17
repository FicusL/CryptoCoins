export interface IAccountSession {
  accountId: number;
  isAuthorized: boolean;
  isActivated: boolean;
  isAdmin: boolean;
  isTrader: boolean;
  isAmlOfficer: boolean;
  isPartner: boolean;
  isCounterparty: boolean;

  destroy(): void;
}