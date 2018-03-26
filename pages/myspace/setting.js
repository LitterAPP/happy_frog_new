const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  goBack: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { })

    let pages = getCurrentPages();
    console.log('getCurrentPages', pages)
    if (pages.length > 1) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.redirectTo({
        url: '/pages/list/list',
      })
      /*
      wx.switchTab({
        url: '/pages/list/list',
      })
      */
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let W = wx.getSystemInfoSync().windowWidth
    let H = wx.getSystemInfoSync().screenHeight
    that.setData({W: W, H: H })

    util.checkLogin(false, function () {       
      util.GET(app.globalData.host + '/Forg/getSetting',
        {
          session: wx.getStorageSync('session')
        }, function (res) {
          if (res && res.code == 1) {
            that.setData({ speed: res.data })
          }
        })
    })
  },
  sliderChanging:function(e){
    var that = this
    that.setData({speed:e.detail.value})
  },
  sliderChanged:function(e){
    util.GET(app.globalData.host + '/Forg/setReadSpeed',
      {
        session: wx.getStorageSync('session'),
        speed:e.detail.value
      }, function (res) {
        wx.showToast({
          title: '设置成功',
        })         
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