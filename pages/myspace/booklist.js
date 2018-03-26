const util = require('../../utils/util.js')
const app = getApp()
var page = 1, pageSize = 10

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
  go: function (e) {
    var that = this
    var flag = this.data.flag
    if (e.detail.formId) {
      util.GET(app.globalData.host + '/FormId/collect',
        {
          session: wx.getStorageSync('session'),
          appId: app.globalData.appid,
          formId: e.detail.formId
        }, function () { })
    }
    if (flag == 1) {
      wx.navigateTo({
        url: '/pages/read/view?readId=' + e.currentTarget.dataset.readid,
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/index?bookId=' + e.currentTarget.dataset.bookid,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //flag=1我的朗读
    //flag=2我的收藏
    //flag=3我的足迹
    var that = this 
    let W = wx.getSystemInfoSync().windowWidth
    let H = wx.getSystemInfoSync().screenHeight 

    var flag = options.flag
    var otherUserId = options.otherUserId || 0
    that.setData({ flag: flag, otherUserId: otherUserId, W: W, H: H })
    util.checkLogin(false, function () {
      that.listBook()
    })
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
    util.GET(app.globalData.host + '/Forg/listMyspaceBooks', {
      session: wx.getStorageSync('session'),
      page: page,
      pageSize: pageSize,
      flag: that.data.flag,
      otherUserId:that.data.otherUserId
    }, function (res) {
      if (res && res.code == 1 && res.data && res.data.length > 0) {
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
  listBook: function () {
    var that = this
    page = 1   
    util.GET(app.globalData.host + '/Forg/listMyspaceBooks', {
      session: wx.getStorageSync('session'),
      page: page,
      pageSize: pageSize,
      flag: that.data.flag,
      otherUserId: that.data.otherUserId
    }, function (res) {
      if (res && res.code == 1 && res.data && res.data.length > 0) {
        that.setData({ list: res.data })
      } else {
        that.setData({ nomore: true })
      }
      that.setData({ loading: false })
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