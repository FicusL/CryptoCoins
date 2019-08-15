import './style.scss';
import * as React from 'react';
import Reaptcha from 'reaptcha';
import _ from 'lodash';
import { IOnChangeProps } from '../../types/IChangeProps';
import classNames from 'classnames';
import { lazyInject } from '../../../IoC';
import { LoaderStore } from '../../modules/Loader/store/LoaderStore';

interface IProps {
  name?: string;
  onChange: (changeProps: IOnChangeProps) => void;
  showError?: boolean;
  resetByProps?: boolean;
  errorMessage?: string;
}

class ReCaptchaHidden extends React.Component<IProps> {
  private readonly RECAPTCHA_LOAD_TASK = 'RECAPTCHA_LOAD_TASK';

  @lazyInject(LoaderStore)
  uiStore: LoaderStore;

  instance = null;

  getInstance = e => {
    this.instance = e;
  };

  verifyCallback = (token: string) => {
    this.props.onChange({
      name: this.props.name || 'recaptcha',
      value: token,
    });
  };

  onLoad = () => {
    this.uiStore.removeTask(this.RECAPTCHA_LOAD_TASK);
  };

  componentWillMount() {
    this.uiStore.addTask(this.RECAPTCHA_LOAD_TASK);
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (!this.props.showError && nextProps.showError || this.props.resetByProps !== nextProps.resetByProps) {
      _.invoke(this, 'instance.reset');
    }
  }

  componentWillUnmount() {
    _.invoke(this, 'instance.reset');
  }

  render() {
    const { showError, errorMessage } = this.props;
    const cn = classNames('recaptcha-captcha-container form__field', {'form__show-error': showError});

    return (
      <div className={cn}>
        <span className='form__error-message'>{errorMessage}</span>
        <Reaptcha
          className='recaptcha'
          ref={this.getInstance}
          sitekey='6LdscmIUAAAAAMlXuU9Bi6nFxosRncSBefANSYLe'
          onVerify={this.verifyCallback}
          onLoad={this.onLoad}
        />
      </div>
    );
  }
}

// new
import axios from 'axios';
// @ts-ignore
import Geetest from 'react-geetest';

interface IGeeTestState {
  gt: string;
  challenge: string;
  new_captcha: boolean;
  success: number;
  fallback: boolean;

  loadedCaptcha: boolean;
}

class GeeTestContainer extends React.Component<IProps, IGeeTestState> {
  state: IGeeTestState = { loadedCaptcha: false } as any;

  private readonly GEETEST_CAPTCHA_LOAD_TASK = 'GEETEST_CAPTCHA_LOAD_TASK';

  @lazyInject(LoaderStore)
  uiStore: LoaderStore;

  onVerify = (data) => {
    this.props.onChange({
      name: this.props.name || 'geetest',
      value: JSON.stringify({ ...data, fallback: this.state.fallback }),
    });
  };

  onReady = () => {
    this.uiStore.removeTask(this.GEETEST_CAPTCHA_LOAD_TASK);
  };

  reset = async () => {
    this.setState({ loadedCaptcha: false });

    this.uiStore.addTask(this.GEETEST_CAPTCHA_LOAD_TASK);

    const url = `${window.location.origin}/api/captcha/geetest/init`; // TODO: use axios wrapper later
    const result = await axios.get(url);
    this.setState({ ...result.data, loadedCaptcha: true });
  };

  componentWillMount = async () => {
    if (this.props.resetByProps) {
      await this.reset();
    }
  };

  async componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.resetByProps) {
      await this.reset();
    }
  }

  public render() {
    if (!this.state.loadedCaptcha) {
      return (
        <div/>
      );
    }

    const { showError, errorMessage } = this.props;
    const cn = classNames('geetest_captcha-container form__field', {'form__show-error': showError});

    return (
      <div className={cn}>
        <span className='form__error-message'>{errorMessage}</span>
        <Geetest
          gt={this.state.gt}
          challenge={this.state.challenge}
          newCaptcha={this.state.new_captcha}
          offline={!this.state.success}
          product='popup'
          width='100%'
          lang='en'
          onSuccess={this.onVerify}
          onError={this.onVerify}
          onReady={this.onReady}
        />
      </div>
    );
  }
}

enum CaptchaSystem {
  ReCaptcha = 'ReCaptcha',
  GeeTest = 'GeeTest',
}

// TODO: rename later
export default class ReCaptcha extends React.Component<IProps> {
  private static captchaSystem: CaptchaSystem | undefined;

  private readonly CAPTCHA_LOAD_TASK = 'CAPTCHA_LOAD_TASK';

  @lazyInject(LoaderStore)
  uiStore: LoaderStore;

  async componentWillMount() {
    if (!ReCaptcha.captchaSystem) {
      this.uiStore.addTask(this.CAPTCHA_LOAD_TASK);

      const url = `${window.location.origin}/api/captcha/current_system`; // TODO: use axios wrapper later
      const result = await axios.get(url);
      ReCaptcha.captchaSystem = result.data.captchaSystem;

      this.uiStore.removeTask(this.CAPTCHA_LOAD_TASK);

      this.forceUpdate();
    }
  }

  render() {
    if (ReCaptcha.captchaSystem === CaptchaSystem.GeeTest) {
      return <GeeTestContainer {...this.props}/>;
    } else if (ReCaptcha.captchaSystem === CaptchaSystem.ReCaptcha) {
      return <ReCaptchaHidden {...this.props}/>;
    } else {
      return <div/>;
    }
  }
}