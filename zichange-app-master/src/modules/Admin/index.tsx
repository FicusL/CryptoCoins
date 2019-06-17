import './index.scss';
import * as React from 'react';
import AdminRouting from './AdminRouting';
import Layout from './modules/Layout';
import { lazyInject } from '../IoC';
import { observer } from 'mobx-react';
import { LoaderStore } from '../Shared/modules/Loader/store/LoaderStore';
import { RouteComponentProps, withRouter } from 'react-router';

@observer
class AdminModule extends React.Component<RouteComponentProps> {
  static readonly STYLES_LOADING_TASK = 'STYLES_LOADING_TASK';
  static readonly antdStyleId = 'antd';

  @lazyInject(LoaderStore)
  readonly LoaderStore: LoaderStore;

  componentWillMount() {
    const link = document.createElement('link');
    link.id = AdminModule.antdStyleId;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/antd/3.10.9/antd.min.css';

    this.LoaderStore.addTask(AdminModule.STYLES_LOADING_TASK);
    link.onload = () => this.LoaderStore.removeTask(AdminModule.STYLES_LOADING_TASK);

    document.head.appendChild(link);
  }

  componentWillUnmount() {
    // Unload antd styles because of conflicts with dashboard design
    const antdStyleLink = document.getElementById(AdminModule.antdStyleId);
    antdStyleLink.parentNode.removeChild(antdStyleLink);
  }

  render() {
    if (this.LoaderStore.hasTask(AdminModule.STYLES_LOADING_TASK)) {
      return null;
    }

    return (
      <Layout>
        <AdminRouting />
      </Layout>
    );
  }
}
export default withRouter(AdminModule) as React.ComponentClass<{}>;