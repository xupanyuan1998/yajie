import React from 'react'
import {Input ,Radio ,Select ,Button ,message } from 'antd';
import './index.less';
import axios from 'axios';
import {PATH,IP} from '../../../../../utils/urls';
const { Option } = Select;

import BreadcrumbCustom from "../../../../../components/BreadcrumbCustom";
export default class EditEquipmentResource extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resouceType: 0,
            id:"",
            appId:"",
            resouceName:"",
            md5Key:"",
            frequency:"",
            networkInterface:"",
            netAdapterList:[]
        };
    }

    handleClick(){
        //...
        console.log(123);
    }

    componentDidMount() {
        this.props.onRef(this)
        console.log(this.props);
        if(this.props.dataSource == null){
            return;
        }
        this.setState({
            ...this.state,
            ...this.props.dataSource.data,
            onUpdataEquipment:this.props.onUpdataEquipment
        })

        //获取网卡资源
        this.getNetadapterPool(this.props.dataSource.data.id);
    }

    /**
     * 获取网卡资源
     * @param id
     */
    getNetadapterPool(id){
        axios.post(PATH.netadapterPool,{
            hardwareId:id
        }).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                this.setState({
                    netAdapterList:response.data.data
                })
            }
        })
    }

    /**
     * 设置设备类型
     * @param e
     */
    onChange = e =>{
        console.log(e.target.value);
        this.setState({
            resouceType: e.target.value,
        });
    }

    /**
     * 设置网卡
     * @param e
     */
    handleChange = e=> {
        console.log(e);
        this.setState({
            networkInterface: e,
        });
    }
    /**
     * 返回
     * @returns {*}
     */
    backFun=()=>{
        let path={
            pathname:"equipmentmanager"
        }
        this.props.history.push(path);
    }

    /**
     * 保存
     * @returns {*}
     */
    onSubmit=()=>{
        console.log(this.state);
        let path = "";
        if(this.state.id!=""){
            path = PATH.editHardWareResource;
        }else{
            path = PATH.addHardWareResource;
        }
        if(this.state.id.length<=0||this.state.resouceName.length<=0||this.state.resouceType.length<=0||this.state.md5Key.length<=0
        ||this.state.frequency.length<=0||this.state.networkInterface.length<=0){
            message.error("内容不能为空！");
            return;
        }
        axios.post(path,{
            id:this.state.id,
            resouceName:this.state.resouceName,
            resouceType:this.state.resouceType,
            md5Key:this.state.md5Key,
            frequency:this.state.frequency,
            networkInterface:this.state.networkInterface
        }).then(response=>{
            console.log(response);
            if(response.data.code == 0){
                message.success(response.data.msg);
                this.state.onUpdataEquipment();
                //this.backFun();
            }else{
                message.error(response.data.msg);
            }
        })
    }

    /**
     * 输入框值变化
     * @returns {*}
     */
    inputChange = (event)=>{
        console.log(123);
        if(event && event.target){
            let value = event.target.value;
            switch (event.target.id) {
                case "editEquipMentInput0":
                    this.setState({appId:value});
                    break;
                case "editEquipMentInput1":
                    this.setState({resouceName:value});
                    break;
                case "editEquipMentInput2":
                    this.setState({md5Key:value});
                    break;
                case "editEquipMentInput3":
                    this.setState({frequency:value});
                    break;
            }
        }
    }

    render() {
        console.log(this.state);
        return (
            <div>
                <div className="changeAllContent">
                    <div className="resourceContentCell">
                        <div className="changeTitle">资源编号:</div>
                        <Input allowClear id="editEquipMentInput0" disabled={true} className="changeCell" value={this.state.appId} placeholder="请输入资源编号" onChange={event=>this.inputChange(event)}/>
                    </div>
                    <div className="resourceContentCell">
                        <div className="changeTitle">设备名称:</div>
                        <Input allowClear id="editEquipMentInput1" className="changeCell" value={this.state.resouceName} placeholder="请输入设备名称" onChange={event=>this.inputChange(event)} />
                    </div>
                    <div className="resourceContentCell">
                        <div className="changeTitle">设备类型:</div>
                        <Radio.Group className="changeCell changeRaio" onChange={this.onChange} value={this.state.resouceType}>
                            <Radio value={0}>服务器</Radio>
                            <Radio value={1}>客户端</Radio>
                        </Radio.Group>
                    </div>
                    <div className="resourceContentCell">
                        <div className="changeTitle">通讯秘钥:</div>
                        <Input allowClear id="editEquipMentInput2" value={this.state.md5Key} className="changeCell" placeholder="请输入通讯秘钥" onChange={event=>this.inputChange(event)} />

                    </div>
                    <div className="resourceContentCell">
                        <div className="changeTitle">采集频率:</div>
                        <Input allowClear id="editEquipMentInput3" value={this.state.frequency} className="changeCell secretkey" placeholder="请输入采集频率" onChange={event=>this.inputChange(event)} />
                        <div className="changeTitle secretkeyunit">毫秒</div>
                    </div>
                    <div className="resourceContentCell">
                        <div className="changeTitle">网卡:</div>
                        <Select value={this.state.networkInterface} className="changeCell" onChange={this.handleChange}>
                            {
                                this.state.netAdapterList.map((item,i) => (
                                    <Option value={item.netadapter} key={i}>{item.netadapter}</Option>
                                ))
                            }
                        </Select>
                    </div>
                    <div className="clearBoth"></div>
                </div>
            </div>
        )
    }
}