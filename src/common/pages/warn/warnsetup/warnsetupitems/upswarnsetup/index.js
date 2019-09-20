import React from 'react'
import {Input ,Radio ,Select ,Button ,message,Checkbox ,Divider } from 'antd';
import './index.less';
import axios from 'axios';
import {PATH,IP} from '../../../../../utils/urls';
import BreadcrumbCustom from "../../../../../components/BreadcrumbCustom";
const { Option } = Select;
//大于和小于的id
const conditionType=[30,29];
export default class UPSWarnSetup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resouceType: 0,
            appId:"",
            name:"",
            sendData:[
                {resourceId:0,isSoftware:0,isFluctuation:0,monitorTypeDictId: 50,conditionTypeDictId:30,conditionLowerLimit:0,warnSwitchStatus:0,isChecked:0}
                ,{resourceId:0,isSoftware:0,isFluctuation:0,monitorTypeDictId: 51,conditionTypeDictId:30,conditionLowerLimit:0,warnSwitchStatus:0,isChecked:0}
                ,{resourceId:0,isSoftware:0,isFluctuation:0,monitorTypeDictId: 52,conditionTypeDictId:30,conditionLowerLimit:0,warnSwitchStatus:0,isChecked:0}
                ,{resourceId:0,isSoftware:0,isFluctuation:0,monitorTypeDictId: 53,conditionTypeDictId:30,conditionLowerLimit:0,warnSwitchStatus:0,isChecked:0}
                ,{resourceId:0,isSoftware:0,isFluctuation:0,monitorTypeDictId: 55,conditionTypeDictId:30,conditionLowerLimit:0,warnSwitchStatus:0,isChecked:0}
                ,{resourceId:0,isSoftware:0,isFluctuation:1,monitorTypeDictId: 50,conditionTypeDictId:30,conditionLowerLimit:0,warnSwitchStatus:0,isChecked:0}
                ,{resourceId:0,isSoftware:0,isFluctuation:1,monitorTypeDictId: 51,conditionTypeDictId:30,conditionLowerLimit:0,warnSwitchStatus:0,isChecked:0}
                ,{resourceId:0,isSoftware:0,isFluctuation:1,monitorTypeDictId: 52,conditionTypeDictId:30,conditionLowerLimit:0,warnSwitchStatus:0,isChecked:0}
                ,{resourceId:0,isSoftware:0,isFluctuation:1,monitorTypeDictId: 53,conditionTypeDictId:30,conditionLowerLimit:0,warnSwitchStatus:0,isChecked:0}
                ,{resourceId:0,isSoftware:0,isFluctuation:1,monitorTypeDictId: 55,conditionTypeDictId:30,conditionLowerLimit:0,warnSwitchStatus:0,isChecked:0}
                ,{resourceId:0,isSoftware:0,isFluctuation:0,monitorTypeDictId: 47,conditionTypeDictId:31,conditionLowerLimit:0,warnSwitchStatus:0,isChecked:0}//运行状态告警
            ],
            warnSwitchStatus:0//启动状态告警
        };
    }

    componentDidMount() {
        this.props.onRefv(this);
        console.log(this.props);
        if(this.props.dataSource == null){
            return;
        }
        this.setState({
            appId:this.props.dataSource.data.appId,
            name:this.props.dataSource.data.resouceName,
            isSoftware:0,
            onUpdataEquipment:this.props.onUpdataEquipment,
        })

        for(let i = 0;i<this.state.sendData.length;i++){
            this.state.sendData[i].resourceId = this.props.dataSource.data.id;
            this.state.sendData[i].isSoftware = 0;
        }

        //获取历史设置数据
        this.getHistoryData(this.props.dataSource.data.id,0);
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
                if(response.data.data[response.data.data.length - 1]){
                    response.data.data[response.data.data.length - 1].isFluctuation = 0;
                }
                this.setState({
                    sendData:response.data.data,
                    warnSwitchStatus:response.data.data[0].warnSwitchStatus,
                    id:""
                },()=>{
                    console.log(this.state);
                })
            }
        })
    }


    /**
     * 输入框值变化
     * @returns {*}
     */
    inputChange = (event)=>{
        if(event && event.target){
            let value = event.target.value;
            if(parseInt(value)<0){
                message.error("不可为负值！");
                return;
            }
            let index = parseInt(event.target.id.replace("editEquipMentInput",""))-2;
            console.log(index);
            this.state.sendData[index].conditionLowerLimit = value;
        }

        this.setState({
            sendData:this.state.sendData
        })
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
        let index = parseInt(e.replace("serviceclientCheckbox",""))- 1;
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
        this.state.sendData[10].isChecked = e.target.checked?1:0;
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
        this.state.sendData[10].conditionTypeDictId = e;
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
                        <Checkbox id="serviceclientCheckbox0"checked={this.state.warnSwitchStatus == 1?true:false} className="warnSetupCheckbox" onChange={this.onSetStateSelectFunAll}>启用告警</Checkbox>
                    </div>
                    <div className="warnSetupCell">
                        <Checkbox checked={this.state.sendData[0].isChecked==1?true:false}  id="serviceclientCheckbox1" className="warnSetupCheckbox" onChange={this.onSetStateSelectFun.bind(this,"serviceclientCheckbox1")}>电压</Checkbox>
                        <Select value={this.state.sendData[0].conditionTypeDictId} className="changeTitle serviceclientSelect" id="serviceclientSelect0" onChange={this.onSelectChange.bind(this,"serviceclientSelect0")} style={{width: 80}} defaultValue="小于">
                            <Option value={30}>小于</Option>
                            <Option value={29}>大于</Option>
                        </Select>
                        <Input value={this.state.sendData[0].conditionLowerLimit} onChange={event=>this.inputChange(event)}   id="editEquipMentInput2" className="changeCell secretkey"/>
                        <div className="changeTitle secretkeyunit"></div>
                    </div>
                    <div className="warnSetupCell">
                        <Checkbox checked={this.state.sendData[1].isChecked==1?true:false}  id="serviceclientCheckbox2" className="warnSetupCheckbox" onChange={this.onSetStateSelectFun.bind(this,"serviceclientCheckbox2")}>电流</Checkbox>
                        <Select value={this.state.sendData[1].conditionTypeDictId} className="changeTitle serviceclientSelect" id="serviceclientSelect1" onChange={this.onSelectChange.bind(this,"serviceclientSelect1")} style={{width: 80}} defaultValue="小于">
                            <Option value={30}>小于</Option>
                            <Option value={29}>大于</Option>
                        </Select>
                        <Input value={this.state.sendData[1].conditionLowerLimit} onChange={event=>this.inputChange(event)}   id="editEquipMentInput3" className="changeCell secretkey" />
                        <div className="changeTitle secretkeyunit"></div>
                    </div>
                    <div className="warnSetupCell">
                        <Checkbox  checked={this.state.sendData[2].isChecked==1?true:false}  id="serviceclientCheckbox3" className="warnSetupCheckbox" onChange={this.onSetStateSelectFun.bind(this,"serviceclientCheckbox3")}>有功功率</Checkbox>
                        <Select value={this.state.sendData[2].conditionTypeDictId} className="changeTitle serviceclientSelect" id="serviceclientSelect2" onChange={this.onSelectChange.bind(this,"serviceclientSelect2")} style={{width: 80}} defaultValue="小于">
                            <Option value={30}>小于</Option>
                            <Option value={29}>大于</Option>
                        </Select>
                        <Input value={this.state.sendData[2].conditionLowerLimit} onChange={event=>this.inputChange(event)}   id="editEquipMentInput4" className="changeCell secretkey"/>
                        <div className="changeTitle secretkeyunit"></div>
                    </div>
                    <div className="warnSetupCell">
                        <Checkbox checked={this.state.sendData[3].isChecked==1?true:false}  id="serviceclientCheckbox4" className="warnSetupCheckbox" onChange={this.onSetStateSelectFun.bind(this,"serviceclientCheckbox4")}>无功功率</Checkbox>
                        <Select value={this.state.sendData[3].conditionTypeDictId} className="changeTitle serviceclientSelect" id="serviceclientSelect3" onChange={this.onSelectChange.bind(this,"serviceclientSelect3")} style={{width: 80}} defaultValue="小于">
                            <Option value={30}>小于</Option>
                            <Option value={29}>大于</Option>
                        </Select>
                        <Input value={this.state.sendData[3].conditionLowerLimit} onChange={event=>this.inputChange(event)}   id="editEquipMentInput5" className="changeCell secretkey"/>
                        <div className="changeTitle secretkeyunit"></div>
                    </div>
                    <div className="warnSetupCell">
                        <Checkbox checked={this.state.sendData[4].isChecked==1?true:false}  id="serviceclientCheckbox5" className="warnSetupCheckbox" onChange={this.onSetStateSelectFun.bind(this,"serviceclientCheckbox5")}>电池剩余流量</Checkbox>
                        <Select value={this.state.sendData[4].conditionTypeDictId} className="changeTitle serviceclientSelect" id="serviceclientSelect4" onChange={this.onSelectChange.bind(this,"serviceclientSelect4")} style={{width: 80}} defaultValue="小于">
                            <Option value={30}>小于</Option>
                            <Option value={29}>大于</Option>
                        </Select>
                        <Input value={this.state.sendData[4].conditionLowerLimit} onChange={event=>this.inputChange(event)}   id="editEquipMentInput6" className="changeCell secretkey"/>
                        <div className="changeTitle secretkeyunit">%</div>
                    </div>
                    <div className="warnSetupCell">
                        <Checkbox id="statusSwitchCheck" checked={this.state.sendData[10].isChecked==1?true:false} className="warnSetupCheckbox" onChange={this.onSetStatusCheckBox.bind(this)}>运行状态告警</Checkbox>
                        <Select value={this.state.sendData[10].conditionTypeDictId} className="changeTitle serviceclientSelect" onChange={this.onSetStatusSelect.bind(this)} style={{width: 80}} defaultValue="等于">
                            <Option value={31}>等于</Option>
                        </Select>
                        <Input disabled="true" value={this.state.sendData[10].isSoftware == 0?"未连接":"未启动"} id="stateInput" className="changeCell secretkey"/>
                        <div className="changeTitle secretkeyunit"></div>
                    </div>
                    <h3 className="jiankongline">5分钟波动率告警</h3>
                    <Divider type="horizontal "></Divider>

                    <div className="warnSetupCell">
                        <Checkbox checked={this.state.sendData[5].isChecked==1?true:false}  id="serviceclientCheckbox6" className="warnSetupCheckbox" onChange={this.onSetStateSelectFun.bind(this,"serviceclientCheckbox6")}>电压</Checkbox>
                        <Select value={this.state.sendData[5].conditionTypeDictId} className="changeTitle serviceclientSelect" id="serviceclientSelect5" onChange={this.onSelectChange.bind(this,"serviceclientSelect5")} style={{width: 80}} defaultValue="小于">
                            <Option value={30}>小于</Option>
                            <Option value={29}>大于</Option>
                        </Select>
                        <Input value={this.state.sendData[5].conditionLowerLimit} onChange={event=>this.inputChange(event)}   id="editEquipMentInput7" className="changeCell secretkey"/>
                        <div className="changeTitle secretkeyunit"></div>
                    </div>
                    <div className="warnSetupCell">
                        <Checkbox checked={this.state.sendData[6].isChecked==1?true:false}  id="serviceclientCheckbox7" className="warnSetupCheckbox" onChange={this.onSetStateSelectFun.bind(this,"serviceclientCheckbox7")}>电流</Checkbox>
                        <Select value={this.state.sendData[6].conditionTypeDictId} className="changeTitle serviceclientSelect" id="serviceclientSelect6" onChange={this.onSelectChange.bind(this,"serviceclientSelect6")} style={{width: 80}} defaultValue="小于">
                            <Option value={30}>小于</Option>
                            <Option value={29}>大于</Option>
                        </Select>
                        <Input value={this.state.sendData[6].conditionLowerLimit} onChange={event=>this.inputChange(event)}   id="editEquipMentInput8" className="changeCell secretkey" />
                        <div className="changeTitle secretkeyunit"></div>
                    </div>
                    <div className="warnSetupCell">
                        <Checkbox checked={this.state.sendData[7].isChecked==1?true:false}  id="serviceclientCheckbox8" className="warnSetupCheckbox" onChange={this.onSetStateSelectFun.bind(this,"serviceclientCheckbox8")}>有功功率</Checkbox>
                        <Select value={this.state.sendData[7].conditionTypeDictId} className="changeTitle serviceclientSelect" id="serviceclientSelect7" onChange={this.onSelectChange.bind(this,"serviceclientSelect7")} style={{width: 80}} defaultValue="小于">
                            <Option value={30}>小于</Option>
                            <Option value={29}>大于</Option>
                        </Select>
                        <Input value={this.state.sendData[7].conditionLowerLimit} onChange={event=>this.inputChange(event)}   id="editEquipMentInput9" className="changeCell secretkey"/>
                        <div className="changeTitle secretkeyunit"></div>
                    </div>
                    <div className="warnSetupCell">
                        <Checkbox checked={this.state.sendData[8].isChecked==1?true:false}  id="serviceclientCheckbox9" className="warnSetupCheckbox" onChange={this.onSetStateSelectFun.bind(this,"serviceclientCheckbox9")}>无功功率</Checkbox>
                        <Select value={this.state.sendData[8].conditionTypeDictId} className="changeTitle serviceclientSelect" id="serviceclientSelect8" onChange={this.onSelectChange.bind(this,"serviceclientSelect8")} style={{width: 80}} defaultValue="小于">
                            <Option value={30}>小于</Option>
                            <Option value={29}>大于</Option>
                        </Select>
                        <Input value={this.state.sendData[8].conditionLowerLimit} onChange={event=>this.inputChange(event)}   id="editEquipMentInput10" className="changeCell secretkey"/>
                        <div className="changeTitle secretkeyunit"></div>
                    </div>
                    <div className="warnSetupCell">
                        <Checkbox checked={this.state.sendData[9].isChecked==1?true:false}  id="serviceclientCheckbox10" className="warnSetupCheckbox" onChange={this.onSetStateSelectFun.bind(this,"serviceclientCheckbox10")}>电池剩余流量</Checkbox>
                        <Select value={this.state.sendData[9].conditionTypeDictId} className="changeTitle serviceclientSelect" id="serviceclientSelect9" onChange={this.onSelectChange.bind(this,"serviceclientSelect9")} style={{width: 80}} defaultValue="小于">
                            <Option value={30}>小于</Option>
                            <Option value={29}>大于</Option>
                        </Select>
                        <Input value={this.state.sendData[9].conditionLowerLimit} onChange={event=>this.inputChange(event)}   id="editEquipMentInput11" className="changeCell secretkey"/>
                        <div className="changeTitle secretkeyunit">%</div>
                    </div>

                    <div className="clearBoth"></div>
                </div>
            </div>

        )
    }
}