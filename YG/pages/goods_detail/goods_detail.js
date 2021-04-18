/**
 * 1 发送请求数据
 * 2 点击轮播 预览大图
 *    1 给轮播图绑定点击事件
 *    2 调用小程序的api，previewImage
 * 3 点击 加入购物车
 *    1 先绑定点击事件
 *    2 获取缓存中的购物车数据 数组格式
 *    3 先判断 当前的商品是否已经存在于购物车
 *    4 已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组 填充回缓存中
 *    5 不存在于购物车的数组中 直接给购物车添加一个新元素 新元素 带上 购买数量属性 num 重新把购物车数组 填充回缓存中
 *    6 弹出提示
 * 4 商品收藏
 *  1 页面onShow的时候 加载缓存中的商品收藏的数据
 *  2 判断当前商品是不是被收藏
 *    1 是 改变页面的图标
 *    2 不是 。。。
 *  3 点击商品收藏按钮
 *    1 判断该商品是否存在于缓存数组中
 *    2 已经存在 把商品删除
 *    3 没有存在 把商品删除
*/
import {requset} from "../../request/index.js"
import {showToast} from "../../utils/index.js"
// pages/goods_detail/goods_detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 有一些不要的信息，需要优化
    goodsObj:{},
    isCollect:false
  },

  // 商品对象
  GoodsInfo:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow:function(){
    let pages =  getCurrentPages();
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;
    let {goods_id} = options;
    this.getGoodsDetail(goods_id);
    
  },
  onLoad: function (options) {
    const {goods_id}=options;
    // console.log(goods_id);
    this.getGoodsDetail(goods_id);
  },

  // 获取商品的详情数据
  async getGoodsDetail(goods_id){
    const goodsObj=await requset({
      url:"https://api-hmugo-web.itheima.net/api/public/v1/goods/detail",
      data:{goods_id}
    });
    this.GoodsInfo = goodsObj;
    // console.log(res);
    // 1 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect")||[];
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        // iphone部分手机，不识别 webp图片格式
        // 最好后台改
        // 临时改 确保后台存在1.webp => 1.jpg
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      },
      isCollect
    })
  },

  // 点击轮播图 放大预览
  handlePreviewImage(e){
    // console.log("预览");
    // 1 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid);
    // 2 接收传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      // current: 'urls[0]',
      // urls: urls,
      current,
      urls
    });
  },
  
  // 点击 加入购物车
  handleCartAdd(){
    // console.log("test");
    // 1 获取缓存中的购物车 数组 
    let cart = wx.getStorageSync("cart")||[];
    // 2 判断 商品对象是否存在于购物车
    let index = cart.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id)
    if(index == -1){
      // 不存在
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    }
    else{
      // 已经存在于购物车数据 执行 num++
      cart[index].num++;
    }
    // 3 把购物车重新添加回缓存中
    wx.setStorageSync("cart",cart);
    // 4 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      duration: 1500,
      mask: true
    });
  },
  // 立即购买直接跳转到付款页面 做简单一点
  handleBuy(){
    // 将物品加入到缓存中
    this.GoodsInfo.num = 1;
    this.GoodsInfo.checked = true;
    let cart = [];
    cart.push(this.GoodsInfo);
    wx.setStorageSync("cart", cart);
    wx.navigateTo({
      url: '/pages/pay/pay'
    });
  },
  async handleCollect(){
    let isCollect = false;
    // 1 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect")||[];
    // 2 判断该商品是否被收藏过
    let index = collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    // 3 当index! = -1表示 已经收藏过
    if(index !== -1){
      // 能找到 已经收藏过了 在数组中删除该商品
      collect.splice(index,1);
      isCollect = false;
      await showToast({title:"取消收藏"});
    }
    else{
      // 没有收藏过
      collect.push(this.GoodsInfo);
      isCollect = true;
      await showToast({title:"收藏成功"});
    }
    // 4 把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    // 5 修改data中的属性 isCollect
    this.setData({
      isCollect
    });
  }
})