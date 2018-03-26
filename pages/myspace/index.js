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
  goRace:function(){
    wx.navigateTo({
      url: '/pages/activity/list',
    })
  },
  goSuggest:function(e){
    wx.navigateTo({
      url: '/pages/myspace/suggest',
    })
  },
  goToBookList: function(e){
      var flag = e.currentTarget.dataset.flag
      wx.navigateTo({
        url: '/pages/myspace/booklist?flag='+flag,
      })
  },
  goSetting:function(){
    wx.navigateTo({
      url: '/pages/myspace/setting',
    })
  },
  fansItemClick:function(){
    var that = this
    wx.setStorageSync('fans', that.data.data.fans)
    that.setData({ fansRedDot: false})
    wx.navigateTo({
      url: '/pages/myspace/follower',
    })
  },
  goMyFollowed:function(){
    var that = this    
    wx.navigateTo({
      url: '/pages/myspace/followed',
    })
  },
  goTotalRank:function(){
    wx.navigateTo({
      url: '/pages/myspace/totalrank',
    })
  },
  goSuggestList:function(){
    wx.navigateTo({
      url: '/pages/myspace/suggestlist',
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
     var that = this
     that.setData({ version: app.globalData.version})
     util.checkLogin(false, function () {  
       let W = wx.getSystemInfoSync().windowWidth
       let H = wx.getSystemInfoSync().screenHeight
       that.setData({ userinfo: wx.getStorageSync('userinfo'), W: W, H: H})
       util.GET(app.globalData.host + '/Forg/myspace',
         {
           session: wx.getStorageSync('session')
         }, function (res) {
            if(res && res.code == 1 ){
              that.setData({ data: res.data })
              let fans = wx.getStorageSync('fans')
              if (!fans || fans < res.data.fans){//显示fans红点 
                that.setData({fansRedDot:true,newFans:res.data.fans-fans})
              }else{
                that.setData({ fansRedDot: false})
              }
             
            }
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