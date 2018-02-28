const util = require('../../utils/util.js')
const app = getApp()
var W , H
var page=1,pageSize=10
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  itemClick:function(e){
    var that = this
    var bookId = e.currentTarget.dataset.bookid
    var actId = e.currentTarget.dataset.actid
    var status = e.currentTarget.dataset.status
    var rank = e.currentTarget.dataset.rank
    if(status == 0){//已结束,查看排行榜
      if(rank==1){
        wx.navigateTo({
          url: '/pages/activity/rank?actId=' + actId,
        })
      }else{
        util.showToast('榜单生成中','info')
      }
      
    }else if(status == 1){//跳转到详情页面参与比赛呗
      wx.navigateTo({
        url: '/pages/index/index?bookId='+bookId,
      })
    }
  },


  showActivity: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () {
        
      })
    
    that.setData({ showActivity:true})
    
  },
  goActivityList: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () {

      })

  },
  closeActivity: function (e) {
    var that = this
    util.GET(app.globalData.host + '/FormId/collect',
      {
        session: wx.getStorageSync('session'),
        appId: app.globalData.appid,
        formId: e.detail.formId
      }, function () {

      })
    that.setData({ showActivity: false })
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    W = wx.getSystemInfoSync().windowWidth
    H = wx.getSystemInfoSync().windowHeight

    that.setData({W:W,H:H})

    util.checkLogin(false, function () {
      util.GET(app.globalData.host + '/Forg/listActivity',
        {
          session: wx.getStorageSync('session'),
          page: page,
          pageSize: pageSize
        },
        function (res) {
          if (res && res.code == 1 && res.data){
              that.setData({list:res.data})
          }else{
            util.showToast('没有数据','info')
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
    var that = this
    page = page+1
    util.GET(app.globalData.host + '/Forg/listActivity',
      {
        session: wx.getStorageSync('session'),
        page: page,
        pageSize: pageSize
      },
      function (res) {
        if (res && res.code == 1 && res.data) {
          var old = that.data.list
          for(var i in res.data){
            old.push(res.data[i])
          }
          that.setData({ list: old})
        } else {
         // util.showToast('没有更多', 'info')
        }
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})