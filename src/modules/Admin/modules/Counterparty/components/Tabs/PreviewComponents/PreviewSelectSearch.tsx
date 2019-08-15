import * as React from 'react';
import SelectSearch from '../../../../../../Shared/components/Inputs/SelectSearch';
import { observer } from 'mobx-react';
import { lazyInject } from '../../../../../../IoC';
import { ColorStore } from '../../../stores/Colors/ColorStore';

@observer
class PreviewSelectSearch extends React.Component {

  @lazyInject(ColorStore)
  color: ColorStore;

  render() {

    const options = [{value: 'test1', label: 'test1'}, {value: 'test2', label: 'test2'}];

    return(
      <div className='row justify-content-center'>
        <SelectSearch
          style={{minWidth: '200px'}}
          name='country'
          label='Select your country'
          placeholder='Select your country'
          options={options}
          colors={this.color.styles.selectSearch}
        />
      </div>
    );
  }
}

export default PreviewSelectSearch;