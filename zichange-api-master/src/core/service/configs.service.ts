import { CaptchaSystem } from '../const/core.captcha.system.enum';

export class ConfigsService {
  // region Redis

  static get useRedis(): boolean {
    return process.env.USE_REDIS === 'true';
  }

  static get redisUrl(): string {
    return process.env.REDIS_URL || 'redis://0.0.0.0:6379';
  }

  // endregion

  // region Google Cloud Storage

  static get useGoogleCloudStorage(): boolean {
    return process.env.USE_GOOGLE_CLOUD_STORAGE === 'true';
  }

  static get googleCloudStorageBucket(): string {
    return process.env.GOOGLE_CLOUD_STORAGE_BUCKET || '';
  }

  static get googleCloudKeyFile(): string {
    return process.env.GOOGLE_CLOUD_KEY_FILE || '';
  }

  static get googleCloudDirectory(): string {
    return process.env.GOOGLE_CLOUD_DIRECTORY || '';
  }

  // endregion

  // region KYC

  static get kycDirectoryPath() {
    return process.env.KYC_DIRECTORY_PATH || '';
  }

  static get kycSecretPassword(): string {
    return process.env.KYC_SECRET_PASSWORD || '';
  }

  static get emailForNotifyAboutKyc(): string {
    return process.env.EMAIL_FOR_NOTIFY_ABOUT_KYC || '';
  }

  // endregion

  // region Crypto wallet generator

  static get generateZcnWalletsUrl(): string {
    return process.env.GENERATE_ZCN_WALLETS_URL || '';
  }

  static get bitgoAccessToken(): string {
    return process.env.BITGO_ACCESS_TOKEN || '';
  }

  static get bitgoBtcWalletId(): string {
    return process.env.BITGO_BTC_WALLET_ID || '';
  }

  static get bitgoEthWalletId(): string {
    return process.env.BITGO_ETH_WALLET_ID || '';
  }

  static get bitgoLtcWalletId(): string {
    return process.env.BITGO_LTC_WALLET_ID || '';
  }

  static get bitgoXrpWalletId(): string {
    return process.env.BITGO_XRP_WALLET_ID || '';
  }

  static get bitgoBchWalletId(): string {
    return process.env.BITGO_BCH_WALLET_ID || '';
  }

  static get bitgoXlmWalletId(): string {
    return process.env.BITGO_XLM_WALLET_ID || '';
  }

  static get bitgoDashWalletId(): string {
    return process.env.BITGO_DASH_WALLET_ID || '';
  }

  static get bitgoZecWalletId(): string {
    return process.env.BITGO_ZEC_WALLET_ID || '';
  }

  static get bitgoBsvWalletId(): string {
    return process.env.BITGO_BSV_WALLET_ID || '';
  }

  static get bitgoBtgWalletId(): string {
    return process.env.BITGO_BTG_WALLET_ID || '';
  }

  // endregion

  // region SumSub

  static get sumsubHost(): string {
    return process.env.SUMSUB_HOST || '';
  }

  static get sumsubUsername(): string {
    return process.env.SUMSUB_USERNAME || '';
  }

  static get sumsubPassword(): string {
    return process.env.SUMSUB_PASSWORD || '';
  }

  static get mockSumSub(): boolean {
    return process.env.MOCK_SUMSUB === 'true';
  }

  // endregion

  // region Payeer

  static get payeerSecretKey(): string {
    return process.env.PAYEER_SECRET_KEY || '';
  }

  static get payeerMShop(): string {
    return process.env.PAYEER_M_SHOP || '';
  }

  // endregion

  // region RoyalPay

  static get royalPaySecretKey(): string {
    return process.env.ROYAL_PAY_SECRET_KEY || '';
  }

  static get royalPayAuthToken(): string {
    return process.env.ROYAL_PAY_AUTH_TOKEN || '';
  }

  static get royalPayTestMode(): boolean {
    return process.env.ROYAL_PAY_TEST_MODE === 'true';
  }

  // endregion

  // region Telegram

  static get telegramChatId(): string {
    return process.env.TELEGRAM_CHAT_ID || '';
  }

  static get telegramBotToken(): string {
    return process.env.TELEGRAM_BOT_TOKEN || '';
  }

  // endregion

  // region Advanced Cash

  static get advancedCashSecretKey(): string {
    return process.env.ADVANCED_CASH_SECRET_KEY || '';
  }

  static get advancedCashAcAccountEmail(): string {
    return process.env.ADVANCED_CASH_AC_ACCOUNT_EMAIL || '';
  }

  static get advancedCashAcSciName(): string {
    return process.env.ADVANCED_CASH_AC_SCI_NAME || '';
  }

  // endregion

  // region MailGun

  static get mailGunDefaultFrom(): string {
    return process.env.MAILGUN_DEFAULT_FROM || '';
  }

  static get mailGunDefaultSender(): string {
    return process.env.MAILGUN_DEFAULT_SENDER || '';
  }

  static get mailGunTestMode(): boolean {
    return process.env.MAILGUN_TEST_MODE === 'true';
  }

  static get mailGunApiKey(): string {
    return process.env.MAILGUN_API_KEY || '';
  }

  static get mailGunDomain(): string {
    return process.env.MAILGUN_DOMAIN || '';
  }

  // endregion

  // region Captcha

  static get geetestId(): string {
    return process.env.GEETEST_ID || '';
  }

  static get geetestKey(): string {
    return process.env.GEETEST_KEY || '';
  }

  static get captchaSystem(): CaptchaSystem {
    const captchaSystem = process.env.CAPTCHA_SYSTEM;

    if (captchaSystem === 'geetest') {
      return CaptchaSystem.GeeTest;
    }

    if (captchaSystem === 'recaptcha') {
      return CaptchaSystem.ReCaptcha;
    }

    return CaptchaSystem.ReCaptcha;
  }

  // endregion

  // region Other

  static get domainFrontEnd(): string {
    return process.env.DOMAIN_FRONTEND || '';
  }

  static get domainBackEnd(): string {
    return process.env.DOMAIN_BACKEND || '';
  }

  static get mockRates(): boolean {
    return process.env.MOCK_RATES === 'true';
  }

  static get isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  static get isMasterService(): boolean {
    return process.env.IS_MATER_SERVICE === 'true';
  }

  static get runSwagger(): boolean {
    return process.env.RUN_SWAGGER === 'true';
  }

  static get registerByInviteCodes(): boolean {
    return process.env.REGISTER_BY_INVITE_CODES === 'true';
  }

  static get noAmountLimitsAndFees(): boolean {
    return process.env.NO_AMOUNT_LIMITS_AND_FEES === 'true';
  }

  static get emailForNotifyAboutNewInformation(): string {
    return process.env.EMAIL_FOR_NOTIFY_ABOUT_NEW_INFORMATION || '';
  }

  // endregion
}