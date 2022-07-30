$(function () {
  // 获取 layui 的 form layer 对象
  var form = layui.form
  var layer = layui.layer

  form.verify({
    // 制定昵称填写规则
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在 1 ~ 6 个字符之间！'
      }
    }
  })

  // 调用函数，初始化用户信息
  initUserInfo()

  // 初始化用户的基本信息
  function initUserInfo() {
    // 发送 ajax 请求
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败！')
        }
        console.log(res)
        // 调用 form.val() 快速为表单赋值
        form.val('formUserInfo', res.data)
      }
    })
  }

  // 重置表单的数据
  $('#btnReset').on('click', function (e) {
    // 阻止表单的默认重置行为
    e.preventDefault()
    // 重新初始化用户信息，并赋值到表单
    initUserInfo()
  })

  // 监听表单的提交事件
  $('.layui-form').on('submit', function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 发送 ajax 数据请求
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      // 快速获取表单数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败！')
        }
        layer.msg('更新用户信息成功！')
        // 调用 index.html 这个父页面的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo()
      }
    })
  })
})