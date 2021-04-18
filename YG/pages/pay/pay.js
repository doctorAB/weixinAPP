/**
 * 1 页面加载
 *  1 从缓存获取数据 渲染
 *    这些数据的checked必须为true
 * 2 微信支付 需要开通
 * 3 支付按钮
 *  1 先判断缓存中有没有token
 *  2 没有 跳转到授权页面 进行获取token
 *  3 创建订单
 *  4 获取订单编号
 *  5 删除缓存中 已经被选中了的商品
 *  6 手动删除
 *  7 跳转页面
 * 
*/

import {showModal,showToast,requestPayment} from "../../utils/index.js";
import{ requset } from "../../request/index.js";
Page({
  data:{
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },

  onShow(){
    // 1 获取缓存中的收获地址信息
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart")||[];
    // 过滤购物车
    cart = cart.filter(v=>v.checked);
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num*v.goods_price; 
      totalNum += v.num;
    });
    this.setData({
      address,
      cart,
      totalNum,
      totalPrice
    });
    wx.setStorageSync("cart", cart);
  },
  // 点击结算
  async handlePay(){
    // 判断收货地址
    const {address,totalNum}=this.data;
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    if(totalNum === 0){
      await showToast({title:"您还没有选购商品"});
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/pay'
    });
  },
  // 点击支付
  async handleOrderPay(){
    // 判断缓存中有没有token
    const token = wx.getStorageSync("token");
    // 判断
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/auth'
      });
      return;
    }
    // console.log("已经存在token");
    // 创建订单
    // 1 准备 请求头参数
    // const header = {Authorization:token};
    // 2 准备 请求体参数
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address.all;
    const cart = this.data.cart;
    let goods = [];
    cart.forEach(v=>goods.push({
      goods_id:v.goods_id,
      goods_number:v.num,
      goods_price:v.goods_price
    }));
    // 判断是否有物品
    if(goods.length == 0){
      await showToast({title:"未选购商品"});
      return;
    }
    const orderParams = {order_price,consignee_addr,goods};
    // 4 准备发送请求
    let res1 = await requset({url:"https://api-hmugo-web.itheima.net/api/public/v1/my/orders/create",method:"POST",data:orderParams});
    // 记录当前时间
    const date = new Date();
    const time_year = date.getFullYear();
    const time_mouth = date.getMonth();
    const time_day = date.getDay();
    const time_hours = date.getHours();
    const tme_minutes = date.getMinutes();
    const time_seconds = date.getSeconds();
    const time_time = date.getTime();
    // 没有开通商家服务，这里为空 自定义一个值 来模拟这个过程
    res1 = {
      "orders":
      {
        "order_id": wx.getStorageSync("order_id")+1,
        "user_id": wx.getStorageSync("user_id"),
        // getTime需要注意表示的含义
        "order_number": "xiaoliu"+time_year+time_mouth+time_day+time_hours+tme_minutes+time_seconds,
        "order_price": order_price,
        "order_pay": "0",
        "is_send": "否",
        "trade_no": "",
        "order_fapiao_title": "个人",
        "order_fapiao_company": "",
        "order_fapiao_content": "",
        "consignee_addr": consignee_addr,
        "pay_status": "1",
        "create_time": time_time,
        "update_time": time_time,
        "order_detail": null,
        "goods":
        {
          "id": 717,
          "order_id": 428,
          "goods_id": 43986,
          "goods_price": 13999,
          "goods_number": 1,
          "goods_total_price": 13999,
          "goods_name": "海信(Hisense)LED55MU9600X3DUC 55英寸 4K超高清量子点电视 ULED画质 VIDAA系统",
          "goods_small_logo": "http://image5.suning.cn/uimg/b2c/newcatentries/0000000000-000000000160455569_1_400x400.jpg"
        },
        "total_count": this.data.totalNum,
        "total_price": this.data.totalPrice
      }
    };
    // console.log(res1);
    // 更新一下模拟的值
    let old_order_id = wx.getStorageSync("order_id");
    wx.setStorageSync("order_id", old_order_id+1);
    // 将这个生成的订单信息存入缓存中，方便修改调用
    let old_order_c = wx.getStorageSync("order_c");
    old_order_c.push(res1);
    wx.setStorageSync("order_c", old_order_c);
    let {order_number} = res1.orders;
    // 5 发起预支付的接口
    let res2 =  await requset({url:"https://api-hmugo-web.itheima.net/api/public/v1/my/orders/req_unifiedorder",method:"POST",data:{order_number}});
    // 模拟返回
    res2 = {
      "pay": {
        "timeStamp": "1564730510",
        "nonceStr": "SReWbt3nEmpJo3tr",
        "package": "prepay_id=wx02152148991420a3b39a90811023326800",
        "signType": "MD5",
        "paySign": "3A6943C3B865FA2B2C825CDCB33C5304"
      },
      "order_number": order_number
    };
    let {pay} = res2;
    // console.log(pay);
    // 6 发起请求
    // 这一步会报错，不要紧，假装弹出来了
    // let res3 = await requestPayment(pay);
    const res4 = await showModal({ content: '您是否要支付'});
    // 进行操作
    if(res4.confirm){
      let old_order_f = wx.getStorageSync("order_f");
      old_order_f.push(res1);
      wx.setStorageSync("order_f", old_order_f);
    }
    else{
      let old_order_u = wx.getStorageSync("order_u");
      old_order_u.push(res1);
      wx.setStorageSync("order_u", old_order_u);
    }
    // 7 查询订单
    // 这一步会报错，不要紧，假装弹出来了
    // let res5 =  await requset({url:"https://api-hmugo-web.itheima.net/api/public/v1/my/orders/chkOrder",method:"POST",data:{order_number}});
    // 在已支付中查询
    let now_order_f = wx.getStorageSync("order_f");
    // 需查询的订单编号
    let check_order_number = order_number;
    let res6 = false;
    now_order_f.forEach(v => {
      if(v.orders.order_number == check_order_number){
        res6 = true;
        return;
      }
    });
    // 8 支付成功 跳转到订单页面
    if(res6){
      // 删除已经支付了的购物车中的商品
      let old_cart = wx.getStorageSync("cart");
      old_cart = old_cart.filter(v=>!v.checked);
      wx.setStorageSync("cart", old_cart);
      await showToast({title:"支付成功"});
      wx.navigateTo({
        url: '/pages/order/order'
      });
    }
    else{
      await showToast({title:"支付失败"});
    }
  }
})