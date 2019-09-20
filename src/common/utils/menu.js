export const allMenu = [
  {
    name: '首页',
    url: 'index',
    icon: 'home',
  }, {
    name: '资源监控',
    url: 'softwaremonitor',
    icon: 'apple-o',
    children:[
      {name:"软件监控",url:"softwaremonitor"},
      {name:"硬件监控",url:"hardwaremonitor"}
    ]
  }, {
    name: '配置管理',
    url: 'collocation',
    icon: 'edit',
    children:[
      {name:"场景配置",url:"scenesetup"},
      {name:"资源配置",url:"equipmentmanager"}
    ]
  }, {
    name: '告警',
    url: 'emergency',
    icon: 'heart-o',
    children:[
      {name:"告警检测",url:"warncheck"},
      {name:"告警设置",url:"warnsetuphardware"}
    ]
  }, {
    name: '日志',
    url: 'logmanager',
    icon: 'bars',
    children:[
      {name:"监控日志",url:"resourcestatusmanager"},
      {name:"告警日志",url:"warnlogmanager"}
    ]
  }, {
    name: '系统设置',
    url: 'systemsetting',
    icon: 'tool',
    children:[
      {name:"人员管理",url:"usermanager"},
      {name:"角色管理",url:"rolemanager"},
      {name:"系统设置",url:"sysconfmanager"},
      {name:"个人信息",url:"profilemanager"}
    ]
  }]