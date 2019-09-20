import React from 'react'
import {Input ,Radio ,Select ,Button ,message } from 'antd';
import './index.less';
import axios from 'axios';
import {PATH,IP} from '../../../../../utils/urls';
import {uuidGenerator} from '../../../../../utils/config';
const { Option } = Select;
export default class AddEquipmentResource extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id:"",
            resouceType: 2,
            appId:"",
            resouceName:"",
            md5Key:"",
            frequency:"",
            resouceIp:"",
            interfaceBandwidth:"",
            macAddress:"",
            snmpVersion:"",
            orgName:"",
            selectDisable:false//类型下拉菜单是否可用,当新增时可以用，当修改时不可用
        };
    }

    //接受父类传参
    componentDidMount() {
        this.props.onRef(this);
        console.log(this.props);
        if(this.props.dataSource == null){
            return;
        }
        //编辑功能
        if(this.props.dataSource.data){
            this.setState({
                ...this.props.dataSource.data,
                selectDisable:true//当修改时不可用
            })
        }

        this.setState({
            onUpdataEquipment:this.props.onUpdataEquipment,
        })

        //新增
        if(this.props.dataSource.resouceType){
            this.setState({
                resouceType:this.props.dataSource.resouceType,
                appId:uuidGenerator()
            })
        }
    }


    /**
     * 输入框值变化
     * @returns {*}
     */
    inputChange = (event)=>{
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
                case "editEquipMentInput4":
                    this.setState({resouceIp:value});
                    break;
                case "editEquipMentInput5":
                    this.setState({interfaceBandwidth:value});
                    break;
                case "editEquipMentInput6":
                    this.setState({macAddress:value});
                    break;
                case "editEquipMentInput7":
                    this.setState({snmpVersion:value});
                    break;
                case "editEquipMentInput8":
                    this.setState({orgName:value});
                    break;
            }
        }
    }
    handleChange = e=> {
        console.log(e);
        this.setState({
            resouceType: e
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
        if(this.state.id.length<=0){
            path = PATH.addHardWareResource;
        }else{
            path = PATH.editHardWareResource;
        }
        if(this.state.resouceName.length<=0|| this.state.md5Key.length<=0|| this.state.frequency.length<=0||
            this.state.resouceIp.length<=0|| this.state.interfaceBandwidth.length<=0|| this.state.macAddress.length<=0|| this.state.snmpVersion.length<=0|| this.state.orgName.length<=0){
            message.error("内容不能为空！")
            return;
        }
        axios.post(path,{
            id:this.state.id,
            appId:this.state.appId,
            resouceType:this.state.resouceType,
            resouceName:this.state.resouceName,
            md5Key:this.state.md5Key,
            frequency:this.state.frequency,
            resouceIp:this.state.resouceIp,
            interfaceBandwidth:this.state.interfaceBandwidth,
            macAddress:this.state.macAddress,
            snmpVersion:this.state.snmpVersion,
            orgName:this.state.orgName,
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
    render() {
        console.log(this.state);
        return (
            <div>
                <div className="changeAllContent">
                    <div className="resourceContentCell">
                        <div className="changeTitle">资源编号:</div>
                        <Input allowClear onChange={event=>this.inputChange(event)}  id="editEquipMentInput0" className="changeCell" value={this.state.appId} placeholder="请输入资源编号"/>
                    </div>
                    <div className="resourceContentCell">
                        <div className="changeTitle">设备名称:</div>
                        <Input allowClear onChange={event=>this.inputChange(event)}  id="editEquipMentInput1" className="changeCell" value={this.state.resouceName} placeholder="请输入设备名称" />
                    </div>
                    <div className="resourceContentCell">
                        <div className="changeTitle">设备类型:</div>
                        <Select disabled={true} className="changeCell" value={this.state.resouceType} onChange={this.handleChange}>
                            <Option value={2}>UPS</Option>
                            <Option value={3}>路由器</Option>
                            <Option value={4}>交换机</Option>
                        </Select>
                    </div>
                    <div className="resourceContentCell">
                        <div className="changeTitle">通信秘钥:</div>
                        <Input value={this.state.md5Key} allowClear onChange={event=>this.inputChange(event)}  id="editEquipMentInput2" className="changeCell" placeholder="请输入通信秘钥" />
                    </div>
                    <div className="resourceContentCell">
                        <div className="changeTitle">采集频率:</div>
                        <Input value={this.state.frequency} allowClear onChange={event=>this.inputChange(event)}  id="editEquipMentInput3" className="changeCell secretkey" placeholder="请输入采集频率" />
                        <div className="changeTitle secretkeyunit">毫秒</div>
                    </div>
                    <h3 className="jiankongline">监控设置</h3>
                    <div className="resourceContentCell">
                        <div className="changeTitle">IP地址:</div>
                        <Input value={this.state.resouceIp} allowClear onChange={event=>this.inputChange(event)}  id="editEquipMentInput4" className="changeCell" placeholder="请输入IP地址" />
                    </div>
                    <div className="resourceContentCell">
                        <div className="changeTitle">管理端口:</div>
                        <Input value={this.state.interfaceBandwidth} allowClear onChange={event=>this.inputChange(event)}  id="editEquipMentInput5" className="changeCell" placeholder="请输入管理端口" />
                    </div>
                    <div className="resourceContentCell">
                        <div className="changeTitle">MAC地址:</div>
                        <Input value={this.state.macAddress} allowClear onChange={event=>this.inputChange(event)}  id="editEquipMentInput6" className="changeCell" placeholder="请输入MAC地址" />
                    </div>
                    <div className="resourceContentCell">
                        <div className="changeTitle">SNMP版本:</div>
                        <Input value={this.state.snmpVersion} allowClear onChange={event=>this.inputChange(event)}  id="editEquipMentInput7" className="changeCell" placeholder="请输入SNMP版本" />
                    </div>
                    <div className="resourceContentCell">
                        <div className="changeTitle">归属组织:</div>
                        <Input value={this.state.orgName} allowClear onChange={event=>this.inputChange(event)}  id="editEquipMentInput8" className="changeCell" placeholder="请输入归属组织" />
                    </div>
                    <div className="clearBoth"></div>
                </div>
            </div>
        )
    }
}