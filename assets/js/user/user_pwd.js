$(function () {
  // 导入 layui 的 form 对象
  var form = layui.form

  // 创建自定义的密码校验规则
  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    samePwd: function (value) {
      // value 是 samePwd 给到校验的 input 的值
      // 对新旧密码进行一起等于判断
      if (value === $('[name=oldPwd]').val()) {
        return '新旧密码不能相同！'
      }
    },
    rePwd: function (value) {
      // value 是 samePwd 给到校验的 input 的值
      // 对新密码和确认密码框的值进行判断
      if (value !== $('[name=newPwd]').val()) {
        return '两次密码不一致！'
      }
    }
  })

  // 监听表单的提交事件
  $('.layui-form').on('submit', function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 发送 ajax 数据请求
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg('更新密码失败！')
        }
        layui.layer.msg('更新密码成功！')
        // 重置表单，先转为 DOM 元素，再调用 reset() 方法重置
        $('.layui-form')[0].reset()
      }
    })
  })
})