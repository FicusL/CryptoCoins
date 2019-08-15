import * as React from 'react';
import Layout from '../../PolicyPages/Layout';
import Button from '../../Shared/components/Buttons/Button';
import { Link } from 'react-router-dom';
import { injectIntl, InjectedIntlProps } from 'react-intl';


class Referral extends React.Component<InjectedIntlProps> {

  render() {
    const { intl } = this.props;
    return (
      <Layout>
        <h1 className='policy-page__title'>
          {intl.formatMessage({
            id: 'referralProgram.title',
            defaultMessage: 'Referral Program',
          })}
        </h1>
        <p>
          {intl.formatMessage({
            id: 'referralProgram.intro',
            defaultMessage: 'Earn money with ZiChange, the reliable European crypto-fiat broker! Share an ' +
                'opportunity to purchase cryptocurrency using bank transfer or credit cards with your friends or ' +
                'followers on networks, blogs, and other websites. Invite new users to ZiChange and get rewards ' +
                'for every exchange transaction.',
          })}
        </p>

        <h3 className='policy-page__subtitle'>
          {intl.formatMessage({
            id: 'referralProgram.rewards.title',
            defaultMessage: 'Rewards',
          })}
        </h3>
        <p>
          {intl.formatMessage({
            id: 'referralProgram.rewards.description',
            defaultMessage: 'Receive 30% of exchange fees paid by your referrals, who convert cryptocurrency' +
                ' to Euro and US dollars and vice versa.',
          })}
        </p>

        <h3 className='policy-page__subtitle'>
          {intl.formatMessage({
            id: 'referralProgram.shareYourLink.title',
            defaultMessage: 'Share your link',
          })}
        </h3>
        <p>
          {intl.formatMessage({
            id: 'referralProgram.shareYourLink.description',
            defaultMessage: 'Introduce your friends and followers to ZiChange. Get rewards from every user, who' +
                ' registers an account using your referral link: https://zichange.io/?ch=xaxw',
          })}
          https://zichange.io/?ch=xaxw
        </p>

        <Link to='/register'>
          <Button name='fluid' className='mb-5 policy-page__register-btn'>
            {intl.formatMessage({
              id: 'authorization.signUp',
              defaultMessage: 'Register',
            })}
          </Button>
        </Link>

        <h1 className='policy-page__title'>
          {intl.formatMessage({
            id: 'referralProgram.termsAndConditions.title',
            defaultMessage: 'Referral Program Terms and Conditions',
          })}
        </h1>
        <p>
          {intl.formatMessage({
            id: 'referralProgram.termsAndCondition.intro',
            defaultMessage: 'By creating a ZiChange account to participate in the Referral Program, you (including ' +
                'those under your direction or control) confirm that you agree to these Referral Program Terms ' +
                'and Conditions.',
          })}

        </p>
        <ol className='policy-page__ordered-list'>
          <li>
            {intl.formatMessage({
              id: 'referralProgram.programTerms.part.1',
              defaultMessage: 'Terms and Conditions are effective as of 1 December 2018 12:00 UTC.',
            })}
          </li>
          <li>
            {intl.formatMessage({
              id: 'referralProgram.programTerms.part.2',
              defaultMessage: 'Rewards are paid for users, who visited ZiChange website by clicking your referral ' +
                  'link, registered as a ZiChange client, and make at least one cryptocurrency exchange transaction.',
            })}
          </li>
          <li>
            {intl.formatMessage({
              id: 'referralProgram.programTerms.part.3',
              defaultMessage: 'The reward equals 30% (thirty percent) of an exchange fee amount, which was paid ' +
                  'by your referral at the moment of transaction. The reward is not paid, when your referral ' +
                  'pays a deposit or withdrawal fee as well as fees of banks and payment service providers.',
            })}
          </li>
          <li>
            {intl.formatMessage({
              id: 'referralProgram.programTerms.part.4',
              defaultMessage: 'After visiting ZiChange website using the referral link, which was shared by you on ' +
                  'your website, in social media or other information channels, the user must register an account ' +
                  'within 30 days. Otherwise, the user will not be counted as your referral and you will not be ' +
                  'eligible for any rewards.',
            })}
          </li>
          <li>
            {intl.formatMessage({
              id: 'referralProgram.programTerms.part.5',
              defaultMessage: 'Rewards are paid only for successful exchange transactions, which occur in the first ' +
                  '12 months since the day of referral registration on ZiChange.',
            })}
          </li>
          <li>
            {intl.formatMessage({
              id: 'referralProgram.programTerms.part.6',
              defaultMessage: 'Rewards are paid in Euro and are credited to your ZiChange EUR wallet once a ' +
                  'transaction finishes successfully.',
            })}

          </li>
          <li>
            {intl.formatMessage({
              id: 'referralProgram.programTerms.part.7',
              defaultMessage: 'You acknowledge and agree that the website, blog, social media or other information ' +
                  'channels do not:',
            })}
            <ul className='policy-page__unordered-list'>
              <li>
                {intl.formatMessage({
                  id: 'referralProgram.programTerms.part.7.a',
                  defaultMessage: 'Contain false, inaccurate or misleading information about ZiChange products ' +
                      'and services;',
                })}
              </li>
              <li>
                {intl.formatMessage({
                  id: 'referralProgram.programTerms.part.7.b',
                  defaultMessage: 'In any way copy or resemble the look and feel of ZiChange’s website or website ' +
                      'content nor create the impression that the web-resource where you share referral link is' +
                      ' part of ZiChange’s network of websites;',
                })}
              </li>
              <li>
                {intl.formatMessage({
                  id: 'referralProgram.programTerms.part.7.c',
                  defaultMessage: 'Engage in sending the unsolicited commercial email (“spam”) or indiscriminate ' +
                      'advertising;',
                })}
              </li>
              <li>
                {intl.formatMessage({
                  id: 'referralProgram.programTerms.part.7.d',
                  defaultMessage: 'Violate any applicable law such as data transfer, data privacy, data security ' +
                      'laws or any securities laws such as offering or promoting ZiChange’s products and services ' +
                      'in any jurisdiction in which they would be illegal or publishing or causing to be published ' +
                      'any material that may be construed as an offer, solicitation, or recommendation to buy or ' +
                      'sell securities or other investment products, or as investment, legal, financial or ' +
                      'accounting advice;',
                })}
              </li>
              <li>
                {intl.formatMessage({
                  id: 'referralProgram.programTerms.part.7.e',
                  defaultMessage: 'Advocate, promote, or encourage violence or discrimination against any person, ' +
                      'organization, or governmental entity;',
                })}
              </li>
              <li>
                {intl.formatMessage({
                  id: 'referralProgram.programTerms.part.7.f',
                  defaultMessage: 'Contain links to websites containing any of the aforementioned content;',
                })}
              </li>
              <li>
                {intl.formatMessage({
                  id: 'referralProgram.programTerms.part.7.g',
                  defaultMessage: 'Cause any account linkage to be made that are not in good faith (such as using ' +
                      'any device, program, robot iframes, or hidden frames, use cookie stuffing techniques that' +
                      ' set the tracking cookie without the user actually clicking on the referral link, etc.);',
                })}
              </li>
              <li>
                {intl.formatMessage({
                  id: 'referralProgram.programTerms.part.7.h',
                  defaultMessage: 'State or imply that any of the information, content or data contained in your ' +
                      'website or  publishing location represents or reflects any views, advice or opinions of ' +
                      'ZiChange.',
                })}
              </li>
            </ul>
          </li>
          <li>
            {intl.formatMessage({
              id: 'referralProgram.programTerms.part.8',
              defaultMessage: 'You acknowledge and agree that you shall not:',
            })}
            <ul className='policy-page__unordered-list'>
              <li>
                {intl.formatMessage({
                  id: 'referralProgram.programTerms.part.8.a',
                  defaultMessage: 'Share your referral link through paid-to-click websites, paid-emails or other ' +
                      'platforms incentivizing users to click referral links;',
                })}
              </li>
              <li>
                {intl.formatMessage({
                  id: 'referralProgram.programTerms.part.8.b',
                  defaultMessage: 'Bid on terms in any search engine that mention ZiChange, ZiChange.io or any ' +
                      'of its derivatives and misspellings, BitMEX with keywords such as but not limited to ' +
                      '“ZiChange bonus”, “ZiChange promos”, “ZiChange promotions”;',
                })}
              </li>
              <li>
                {intl.formatMessage({
                  id: 'referralProgram.programTerms.part.8.c',
                  defaultMessage: 'Share your referral link on websites, which have the main purpose of publishing ' +
                      'special offers, bonuses, or referral links of third-party services and cryptocurrency faucets.',
                })}
              </li>
            </ul>
          </li>
          <li>
            {intl.formatMessage({
              id: 'referralProgram.programTerms.part.9',
              defaultMessage: 'You may only have one Account. If you (including those under your direction or ' +
                  'control) create multiple Accounts, you will not be entitled to further payment from ZiChange, ' +
                  'and your Accounts will be subject to termination.',
            })}
          </li>
          <li>
            {intl.formatMessage({
              id: 'referralProgram.programTerms.part.10',
              defaultMessage: 'You acknowledge and agree that ZiChange may terminate Services if you, your website, ' +
                  'social media or other information channels, where you share the referral link, violates, as ' +
                  'determined by ZiChange in its sole discretion, any of the aforementioned restrictions or ' +
                  'additional restrictions. ZiChange also reserves the right to seek recovery of any or all ' +
                  'Rewards paid or payable to you and you hereby agree to such liability and repayment of such ' +
                  'Rewards if you violate, as determined by ZiChange in its sole discretion, any of the ' +
                  'aforementioned restrictions or additional restrictions.',
            })}
          </li>
          <li>
            {intl.formatMessage({
              id: 'referralProgram.programTerms.part.11',
              defaultMessage: 'You acknowledge and agree that you have full responsibility for the security and ' +
                  'safety of your authentication data (login and password), which is used to access your account.',
            })}
          </li>
          <li>
            {intl.formatMessage({
              id: 'referralProgram.programTerms.part.12',
              defaultMessage: 'You agree that ZiChange can modify this Referral Program Terms and Conditions anytime ' +
                  'and you agree to be bound by any changes without notification. The latest version of the Referral' +
                  ' Program Terms and Conditions is published at this web-page.',
            })}
          </li>
        </ol>

      </Layout>
    );
  }
}

export default injectIntl(Referral);
