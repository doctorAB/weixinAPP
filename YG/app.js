wx-App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    // 定义一个全局变量 用来模拟创建订单 在程序创建的时候放入本地缓存中
    wx.setStorageSync("order_id", 0);
    wx.setStorageSync("user_id", 9527);
    // 创建订单
    wx.setStorageSync("order_c", []);
    // 已支付订单
    wx.setStorageSync("order_f", []);
    // 未支付订单
    wx.setStorageSync("order_u", []);
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
