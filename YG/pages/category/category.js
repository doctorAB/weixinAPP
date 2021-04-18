import {requset} from "../../request/index.js"
// pages/category/category.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList:[],
    // 右侧的商品数据
    rightContent:[],
    // 被点击的左侧菜单
    currentIndex:0,
    // 右侧内容的滚动条
    scrollTop:0
  },

  // 接口的返回数据
  Cates:[],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 0 web中的本地存储和 小程序中的本地存储的区别
      // 1 写代码的方式不一样
      // web: localStorage.setItem("key","value")
      //      localStorage.getItem("key")
      // wexin: setStorageSync("key","value")
      //        getStorageSync("key")
      // 2 存的时候 有没有做类型转换
      // web: 不管存入的是什么类型的数据，最终都会先调用一下toString(),把数据变成了字符串 再存入进去
      // wexin: 不存在 类型转换的这个操作 存什么类型的数据进去，获取的时候就是什么类型
    // 1 先判断一下本地存储中有没有旧的数据
    // {TimeRanges:DataCue.now(),data:[...]}
    // 2 没有旧数据 直接发送请求
    // 3 有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可


    // this.getCates();

    // 1 获取本地存储中的数据 （小程序中也是存在本地存储技术的）
    const Cates=wx.getStorageSync("cates");
    // 2 判断
    if(!Cates){
      // 不存在 发送请求数据
      this.getCates();
    }
    else{
      // 有旧的数据 定义过期时间 10s 改成5分钟
      if(Date.now()-Cates.time>1000*10){
        // 重新发送请求
        this.getCates();
      }
      else{
        // 可以使用旧的数据
        // console.log("可以使用旧的数据");
        this.Cates=Cates.data;

        // 构造左侧的大菜单数据
        let leftMenuList=this.Cates.map(v=>v.cat_name);
        // 构造右侧的商品数据
        let rightContent=this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },

  // 获取分类数据
   async getCates(){
    // requset({url:"https://api-hmugo-web.itheima.net/api/public/v1/categories"})
    // .then(res =>{
    //   this.Cates=res.data.message;

    //   // 把接口数据存到本地存储中
    //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});

    //   // 构造左侧的大菜单数据
    //   let leftMenuList=this.Cates.map(v=>v.cat_name);
    //   // 构造右侧的商品数据
    //   let rightContent=this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    // 1 使用es7的async await来发送请求
    const res = await requset({url:"https://api-hmugo-web.itheima.net/api/public/v1/categories"})
    // this.Cates=res.data.message;
    this.Cates=res;

    // 把接口数据存到本地存储中
    wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});

    // 构造左侧的大菜单数据
    let leftMenuList=this.Cates.map(v=>v.cat_name);
    // 构造右侧的商品数据
    let rightContent=this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
    

  },

  // 左侧菜单的点击事件
  handleItemTap(e){
    // 1 获取被点击的标题身上的索引
    // 2 给data中的currentIndex赋值就可以了
    // 3 根据不同的索引来渲染右侧的商品内容

    const {index}=e.currentTarget.dataset;
    this.setData({
      currentIndex:index
    })
    let rightContent=this.Cates[index].children;
    this.setData({
      rightContent,
      // 重新设置 右侧内容的scroll-view标签的距离顶部的距离
      scrollTop:0
    })

    

  }
})