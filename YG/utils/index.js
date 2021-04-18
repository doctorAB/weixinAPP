/**
 * promise 形式 showmodal
 * @param {object} param0 参数
*/
export const showModal=({content})=>{
    return new Promise((resovle,reject)=>{
      wx.showModal({
          title: '提示',
          content: content,
          showCancel: true,
          success: (result) => {
            resovle(result);
          },
          fail: (err)=>{
              reject(err);
          }
      });  
    })
}


export const showToast=({title})=>{
  return new Promise((resovle,reject)=>{
    wx.showToast({
      title: title,
      icon: 'none',
      mask: true,
      success: (result) => {
        resovle(result);
      },
      fail: (err)=>{
          reject(err);
      }
    });
  })
}


/**
 * promise 形式 login
*/
export const login=()=>{
  return new Promise((resovle,reject)=>{
    wx.login({
      timeout:10000,
      success: (result)=>{
        resovle(result);
      },
      fail: (err)=>{
        reject(err);
      }
    });
  })
}



/**
 * promise 形式 requestPayment
*/
export const requestPayment=(pay)=>{
  return new Promise((resovle,reject)=>{
   wx.requestPayment({
    ...pay,
    success: (result)=>{
    resovle(result);
    },
    fail: (err)=>{
      reject(err);
    }
   });
  })
}