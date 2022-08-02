$(function () {
  // 获取 layui 的 layer form 对象
  var layer = layui.layer
  var form = layui.form

  // 通过 URLSearchParams 对象，获取 URL 传递过来的参数
  var params = new URLSearchParams(location.search)
  // console.log(params)

  // 调用 URLSearchParams 对象的 get 方法 获取 id 的值
  var id = params.get('id')
  console.log(id)


  // 调用函数，渲染文章类别
  initCate()


  // 定义加载文章分类的方法
  function initCate() {
    // 发送 ajax 数据请求
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类失败！')
        }
        // 调用 template 函数，渲染文章分类的下拉菜单
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 一定记得调用 form.render() 渲染分类
        form.render()
        // 调用函数，渲染文章信息
        getArticleInfo()
      }
    })
  }

  // 根据 id 获取当前文章的信息
  function getArticleInfo() {
    // 发送 ajax 数据请求
    $.ajax({
      method: 'GET',
      url: '/my/article/' + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章失败！')
        }
        layer.msg('获取文章成功！')
        // 快速给 form 表单赋值
        form.val('form-edit', res.data)
        // 初始化富文本编辑器
        initEditor()
      }
    })
  }


  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 监听 选择封面 按钮的点击事件
  $('#btnChooseImage').on('click', function () {
    // 模拟 文件选择框 点击
    $('#coverFile').click()
  })

  // 监听 coverFile 文件选择框的 change 事件，获取用户选择的文件列表
  $('#coverFile').on('change', function (e) {
    // 获取到文件列表数组 
    var files = e.target.files
    // 判断用户是否选择了文件
    if (files.length === 0) {
      return
    }
    // 根据文件，创建对应的 URL 地址
    var newImgURL = URL.createObjectURL(files[0])
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  // 定义文章的发布状态
  var art_state = '已发布'

  // 为 存为草稿 按钮绑定点击事件处理函数
  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  })

  // 监听 form-edit 表单的 submit 事件
  $('#form-edit').on('submit', function (e) {
    // 1.阻止表单的默认提交行为
    e.preventDefault()
    // 2.基于 form 表单，快速创建一个 FormData 对象
    var fd = new FormData($('#form-edit')[0])
    // 重新获取富文本编辑器的内容
    const content = tinyMCE.activeEditor.getContent()
    // 3.将发布文章状态，追加到 fd 中
    fd.append('state', art_state)
    // 4.将裁剪好的图片，输出为文件对象
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {  // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5.将文件对象，存储到 fd 中
        fd.append('cover_img', blob)
        // 追加修改的富文本编辑器的内容到 fd 中
        fd.append('content', content)
        // 6.发送 ajax 数据请求
        uploadArticle(fd)
      })
  })

  // 定义一个发布文章的方法
  function uploadArticle(fd) {
    // 发送 ajax 数据请求
    $.ajax({
      method: 'POST',
      url: '/my/article/edit',
      data: fd,
      // 注意：如果向服务器提交的是 FormData 格式的数据，
      // 必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        // layer.msg('发布文章成功！')
        // 发布文章成功后，跳转到文章列表页面
        location.href = '/article/art_list.html'
      }
    })
  }
})