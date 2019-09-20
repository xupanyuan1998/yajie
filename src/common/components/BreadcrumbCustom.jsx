import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

class BreadcrumbCustom extends React.Component {
    render() {
        const first = <Breadcrumb.Item>{this.props.first}</Breadcrumb.Item> || '';
        const second = <Breadcrumb.Item>{this.props.second}</Breadcrumb.Item> || '';
        const third = <Breadcrumb.Item>{this.props.third}</Breadcrumb.Item> || '';
        return (
            <span>
                <Breadcrumb style={{ margin: '12px 0' }}>
                    <Breadcrumb.Item><Link to={'index'}>首页</Link></Breadcrumb.Item>
                        {first}
                        {second}
                        {third}
                </Breadcrumb>
            </span>
        )
    }
}

export default BreadcrumbCustom;
