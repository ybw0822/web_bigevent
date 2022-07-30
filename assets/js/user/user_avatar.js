$(function () {
  // 获取 layui 的 layer 对象
  var layer = layui.layer

  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  // 为上传按钮绑定点击事件
  $('#btnChooesImage').on('click', function () {
    // 人为模拟 文件选择框 点击事件
    $('#file').click()
  })

  // 监听文件选择框的 change 事件
  $('#file').on('change', function (e) {
    // console.log(e.target.files)
    // 获取用户选择的文件列表
    var filelist = e.target.files
    // 判断用户选择文件列表长度
    if (filelist.length === 0) {
      return layer.msg('请选择照片！')
    }

    // 1.拿到用户选择的文件
    var file = e.target.files[0]
    // 2.将文件转化为路径
    var imgURL = URL.createObjectURL(file)
    // 3.销毁原图片，再设置新的图片路径并重新初始化裁剪区域
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', imgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  // 为确定按钮绑定点击事件
  $('#btnUpload').on('click', function () {
    // 1.拿到用户裁剪之后的头像
    var dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')  // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

    // 2.调用接口，把头像传到服务器并渲染到页面（更新头像）
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新头像失败！')
        }
        layer.msg('更新头像成功！')
        // 调用 index.html 这个父页面的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo()
      }
    })
  })

})