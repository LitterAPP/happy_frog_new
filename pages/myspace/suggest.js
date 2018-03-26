import Upload from '../../utils/upload.js'
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
    if (e.detail.formId){
      util.GET(app.globalData.host + '/FormId/collect',
        {
          session: wx.getStorageSync('session'),
          appId: app.globalData.appid,
          formId: e.detail.formId
        }, function () { })
    } 

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
  getSuggestContent: function (e) {
    var that = this
    that.suggestContent =  e.detail.value
  },
  suggestImgChanged: function (e) {
    console.log(e.detail)
    var that = this
    that.imgs = e.detail
  },
  suggestCommit:function(e){
    var that  = this
    if (!that.suggestContent || that.suggestContent.length === 0) {
      util.showToast('请输入反馈内容', 'error')
      return
    }
    wx.showLoading({
      title: '提交中...',
      mask: true
    })

    var uploadUrl = app.globalData.host + '/Upload/uploadFile'
    var uploadTmps = (that.imgs && that.imgs.length == 1) ? [that.imgs[0].logo]:[]
    let coverUploadTask = new Upload(uploadTmps)
    coverUploadTask.upload(uploadUrl, function (keys0) {
      var img = (keys0 && keys0.length == 1 && keys0[0]) ? keys0[0]:''
      util.GET(app.globalData.host + '/Forg/commitSuggest',
        {
          session: wx.getStorageSync('session'),
          content: that.suggestContent,
          img: img,
          formId: e.detail.formId
        }, function (res) {
          if (res && res.code == 1) {
           util.showWindow('感谢反馈', '我们将通过微信服务通知您处理结果，请留意查收！', false, function(){
             that.goBack()
           }, function(){})
          } else  {
            util.showToast('提交失败', 'error')
          }
          setTimeout(function () { wx.hideLoading() }, 800)
        })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      W: wx.getSystemInfoSync().windowWidth})
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