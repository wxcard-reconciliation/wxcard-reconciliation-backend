var ALY = require('aliyun-sdk');

module.exports = function(app) {
  /*
   * The `app` object provides access to a variety of LoopBack resources such as
   * models (e.g. `app.models.YourModelName`) or data sources (e.g.
   * `app.datasources.YourDataSource`). See
   * http://docs.strongloop.com/display/public/LB/Working+with+LoopBack+objects
   * for more info.
   */
  app.oss = new ALY.OSS({
    "accessKeyId": process.env.ALY_ACCESSKEYID,
    "secretAccessKey": process.env.ALY_SECRETACCESSKEY,
    // 根据你的 oss 实例所在地区选择填入
    // 杭州：http://oss-cn-hangzhou.aliyuncs.com
    // 北京：http://oss-cn-beijing.aliyuncs.com
    // 青岛：http://oss-cn-qingdao.aliyuncs.com
    // 深圳：http://oss-cn-shenzhen.aliyuncs.com
    // 香港：http://oss-cn-hongkong.aliyuncs.com
    // 注意：如果你是在 ECS 上连接 OSS，可以使用内网地址，速度快，没有带宽限制。
    // 杭州：http://oss-cn-hangzhou-internal.aliyuncs.com
    // 北京：http://oss-cn-beijing-internal.aliyuncs.com
    // 青岛：http://oss-cn-qingdao-internal.aliyuncs.com
    // 深圳：http://oss-cn-shenzhen-internal.aliyuncs.com
    // 香港：http://oss-cn-hongkong-internal.aliyuncs.com
    endpoint: 'http://oss-cn-hangzhou.aliyuncs.com',
    // 这是 oss sdk 目前支持最新的 api 版本, 不需要修改
    apiVersion: '2013-10-15'
  });
};
