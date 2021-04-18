/**
 * 1 页面被打开的时候 onShow
 *  0 onShow 不同于onLoad 无法在形参上接收 options参数
 *  0.5 判断缓存中有没有token
 *    1 没有直接跳转到授权页面
 *    2 有 直接往下进行
 *  1 获取url上的参数type
 *  2 根据type来决定页面标题的数组元素 那个被激活选中
 *  2 根据type 去发送请求获取订单数据
 *  3 渲染页面
 * 2 点击不同的标题 重新发送请求来获取和渲染数据
*/
import {requset} from "../../request/index.js"
Page({
  data:{
    orders:[],
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"待发货",
        isActive:false
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false
      }
    ],
  },
  onShow(){
    const token = wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }

    // 1 获取当前小程序的页面栈-数据 长度最大是10页面
    let pages =  getCurrentPages();
    // 2 数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length-1];
    // 3 获取url上的type参数
    const {type} = currentPage.options;
    console.log(type);
    // 4 激活选中的页面标题
    this.changeTitleByIndex(type-1);
    this.getOrder(type);
    
  },
  // 获取订单列表的方法
  async getOrder(type){
    const res = await requset({url:"https://api-hmugo-web.itheima.net/api/public/v1/my/orders/all",data:{type}});
    console.log("不是你的原因，这里就是为null");
    // 模拟数据获取 假设已支付的全部发货 不存在退货/退款 100%满意率
    // console.log(wx.getStorageSync("order_c").map(v=>({...v,create_time_cn:(new Date(v.orders.create_time).toLocaleString())})));
    if(type == 1){
      this.setData({
        orders:wx.getStorageSync("order_c").map(v=>({...v,create_time_cn:(new Date(v.orders.create_time).toLocaleString())}))
      }); 
    }
    else if(type == 2){
      this.setData({
        orders:wx.getStorageSync("order_u").map(v=>({...v,create_time_cn:(new Date(v.orders.create_time).toLocaleString())}))
      });
    }
    else if(type == 3){
      this.setData({
        orders:wx.getStorageSync("order_f").map(v=>({...v,create_time_cn:(new Date(v.orders.create_time).toLocaleString())}))
      });
    }
  },
  changeTitleByIndex(index){
    // 2 修改源数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 3 赋值到data中
    this.setData({
      tabs
    });
  },
  handleTabsItemChange(e){
    // 1 获取被点击的标题索引
    const {index}=e.detail;
    this.changeTitleByIndex(index);
    // 2 重新发送请求 type=1 index=0
    this.getOrder(index+1);
  },
})