Page({
  handleGetUserInfo(){
    wx.getUserProfile({
      desc: 'θ·εΎζι',
      success: (res) => {
        wx.setStorageSync("userInfo", res.userInfo);
        wx.navigateBack({
          delta: 1
        });
      }
    });
  }
})