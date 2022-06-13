const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
    // pabulicPath:process.env.NODE_ENV === 'production' ? '' : '',
    devServer:{
        host:'0.0.0.0',
        port:'8089',
        // https:false,
        open:true,
        //以上的ip和端口是我们本机的;下面为需要跨域的
        proxy:{ //配置跨域
            '/api':{
                target:'http://127.0.0.1:8088',
                ws:true,
                changeOrigin:false,//允许跨域
                pathRewrie:{
                    '^/api':''   //请求的时候使用这个api就可以
                }
            }
        }
    },
    // //set第一个参数：设置的别名，第二个参数：设置的路径
    // chainWebpack: config=>{
    //     //修改文件引入自定义路径
    //     config.resolve.alias
    //         .set('@', resolve('src'))
    //         .set('assets', resolve('src/assets'))
    // }



    // chainWebpack: (config) => {
    //     // set第一个参数：设置的别名，第二个参数：设置的路径
    //     config.resolve.alias.set('@', resolve('src'));
    // }

    //配置路径别名
  configureWebpack: {
    resolve: {
      alias: {
        assets: "@/assets",
        common: "@/common",
        utils: "@/utils",
        components: "@/components",
        network: "@/network",
        views: "@/views"
      }
    }
  }

};