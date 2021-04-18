import { login } from "../../utils/index.js";
import { requset } from "../../request/index.js";
Page({
  // 获取用户数据
  async handleGetUserInfo(e){
    try {
      // console.log(e);
      // 1 获取用户信息
      const {encryptedData, rawData, iv, signature} = e.detail;
      // 2 获取小程序登录成功后的code
      const {code} = await login();
      const loginParams = {encryptedData, rawData, iv, signature};
      // console.log(code);
      // 发送请求获取用户的token值
      const res = await requset({url:"https://api-hmugo-web.itheima.net/api/public/v1/my/orders/req_unifiedorder",data:loginParams,mothod:"post"});
      // console.log(res);
      // 4 token存入缓存 跳转上一个页面
      wx.setStorageSync("token", token);
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
      //提示错误仍然返回
      console.log("没有获得token，不是你的原因");
      // 存入一个假的token
      wx.setStorageSync("token", "no moneny,no moneny");
      wx.navigateBack({
        delta: 1
      });
    }
  }
})