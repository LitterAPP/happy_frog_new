import Upload from '../../utils/upload.js'
const util = require('../../utils/util.js')
const backgroundMusic = require('../../utils/backgroundMusic.js')
const app = getApp()
var page = 1, pageSize = 5, hotOrLast = 0
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bar:2
  },

  barSelect: function (e) {   
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { })

    let bar = e.currentTarget.dataset.bar

    if (bar == 2) {
      page = 1
      that.reflush()
    } else if (bar == 1) {
      wx.redirectTo({
        url: '/pages/list/list',
      })
    }
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
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var W = wx.getSystemInfoSync().windowWidth
    var H = wx.getSystemInfoSync().screenHeight
    that.setData({ W: W, H: H })
    util.isApproved(function (isApproved) {
      that.setData({ isApproved: isApproved })
    })

    util.checkLogin(false, function () {
      that.reflush()
    })
  },
  goSendMoment:function(e){
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () { })
    wx.redirectTo({
      url: '/pages/create/moment',
    })
  },
  goDetail:function(e){
    wx.navigateTo({
      url: '/pages/index/index?bookId='+e.currentTarget.dataset.bookid,
    })
  },
  listMoreDatas:function(){
    var that = this
    if(that.data.nomore){
      return
    }
    page = page+1
    that.setData({ loading: true })
    util.GET(app.globalData.host + '/Forg/listBooks_new',
      {
        session: wx.getStorageSync('session'),
        hotOrLast: hotOrLast,
        page: page,
        pageSize: pageSize
      },
      function (res) {
        that.setData({ loading: false })
        if (res && res.code == 1) {
          var books = res.data
          var total = res.data.total
          var totalPage = Math.ceil(total / pageSize)
          if (page > totalPage) {
            that.setData({ nomore: true })
          }
          var old = that.data.list
          if (res.data.list && res.data.list.length>0){
            for (var i in res.data.list){
              old.push(res.data.list[i])
            }
            that.setData(
              {
                list: old,
                nothing: false,
                pageshow: true
              })
          }
         
        }
      })
  },
  reflush: function () {
    var that = this
    page=1
    that.setData({ reloading : true,nomore:false})
    util.GET(app.globalData.host + '/Forg/listBooks_new',
      {
        session: wx.getStorageSync('session'),
        hotOrLast: hotOrLast,         
        page: page,
        pageSize: pageSize
      },
      function (res) {
        that.setData({ reloading: false })
        if (res && res.code == 1) {
          var books = res.data
          var total = res.data.total
          var totalPage = Math.ceil(total/pageSize)
          if (page > totalPage){
            that.setData({ nomore: true, nodatas:true})
          }
          that.setData(
          {
              list: res.data.list,
              nothing: false,
              pageshow: true
          })
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