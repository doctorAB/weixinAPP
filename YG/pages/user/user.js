Page({
  data:{
    userinfo:{},
    // 被收藏的商品的数量
    collectNums:0
  },
  onShow(){
    const userinfo = wx.getStorageSync("userInfo");
    const collect = wx.getStorageSync("collect")||[];

    this.setData({userinfo,collectNums:collect.length});
  }
})