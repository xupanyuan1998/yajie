import React from 'react'
import {Input ,Radio ,Select ,Button ,message,Checkbox ,Divider } from 'antd';
import './index.less';
import axios from 'axios';
import {PATH,IP} from '../../../../../utils/urls';
import BreadcrumbCustom from "../../../../../components/BreadcrumbCustom";
const { Option } = Select;
//小于大于和的id
const conditionType=[30,29];
export default class ServiceClientWarnSetup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resouceType: 0,
            appId:"",
            name:"",
            sendData:[
                {resourceId:0,isSoftware:0,isFluctuation:0,monitorTypeDictId: 44,conditionTypeDictId:30,conditionLowerLimit:0,warnSwitchStatus:0,isChecked:0}
                ,{resourceId:0,isSoftware:0,isFluctuation:0,monitorTypeDictId: 46,conditionTypeDictId:30,conditionLowerLimit:0,warnSwitchStatus:0,isChecked:0}
                ,{resourceId:0,isSoftware:0,isFluctuation:0,monitorTypeDictId: 45,conditionTypeDictId:30,conditionLowerLimit:0,warnSwitchStatus:0,isChecked:0}
                ,{resourceId:0,isSoftware:0,isFluctuation:1,monitorTypeDictId: 44,conditionTypeDictId:30,conditionLowerLimit:0,warnSwitchStatus:0,isChecked:0}
                ,{resourceId:0,isSoftware:0,isFluctuation:1,monitorTypeDictId: 46,conditionTypeDictId:30,conditionLowerLimit:0,warnSwitchStatus:0,isChecked:0}
                ,{resourceId:0,isSoftware:0,isFluctuation:1,monitorTypeDictId: 45,conditionTypeDictId:30,conditionLowerLimit:0,warnSwitchStatus:0,isChecked:0}
                ,{resourceId:0,isSoftware:0,isFluctuation:0,monitorTypeDictId: 47,conditionTypeDictId:31,conditionLowerLimit:0,warnSwitchStatus:0,isChecked:0}//运行状态告警
            ],
            warnSwitchStatus:0//启动状态告警
        };
    }

    componentDidMount() {
        this.props.onRefv(this);
        console.log(this.props);
        console.log(this.props.dataSource.data.isSoftware);
        if(this.props.dataSource == null){
            return;
        }
        this.setState({
            appId:this.props.dataSource.data.appId,
            name:this.props.dataSource.data.resouceName,
            isSoftware:this.props.dataSource.data.isSoftware,
            onUpdataEquipment:this.props.onUpdataEquipment,
        })

        for(let i = 0;i<this.state.sendData.length;i++){
            this.state.sendData[i].resourceId = this.props.dataSource.data.id;
            this.state.sendData[i].isSoftware = this.props.dataSource.data.isSoftware;
        }
        //获取历史设置数据
        this.getHistoryData(this.props.dataSource.data.id,this.props.dataSource.data.isSoftware);
    }

    /**
     * 获取历史设置数据
     */
    getHistoryData(id,isSoftware){
        axios.post(PATH.warnConfQuery,{
            resourceId:id,
            isSoftware:isSoftware
        }).then((response)=>{
            console.log(response);
            if(response.data.code == 0){
                if(response.data.data.length>0){
                    if(response.data.data.length == 6){
                        response.data.data.push({resourceId:0,isSoftware:0,isFluctuation:0,monitorTypeDictId: 47,conditionTypeDictId:31,conditionLowerLimit:0,warnSwitchStatus:0,isChecked:0});
                        this.setState({
                            sendData:response.data.data,
                            warnSwitchStatus:response.data.data[0].warnSwitchStatus,
                        })
                    }else{
                        if(response.data.data[response.data.data.length - 1]){
                            response.data.data[response.data.data.length - 1].isFluctuation = 0;
                        }
                        this.setState({
                            sendData:response.data.data,
                            warnSwitchStatus:response.data.data[0].warnSwitchStatus,
                        })
                    }
                }
            }
            console.log(response);
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
            if(parseInt(value)<0){
                message.error("不可为负值！");
                return;
            }
            let index = event.target.id.substring(event.target.id.length - 1,event.target.id.length) - 2;
            this.state.sendData[index].conditionLowerLimit = value;
            this.setState({
                sendData:this.state.sendData
            })
        }

        console.log(this.state);
    }
    /**
     * 返回
     * @returns {*}
     */
    backFun=()=>{
        let path={
            pathname:"warnsetuphardware"
        }
        this.props.history.push(path);
    }

    /**
     * 保存
     * @returns {*}
     */
    onSubmit=()=>{
        console.log(this.state);
        axios.post(PATH.warnConfAdd,this.state.sendData)
            .then(response=>{
                console.log(response);
                if(response.data.code == 0){
                    message.success(response.data.msg);
                    //this.state.onUpdataEquipment();
                    //this.backFun();
                }else{
                    message.error(response.data.msg);
                }
            })
    }

    /**
     * 设置是否启动状态报警
     * @param e
     */
    onSetStateSelectFunAll=e=>{
        console.log(e.target.checked);
        let warnSwitchStatus = 0;
        if(e.target.checked){
            warnSwitchStatus = 1;
        }
        this.setState({
            warnSwitchStatus:warnSwitchStatus
        });
        for(let i = 0;i<this.state.sendData.length;i++){
            this.state.sendData[i].warnSwitchStatus = warnSwitchStatus;
        }
    }

    /**
     * 设置是cup,内存,io开启
     * @param e
     */
    onSetStateSelectFun(e,props){
        console.log(e);
        console.log(props);
        let index = e.substring(e.length - 1,e.length) - 1;
        this.state.sendData[index].isChecked = props.target.checked?1:0;
        this.setState({
            sendData:this.state.sendData
        })
        console.log(this.state);
    }

    onSelectChange(e,props){
        console.log(e);
        console.log(props);
        let index = e.substring(e.length - 1,e.length);
        this.state.sendData[index].conditionTypeDictId = props;
        this.setState({
            sendData:this.state.sendData
        })
        console.log(this.state.sendData);
    }

    /**
     * 设置运动状态告警
     * @param e
     */
    onSetStatusCheckBox(e){
        console.log(e);
        this.state.sendData[6].isChecked = e.target.checked?1:0;
        this.setState({
            sendData:this.state.sendData
        })
        console.log(this.state);
    }
    /**
     * 设置运动状态告警
     * @param e
     */
    onSetStatusSelect(e){
        console.log(e);
        this.state.sendData[6].conditionTypeDictId = e;
        this.setState({
            sendData:this.state.sendData
        })
        console.log(this.state.sendData);
    }
    render() {
        console.log(this.state);
        return (
            <div>
                <div className="changeAllContent">
                    <div className="warnSetupCell">
                        <div className="changeTitle">名称:</div>
                        <Input value={this.state.name} id="editEquipMentInput0" className="changeCell"/>
                    </div>
                    <div className="warnSetupCell">
                        <div className="changeTitle">资源编号:</div>
                        <Input value={this.state.appId} id="editEquipMentInput1" className="changeCell" />
                    </div>
                    <div className="warnSetupCell">
                        <Checkbox id="serviceclientCheckbox0" checked={this.state.warnSwitchStatus == 1?true:false} className="warnSetupCheckbox" onChange={this.onSetStateSelectFunAll}>启用告警</Checkbox>
                    </div>
                    <div className="warnSetupCell">
                        <Checkbox id="serviceclientCheckbox1" checked={this.state.sendData[0].isChecked==1?true:false} className="warnSetupCheckbox" onChange={this.onSetStateSelectFun.bind(this,"serviceclientCheckbox1")}>CPU告警</Checkbox>
                        <Select value={this.state.sendData[0].conditionTypeDictId} className="changeTitle serviceclientSelect" id="serviceclientSelect0" onChange={this.onSelectChange.bind(this,"serviceclientSelect0")} style={{width: 80}} defaultValue="小于">
                            <Option value={30}>小于</Option>
                            <Option value={29}>大于</Option>
                        </Select>
                        <Input onChange={event=>this.inputChange(event)} value={this.state.sendData[0].conditionLowerLimit}  id="editEquipMentInput2" className="changeCell secretkey"/>
                        <div className="changeTitle secretkeyunit setuprate">%</div>
                    </div>
                    <div className="warnSetupCell">
                        <Checkbox id="serviceclientCheckbox2" checked={this.state.sendData[1].isChecked==1?true:false} className="warnSetupCheckbox" onChange={this.onSetStateSelectFun.bind(this,"serviceclientCheckbox2")}>内存告警</Checkbox>
                        <Select value={this.state.sendData[1].conditionTypeDictId} className="changeTitle serviceclientSelect" id="serviceclientSelect1" onChange={this.onSelectChange.bind(this,"serviceclientSelect1")} style={{width: 80}} defaultValue="小于">
                            <Option value={30}>小于</Option>
                            <Option value={29}>大于</Option>
                        </Select>
                        <Input onChange={event=>this.inputChange(event)}  value={this.state.sendData[1].conditionLowerLimit} id="editEquipMentInput3" className="changeCell secretkey" />
                        <div className="changeTitle secretkeyunit setuprate">%</div>
                    </div>
                    <div className="warnSetupCell">
                        <Checkbox id="serviceclientCheckbox3" checked={this.state.sendData[2].isChecked==1?true:false} className="warnSetupCheckbox" onChange={this.onSetStateSelectFun.bind(this,"serviceclientCheckbox3")}>IO告警</Checkbox>
                        <Select value={this.state.sendData[2].conditionTypeDictId} className="changeTitle serviceclientSelect" id="serviceclientSelect2" onChange={this.onSelectChange.bind(this,"serviceclientSelect2")} style={{width: 80}} defaultValue="小于">
                            <Option value={30}>小于</Option>
                            <Option value={29}>大于</Option>
                        </Select>
                        <Input onChange={event=>this.inputChange(event)} value={this.state.sendData[2].conditionLowerLimit} defaultValue="0" id="editEquipMentInput4" className="changeCell secretkey"/>
                        <div className="changeTitle secretkeyunit"></div>
                    </div>
                    <div className="warnSetupCell">
                        <Checkbox id="statusSwitchCheck" checked={this.state.sendData[6].isChecked==1?true:false} className="warnSetupCheckbox" onChange={this.onSetStatusCheckBox.bind(this)}>运行状态告警</Checkbox>
                        <Select value={this.state.sendData[6].conditionTypeDictId} className="changeTitle serviceclientSelect" onChange={this.onSetStatusSelect.bind(this)} style={{width: 80}} defaultValue="等于">
                            <Option value={31}>等于</Option>
                        </Select>
                        <Input disabled="true" value={this.state.sendData[6].isSoftware == 0?"未连接":"未启动"} id="stateInput" className="changeCell secretkey"/>
                        <div className="changeTitle secretkeyunit"></div>
                    </div>
                    <h3 className="jiankongline">5分钟波动率告警</h3>
                    <Divider type="horizontal "></Divider>
                    <div className="warnSetupCell">
                        <Checkbox id="serviceclientCheckbox4" checked={this.state.sendData[3].isChecked==1?true:false} className="warnSetupCheckbox" onChange={this.onSetStateSelectFun.bind(this,"serviceclientCheckbox4")}>CPU告警</Checkbox>
                        <Select value={this.state.sendData[3].conditionTypeDictId} className="changeTitle serviceclientSelect" id="serviceclientSelect3" onChange={this.onSelectChange.bind(this,"serviceclientSelect3")} style={{width: 80}} defaultValue="小于">
                            <Option value={30}>小于</Option>
                            <Option value={29}>大于</Option>
                        </Select>
                        <Input onChange={event=>this.inputChange(event)} value={this.state.sendData[3].conditionLowerLimit} defaultValue="0"  id="editEquipMentInput5" className="changeCell secretkey"/>
                        <div className="changeTitle secretkeyunit setuprate">%</div>
                    </div>
                    <div className="warnSetupCell">
                        <Checkbox id="serviceclientCheckbox5" checked={this.state.sendData[4].isChecked==1?true:false} className="warnSetupCheckbox" onChange={this.onSetStateSelectFun.bind(this,"serviceclientCheckbox5")}>内存告警</Checkbox>
                        <Select value={this.state.sendData[4].conditionTypeDictId} className="changeTitle serviceclientSelect" id="serviceclientSelect4" onChange={this.onSelectChange.bind(this,"serviceclientSelect4")} style={{width: 80}} defaultValue="小于">
                            <Option value={30}>小于</Option>
                            <Option value={29}>大于</Option>
                        </Select>
                        <Input onChange={event=>this.inputChange(event)}  value={this.state.sendData[4].conditionLowerLimit} id="editEquipMentInput6" className="changeCell secretkey"/>
                        <div className="changeTitle secretkeyunit setuprate">%</div>
                    </div>
                    <div className="warnSetupCell">
                        <Checkbox id="serviceclientCheckbox6" checked={this.state.sendData[5].isChecked==1?true:false} className="warnSetupCheckbox" onChange={this.onSetStateSelectFun.bind(this,"serviceclientCheckbox6")}>IO告警</Checkbox>
                        <Select value={this.state.sendData[5].conditionTypeDictId} className="changeTitle serviceclientSelect" id="serviceclientSelect5" onChange={this.onSelectChange.bind(this,"serviceclientSelect5")} style={{width: 80}} defaultValue="小于">
                            <Option value={30}>小于</Option>
                            <Option value={29}>大于</Option>
                        </Select>
                        <Input onChange={event=>this.inputChange(event)}  value={this.state.sendData[5].conditionLowerLimit}  id="editEquipMentInput7" className="changeCell secretkey" />
                        <div className="changeTitle secretkeyunit"></div>
                    </div>
                    <div className="clearBoth"></div>
                </div>
            </div>
        )
    }
}