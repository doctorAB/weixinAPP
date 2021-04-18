Page({
  handleGetUserInfo(){
    wx.getUserProfile({
      desc: '获得权限',
      success: (res) => {
        wx.setStorageSync("userInfo", res.userInfo);
        wx.navigateBack({
          delta: 1
        });
      }
    });
  }
})