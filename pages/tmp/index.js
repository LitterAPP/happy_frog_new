// pages/tmp/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userinfo')
    wx.showModal({
      title: '主体升级通知',
      content: '为了更好的服务于您，小程序由个人主体迁移到企业主体，请点击确定前往！',
      showCancel:false,
      confirmText:'确定',
      success:function(res){
        if (res.confirm) {
           wx.navigateToMiniProgram({
             appId: 'wx415d725aa7a75c7e',
             extraData: {
               userId: userInfo.id,
               session: userInfo.session
             }
           })
        }  
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})