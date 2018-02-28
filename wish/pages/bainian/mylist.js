import Upload from '../../../utils/upload.js'
import Download from '../../../utils/download.js'
const util = require('../../../utils/util.js')
const app = getApp()
var W, H
var player = wx.createInnerAudioContext()
player.autoplay = true
player.obeyMuteSwitch = false
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  goHome: function (e) {
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () {
        wx.navigateTo({
          url: '/pages/list/list',
        })
      })
  },

  goToSendZhufu: function (e) {
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () {
        wx.navigateTo({
          url: '/wish/pages/bainian/index',
        })
      })
  },
  sendZhufu: function (e) {
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () {
        wx.navigateTo({
          url: '/wish/pages/bainian/detail?id=' + e.currentTarget.dataset.id,
        })
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    W = wx.getSystemInfoSync().windowWidth
    H = wx.getSystemInfoSync().windowHeight
    that.setData({ W: W, H: H, itemW: W - 100, userinfo: wx.getStorageSync('userinfo') })
    app.innerAudioContext.stop()

    util.checkLogin(false, function () {
      util.GET(app.globalData.host + '/ForgNewYear/myBainianList',
        {
          session: wx.getStorageSync('session')
        }, function (res) {
          console.log(res)
          if (!res && res.code != 1) {
            util.showToast('网络错误', 'error')
          } else {
            that.setData({ list: res.data.list || [], total: res.data.total, pageShow: true })
            that.playListener()
          }
        })
    })
  },
  playVoice: function (e) {
    app.innerAudioContext.stop();
    player.stop()
    let logdown = new Download([e.currentTarget.dataset.recordurl], '')
    logdown.download(function (locals) {
      console.log('下载文件到本地播放', locals[0])
      player.src = locals[0]
      player.play()
    })
  },
  playListener: function () {
    player.onPlay(() => {
      wx.showLoading({
        title: '报福中...',
        mask: true
      })
      console.log('开始播放')
    })
    player.onEnded(() => {
      console.log('播放自动停止')
      wx.hideLoading()
    })
    player.onStop(() => {
      console.log('播放手动停止')
      wx.hideLoading()
    })
    player.onPause(() => {
      console.log('播放手动暂停')
      wx.hideLoading()
    })
    player.onError((res) => {
      console.log('播放错误', res, player.src)
      wx.hideLoading()
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
    var that = this
    util.GET(app.globalData.host + '/ForgNewYear/myBainianList',
      {
        session: wx.getStorageSync('session')
      }, function (res) {
        console.log(res)
        if (!res && res.code != 1) {
          util.showToast('网络错误', 'error')
        } else {
          that.setData({ list: res.data.list || [], total: res.data.total, pageShow: true })
        }
        setTimeout(function () {
          wx.stopPullDownRefresh()
        }, 200)
      })
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