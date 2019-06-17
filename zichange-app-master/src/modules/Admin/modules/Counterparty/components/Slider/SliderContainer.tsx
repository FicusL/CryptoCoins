import * as React from 'react';
import { Slider, InputNumber, Row, Col } from 'antd';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

interface IProps {
  callback: (size) => void;
  defaultSize: number;
}

@observer
class SliderContainer extends React.Component<IProps> {

  @observable inputValue: number = 0;

  componentWillMount(): void {
    this.inputValue = this.props.defaultSize;
  }

  onChange = (value) => {
    if (Number.isNaN(value)) {
      return;
    }

    this.inputValue = value;

    this.props.callback(this.inputValue);
  };

  render() {
    return(
      <Row>
        <Col span={4}>
          <p>borderSize: </p>
        </Col>

        <Col span={12}>
          <Slider
            min={0}
            max={10}
            onChange={this.onChange}
            value={typeof this.inputValue === 'number' ? this.inputValue : 0}
            step={0.01}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={0}
            max={10}
            style={{ marginLeft: 16 }}
            step={0.01}
            value={this.inputValue}
            onChange={this.onChange}
          />
        </Col>
      </Row>
    );
  }
}

export default SliderContainer;