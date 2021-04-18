// 0 引入 用来发送请求的 方法
import {requset} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList:[],
    // 导航 数组
    catesList:[],
    // 楼层数据
    floorList:[]
  },
  // 当前url切割
  stringNow:"",
  onLoad: function (options){
    // 1 发送异步请求获取轮播图数据 优化回调请求使用promise技术
    // 还可以继续优化
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result)=>{
    //     console.log(result);
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // });

   this.getSwiperList();
   this.getCatesList();
   this.getFloorList();
  },

  // 获取轮播图数据
  getSwiperList(){
    requset({url:'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata'})
    .then(result=>{
      this.setData({
        swiperList: result
      })
    })
  },

  // 获取分类导航数据
  getCatesList(){
    requset({url:'https://api-hmugo-web.itheima.net/api/public/v1/home/catitems'})
    .then(result=>{
      // console.log(result);
      this.setData({
        catesList: result
      })
    })
  },

  // 获得楼层数据
  getFloorList(){
    requset({url:'https://api-hmugo-web.itheima.net/api/public/v1/home/floordata'})
    .then(result=>{
      // console.log(result);
      this.setData({
        floorList: result
      })
    })
  },
  // 进行切割事件
  stringChange(e){
    let {index} = e.currentTarget.dataset;
    let arr = index.split("/");
    this.stringNow = index.replace(/main/g,arr[2])
    // console.log(this.stringNow);
    wx.navigateTo({
      url: this.stringNow
    });
  },
  // 进行文本添加
  stringChangeOther(e){
    let {index} = e.currentTarget.dataset;
    let arr1 = index.split("?");
    let arr2 = arr1[0].split("/");
    this.stringNow = arr2[0]+"/"+arr2[1]+"/"+arr2[2]+"/"+arr2[2]+"?"+arr1[1];
    // console.log(this.stringNow);
    wx.navigateTo({
      url: this.stringNow
    });
  }
})