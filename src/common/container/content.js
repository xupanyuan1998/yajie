import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from 'antd';

/**
 * 首页
 */
import index from '../pages/index';
import login from '../pages/login';
//区域场景报警界面
import AreaSceneWarn from '../pages/index/areascenewarn';

/**
 * 资源监控（软件监控、硬件监控）
 */
import SoftwareMonitor from "../pages/resourcemonitor/softwaremonitor";
import HardWareMonitor from "../pages/resourcemonitor/hardwaremonitor";
//=======================================================================================
/**
 * 配置管理（场景配置、资源配置）
 */
//场景配置
import SceneSetUp from '../pages/setupmanager/scenesetup';
//设置主场景中元素
import SetMainScenesCell from "../pages/setupmanager/scenesetup/setmainscenescell";
//设置区域场景中元素
import SetAreaCell from "../pages/setupmanager/scenesetup/setareacell";

//设备资源管理
import EquipmentMangager from "../pages/setupmanager/resourcemanager/equipmentmanager";
//修改设置资源信息
import EditEquipmentResource from "../pages/setupmanager/resourcemanager/equipmentmanager/editequipmentresource";
//参数设置
import EquipmentParamsSetup from '../pages/setupmanager/resourcemanager/equipmentmanager/equipmentparamssetup';
//添加设备资源UPS、路由器、交换机
import AddEquipmentResource from "../pages/setupmanager/resourcemanager/equipmentmanager/addequipmentresource";
//编辑添加数据项
import EditResourceGatherConf from "../pages/setupmanager/resourcemanager/equipmentmanager/equipmentparamssetup/editresourcegatherconf";

//软件资源管理
import SoftWareManager from "../pages/setupmanager/resourcemanager/softwaremanager";
//编辑软件资源
import EditSoftWareResource from "../pages/setupmanager/resourcemanager/softwaremanager/editsoftwareresource";
//=======================================================================================
/**
 * 告警（告警检测、告警设置）
 */
//告警检测
import WarnCheck from "../pages/warn/warncheck";
//硬件资源检测
import WarnSetupHardWare from "../pages/warn/warnsetup/warnsetuphardware";
//软件资源检测
import WarnSetupSoftWare from "../pages/warn/warnsetup/warnsetupsoftware";
//服务器/客户端/软件告警设置
import ServiceClientWarnSetup from "../pages/warn/warnsetup/warnsetupitems/serviceclientwarnsetup";
//UPS告警设置
import UPSWarnSetup from "../pages/warn/warnsetup/warnsetupitems/upswarnsetup";
//网络设置告警设置
import NetWorkWarnSetup from "../pages/warn/warnsetup/warnsetupitems/networkwarnsetup";
//=======================================================================================
/**
 * 日志 （监控日志、告警日志）
 */
import Resourcestatusmanager from "../pages/rz/resourcestatusmanager";
import Warnlogmanager from "../pages/rz/warnlogmanager";
//=======================================================================================
/**
 * 系统设置（人员管理、角色管理、系统设置、个人信息、修改密码）
 */
import Usermanager from "../pages/system/usermanager";
import Rolemanager from "../pages/system/rolemanager";
import Sysconfmanager from "../pages/system/sysconfmanager";
import Profilemanager from "../pages/system/profilemanager";
import ChangePassWord from "../pages/system/changepassword";

const { Content: Content } = Layout

export default class Contents extends React.Component {
  render() {
    return (
      <Content className="content">
          <Route path="/login" component={login} />
          <Route path="/index" component={index} />
        {/*<Route path="/index" component={index} />*/}
        <Route path="/areascenewarn" component={AreaSceneWarn} />

        <Route path="/setmainscenes" component={SetMainScenesCell}/>
        <Route path= "/softwaremonitor" component={SoftwareMonitor}/>
        <Route path="/hardwaremonitor" component={HardWareMonitor}/>
        <Route path="/equipmentmanager" component={EquipmentMangager}/>
        <Route path="/equipmentparamssetup" component={EquipmentParamsSetup}/>
        <Route path="/addequipmentresource" component={AddEquipmentResource}/>
        <Route path="/editresourcegatherconf" component={EditResourceGatherConf}/>
        <Route path="/setareacell" component ={SetAreaCell} />
        <Route path="/scenesetup" component={SceneSetUp} />

        <Route path="/softwaremanager" component={SoftWareManager}/>
        <Route path="/editsoftwareresource" component={EditSoftWareResource}/>
        <Route path="/editequipmentresource" component={EditEquipmentResource} />
        <Route path="/resourcestatusmanager" component={Resourcestatusmanager}/>
        <Route path="/warnlogmanager" component={Warnlogmanager}/>

        <Route path="/usermanager" component={Usermanager}/>
        <Route path="/rolemanager" component={Rolemanager}/>
        <Route path="/sysconfmanager" component={Sysconfmanager}/>
        <Route path="/profilemanager" component={Profilemanager} />
        <Route path="/changepassword" component={ChangePassWord} />

        <Route path="/warncheck" component={WarnCheck} />
        <Route path="/warnsetuphardware" component={WarnSetupHardWare} />
        <Route path="/warnsetupsoftware" component={WarnSetupSoftWare} />
        <Route path="/serviceclientwarnsetup" component={ServiceClientWarnSetup} />
        <Route path="/networkwarnsetup" component={NetWorkWarnSetup} />
        <Route path="/upswarnsetup" component={UPSWarnSetup} />
      </Content>
    );
  }
}