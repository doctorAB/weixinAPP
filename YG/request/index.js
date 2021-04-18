
// 同时发送异步代码的次数
let ajaxTimes=0;

export const requset=(params)=>{
    // 请求头自动添加
    let header = {...params.header};
    if(params.url.includes("/my/")){
        header["Authorization"] = wx.getStorageSync("token");
    }

    ajaxTimes++;
    // 显示加载中 效果
    wx.showLoading({
        title: '加载中',
        mask:true
      })

    // 定义公共的url
    //https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata
    const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            header:header,
            // 暂时先不改这部分，这些接口不一定能使用
            // url:baseUrl+params.url,
            success:(result)=>{
                resolve(result.data.message);
            },
            fail:(err)=>{
                reject(err);
            },
            complete:()=>{
                ajaxTimes--;
                if(ajaxTimes === 0){
                    //  关闭正在等待的图标
                    wx.hideLoading();
                }
            }
        });
    })
}