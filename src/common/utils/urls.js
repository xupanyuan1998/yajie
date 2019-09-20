export const IP = "101.37.65.219";
export const URL = "http://" + IP;
// export const URL = "";
export const PATH = {
    //验证码
    getCaptcha: URL + '/captcha/captchaImage',
    //登录
    login: URL + '/auth/login',
    //添加场景
    sceneAdd: URL + '/pzgl/scene/add',
    //获取区域场景列表
    getSceneList: URL + '/pzgl/scene/query',
    //获取区域场景列表，包括报警状态
    getAreaWarnList:URL+'/zyjk/monitor/scene/query',
    //区域场景添加
    addAreaScene:URL+'/pzgl/scene/add',
    //区域场景编辑
    editAreaScene:URL+'/pzgl/scene/edit',
    //删除区域场景
    removeAreaScene:URL+"/pzgl/scene/remove",
    //上传文件
    uploadFile: URL + '/common/upload',

    //获取硬件设备列表不分页
    hardwareResource: URL + '/pzgl/hardwareResource/query',
    //获取硬件设备列表分页
    hardwareResourceList: URL + '/pzgl/hardwareResource/list',
    //获取软件列表不分页
    softwareResource: URL + '/pzgl/softwareResource/query',
    //获取软件列表分页
    softwareResourceList: URL + '/pzgl/softwareResource/list',
    //添加软件资源
    softwareResourceAdd:URL+"/pzgl/softwareResource/add",
    //编辑软件资源
    softwareResourceEdit:URL+"/pzgl/softwareResource/edit",
    //删除软件资源
    softwareResourceRemove:URL+"/pzgl/softwareResource/remove",
    //设备资源添加
    addHardWareResource:URL+"/pzgl/hardwareResource/add",
    //设备资源编辑
    editHardWareResource:URL+"/pzgl/hardwareResource/edit",
    //删除设备资源
    removeHareWareResource:URL+"/pzgl/hardwareResource/remove",
    //区域场景添加元素
    areaSceneAddCell:URL+"/pzgl/hardwareResource/updatePosition",
    //主场景添加元素
    mainSceneAddCell:URL+"/pzgl/scene/updatePosition",
    //区域场景提交空场景
    sendAreaSceneEmpty:URL+"/pzgl/hardwareResource/updatePositionWithEmpty",

    //资源监控硬件查询
    resourceHardQuery:URL+"/zyjk/monitor/hardwareResource/query",
    //资源监控软件查询
    resourceSoftQuery:URL+"/zyjk/monitor/softwareResource/query",

    //获取主场景
    getMineScene:URL+'/pzgl/mainScene/query',
    //主场景编辑
    editMainScene:URL+'/pzgl/mainScene/edit',
    //告警处理管理
    warnDeal:URL+'/gl/warnDeal/deal',
    //监控日志列表
    resourceStatusList: URL+'/rz/resourceStatus/list',
    //删除监控日志
    resourceStatusListDelete: URL+'/rz/resourceStatus/remove',
    //全部删除监控日志
    resourceStatusListAllDelete: URL+'/rz/resourceStatus/allRemove',
    //告警日志列表
    warnLogList: URL+'/gl/warnLog/list',
    //删除告警日志
    warnLogListDelete:URL+'/gl/warnLog/remove',
    //全部删除告警日志
    warnLogListAllDelete:URL+'/gl/warnLog/allRemove',
    //告警配置增加
    warnConfAdd:URL+'/gl/warnConf/add',
    //告警配置编辑
    warnConfEdit:URL+'/gl/warnConf/edit',

    //告警配置查询
    warnConfQuery:URL+'/gl/warnConf/query',

    //用户列表
    userList: URL+"/system/user/list",
    //获取用户角色回显数据
    userView:URL+"/system/user/view",
    //角色列表分页
    roleList: URL+"/system/role/list",
    //角色列表不分页
    roleQuery: URL+"/system/role/query",
    //删除角色
    delectRole:URL+"/system/role/remove",
    //添加角色
    addRole:URL+"/system/role/add",
    //编辑角色
    editRole:URL+"/system/role/edit",
    //角色授权
    roleRightSave:URL+"/system/role/roleRightSave",
    //角色查看
    checkRole:URL+"/system/role/view",
    //角色权限查看
    roleMenuTreeData:URL+"/system/role/roleMenuTreeData",
    //个人信息
    profile: URL+"/system/user/profile",
    //修改个人信息
    editProfile:URL+'/system/user/profile/update',
    //修改密码
    changePassWord:URL+'/system/user/profile/resetPwd',
    //获取个人菜单和个人权限
    getMenu:URL+"/system/user/profile/getMenu",
    //添加人员
    addUser:URL+"/system/user/add",
    //删除人员
    delectUser:URL+"/system/user/remove",
    //编辑角色
    editUser:URL+"/system/user/edit",
    //人员重置密码
    userReSetPW:URL+"/system/user/resetPwd",

    //服务资源管理
    servicePool:URL+"/pzgl/servicePool/query",
    //获取数据项列表
    resourceGatherConf:URL+"/pzgl/resourceGatherConf/query",
    //添加数据项
    resourceGatherConfAdd:URL+"/pzgl/resourceGatherConf/add",
    //删除数据项
    resourceGatherConfRemove:URL+"/pzgl/resourceGatherConf/remove",
    //编辑数据项
    resourceGatherConfEdit:URL+"/pzgl/resourceGatherConf/edit",
    //网卡资源获取
    netadapterPool:URL+"/pzgl/netadapterPool/query",
    //数据字典管理
    getDict:URL+"/system/dict/data/query",
    //预警记录查询（正在预警的资源）
    getWarningList:URL+"/gl/warnLog/query",
}