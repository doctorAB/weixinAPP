/**
 * 1 输入框绑定 值改变事件 input事件
 *  1 获取到输入框的值
 *  2 合法性判断
 *  3 检验通过 把输入框的值 发送到后台
 *  4 返回的数据打印到页面上
 * 2 防抖 （防止抖动） 定时器 节流
 *  0 防抖 一般 输入框 防止重复输入 重复发送请求
 *  0 节流 一般是用在页面下拉和上拉
 *  1 定义全局的定时器 id
*/
import {requset} from "../../request/index.js"
Page({
  data:{
    goods:[],
    // 取消 按钮 是否显示
    isFocus:false,
    // 输入框的值
    inpValue:""
  },
  TimeId:-1,
  // 输入框的值改变 就会触发的事件
  handleInput(e){
    // console.log(e);
    // 1 获取输入框的值
    const {value} = e.detail;
    // 2 检测合法性
    if(!value.trim()){
      // 值不合法
      this.setData({
        goods:[],
        isFocus:false
      });
      return;
    }
    // 3 准备发送请求获取数据
    this.setData({
      isFocus:true
    });
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(()=>{
      this.qsearch(value);
    },10000);
    this.qsearch(value);
  },
  async qsearch(query){
    const res = await requset({url:"https://api-hmugo-web.itheima.net/api/public/v1/goods/qsearch",data:{query}});
    // console.log(res);
    this.setData({
      goods:res
    });
  },
  handleCancel(){
    this.setData({
      inpValue:"",
      isFocus:false,
      goods:[]
    });
  }
})