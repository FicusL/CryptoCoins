import * as React from 'react';
import { Breadcrumb, Icon } from 'antd';
import './Bread.scss';

interface IBreadProps {
    menuItems: any;
    routes: any[];
}

class Bread extends React.Component<IBreadProps> {
    getPathName = (path: string, items: any, res: any) => {
        items.map((ele: any) => {
            if (ele.key === path) {
                res = {icon: ele.icon, name: ele.name};
            } else {
                if (ele.child) { res = this.getPathName(path, ele.child, res); }
            }
        });
        return res;
    };

    render() {
        return (
            <div className='bread'>
                <Breadcrumb>
                    {this.props.routes.map((item, index) => {
                        let res: any = {};
                        res = this.getPathName(item, this.props.menuItems, res);
                        return (
                            <Breadcrumb.Item key={index}>
                                {item !== '' &&
                                    [
                                        <Icon key={index + 'icon'} type={res.icon}/>,
                                        <span key={index + 'label'} >{res.name}</span>,
                                    ]
                                }
                            </Breadcrumb.Item>
                        );
                    })}
                </Breadcrumb>
            </div>
        );
    }
}
export default Bread;
