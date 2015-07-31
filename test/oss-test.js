var ALY = require('aliyun-sdk');
var oss = new ALY.OSS({
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

var fs = require('fs');
var options = {
  Bucket: 'petrojs-receipt',
  Key: 'sample.jpg',
}

describe('# OSS', function() {
  it('## should success putObject', function(done) {
    this.timeout(50000)
    fs.readFile('test/fixtures/'+options.Key, function (err, data) {
      if (err) return done(err);

      oss.putObject({
          Bucket: options.Bucket,
          Key: options.Key,                 // 注意, Key 的值不能以 / 开头, 否则会返回错误.
          Body: data,
          AccessControlAllowOrigin: '',
          ContentType: 'image/jpeg',
          CacheControl: 'no-cache',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9
          ContentDisposition: '',           // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1
          ContentEncoding: '',         // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.11
          ServerSideEncryption: 'AES256'
          // Expires: ''                       // 参考: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.21
        },
        function (err, data) {

          if (err) return done(err);

          console.log('success:', data);
          
          done();

        });
    });
  });
  
  it('## should success getSignedUrl', function(done) {
    var url = oss.getSignedUrl('getObject', {
      Bucket: options.Bucket,
      Key: options.Key,
      Expires: 60
    });
    
    console.log(url);
    
    done();
  });
  
  it.skip('## should success getObject', function(done) {
    
    oss.getObject({
      Bucket: options.Bucket,
      Key: options.Key
      //Range: '',
      //IfModifiedSince: '',
      //IfUnmodifiedSince: '',
      //IfMatch: '',
      //IfNoneMatch: '',
      //ResponseContentType: '',
      //ResponseContentLanguage: '',
      //ResponseExpires: '60',
      //ResponseCacheControl: '',
      //ResponseContentDisposition: '',
      //ResponseContentEncoding: ''
    },
    function (err, data) {

      if (err) done(err);

      console.log('success:', data);

      done();
    });
  });
});
