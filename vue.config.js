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
    }
}