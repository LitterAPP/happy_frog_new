const util = require('../../utils/util.js')
const app = getApp()
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
    var that = this
    var actId =  options.actId || 0
    var W = wx.getSystemInfoSync().windowWidth
    var H = wx.getSystemInfoSync().windowHeight

    that.setData({ W: W, H: H })

    util.checkLogin(false, function () {
      util.GET(app.globalData.host + '/Forg/listRank',
        {
          session: wx.getStorageSync('session'),
          actId: actId
        },
        function (res) {
          if (res && res.code == 1 && res.data) {
            that.setData({ selfRank: res.data.selfRank, rankTop: res.data.rankTop, rankList: res.data.rankList})
          } else {
            util.showToast('没有数据', 'info')
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