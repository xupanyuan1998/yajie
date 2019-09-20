import React from 'react';
import {Table,Collapse} from "antd"
const {Panel} = Collapse;
class PanelTable extends React.Component{
    constructor(props){
        super(props);
        console.log(props);
        this.state = {
            item:[],//数据
            columns:[]//标题
        }
    }

    componentWillMount() {
        this.setState({
            item:this.props.item,
            columns:this.props.columns
        })
    }

    render(){
        console.log(this.state);
        return (
            <Panel header={this.state.item.name}>
                <Table className="tableResource" columns={this.state.columns}
                       dataSource={this.state.item.data} bordered pagination={false}/>
            </Panel>
        )
    }
}

export default PanelTable;