const util = require('../../utils/util.js')
const app = getApp()
var page=1,pageSize=10
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

  moreListData: function (e) {
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () {

      })

    var that = this
    if (that.data.nomore) {
      return
    }
    that.setData({ loading: true })
    page++
    util.GET(app.globalData.host + '/Forg/listFollower', {
      session: wx.getStorageSync('session'), 
      page: page,
      pageSize: pageSize
    }, function (res) {
      if (res && res.code == 1 && res.data &&  res.data.length > 0) {
        var old = that.data.list
        for (let i in res.data) {
          old.push(res.data[i])
        }
        that.setData({ list: old })
      } else {
        that.setData({ nomore: true })
      }
      that.setData({ loading: false })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let W = wx.getSystemInfoSync().windowWidth
    let H = wx.getSystemInfoSync().screenHeight
    that.setData({W: W, H: H })
    util.checkLogin(false,function(){
      that.listFollower()
    }) 
  },

  listFollower:function(){
    var that = this
    page = 1
    pageSize = 10
    util.GET(app.globalData.host + '/Forg/listFollower', {
      session: wx.getStorageSync('session'),
      page: page,
      pageSize: pageSize
    }, function (res) {
      if (res && res.code == 1 && res.data && res.data.length > 0) {
        that.setData({ list: res.data })
      } else {
        that.setData({ nomore: true })
      }
      that.setData({ loading: false })
    })
  },

  followed: function (e) {
    var that = this
    
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { })
    util.GET(app.globalData.host + '/Forg/follow', {
      session: wx.getStorageSync('session'),
      followUserId: e.currentTarget.dataset.userid
    }, function (res) {
      if (res && res.code == 1) {
         
        if (res.data.followStatus == 1) {
          wx.showToast({
            title: '关注成功',
          })
        }
        else if (res.data.followStatus == 0) {
          wx.showToast({
            title: '关注取消',
          })
        }
        that.listFollower()
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