// pages/cart/cart.js
/**
 * 1 获取用户的收货地址
 *  1 绑定点击事件
 *  2 调用小程序内置 api 获取用户的收获地址 wx.chooseAddress
 * 2 页面加载完毕
 *  0 onLoad onShow
 *  1 获取本地存储中的地址数据
 *  2 把数据 设置给data中的一个变量
 * 3 onShow
 *  0 在商品详情页面中 手动添加属性
 *    1 num = 1
 *    2 checked = true
 *  1 获取缓存中的购物车数组
 *  2 把购物车数据 填充到data中
 * 4 全选
 *  1 onShow 获取缓存中的购物车数组
 *  2 根据购物车中商品数据 所有的商品都被选中
 * 5 总价格和总数量
 *  1 需要商品都被选中
 *  2 获取购物车数组
 *  3 遍历
 *  4 判断商品是否被选中
 *  5 进行计算
 * 6 商品的选中功能
 *  1 绑定change事件
 *  2 获取被修改的商品对象
 *  3 商品对象的选中状态 取反
 *  4 重新填充回data和缓存中
 *  5 重新计算
 * 7 全选和反选
 *  1 全选复选框绑定事件 change
 *  2 获取 data中的全选变量 allChecked
 *  3 直接取反
 *  4 更改选中状态
 *  5 更新数据
 * 8 商品数量编辑
 *  1 "+" 和 "-" 绑定同一个点击事件
 *  2 传递被点击的商品 id
 *  3 获取data中购物车数组 来获取需要被修改的商品对象
 *  4 直接修改商品对象的数量 num
 *  4 当购物车的数量为1 同时 用户点击"-" 弹窗提示 询问用户是否删除
 *  5 更新数据
 * 9 结算按钮
 *  1 判断收获地址
 *  2 判断选购商品
 *  3 跳转支付界面
*/
import {showModal,showToast} from "../../utils/index.js";

Page({
  data:{
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },

  onShow(){
    // 1 获取缓存中的收获地址信息
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart")||[];
    
    this.setData({
      address
    });
    this.setCart(cart);
  },
  // 点击 收获地址
  handleChooseAddress(){
    // console.log("test");
    // 获取收获地址
    wx.chooseAddress({
      success: (result)=>{
        // console.log(result);
        let address = result;
        address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo;
        // 放入缓存中
        wx.setStorageSync("address", address);
      }
    });
  },
  // 商品的选中
  handleItemChange(e){
    // 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    // console.log(goods_id);
    // 获取购物车数组
    let {cart} = this.data;
    // 找到被修改的商品对象
    let index = cart.findIndex(v=>v.goods_id === goods_id);
    cart[index].checked = !cart[index].checked;
    
    this.setCart(cart);
  },
  // 设置购物车状态同时 重新计算 底部工具栏数据 全选 总价格 购买的数量
  setCart(cart){
    // 计算全选
    let allChecked = true&&cart.length != 0;
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if(v.checked){
        totalPrice += v.num*v.goods_price; 
        totalNum += v.num;
      }
      else{
        allChecked = false;
      }
    });
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    });
    wx.setStorageSync("cart", cart);
  },
  // 商品全选
  handleItemAllChecked(){
    // 获取data中的数据
    let {cart,allChecked} = this.data;
    // 修改值
    allChecked = !allChecked;
    // 循环修改
    cart.forEach(v=>v.checked = allChecked);
    // 更新值
    this.setCart(cart);
  },
  // 商品数量编辑
  async handleItemNumEdit(e){
    // 获取参数
    const {operation,id} = e.currentTarget.dataset;
    // console.log(operation,id);
    let {cart} = this.data;
    const index = cart.findIndex(v=>v.goods_id === id);
    if(cart[index].num === 1&&operation === -1){
      const result = await showModal({ content: '您是否要删除'})
      if(result.confirm){
        cart.splice(index,1);
        this.setCart(cart);
      }
    }
    else{
      cart[index].num += operation;
      this.setCart(cart);
    }
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
  }
})