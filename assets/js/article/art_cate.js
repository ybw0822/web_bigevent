$(function () {
  // 导入 layui 的 layer form 对象
  var layer = layui.layer
  var form = layui.form

  // 调用函数，初始化文章分类的列表
  initArtCateList()

  // 获取文章分类的列表
  function initArtCateList() {
    // 发送 ajax 数据请求
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        // console.log(res)
        // 调用 template 函数，获取数据字符串
        var htmlStr = template('tpl-table', res)
        // 渲染数据
        $('tbody').html(htmlStr)
      }
    })
  }

  // 为添加类别按钮绑定点击事件
  // 定义全局变量
  var indexAdd = null
  $('#btnAddCate').on('click', function () {
    // 调用 layer.open() 方法，实现弹出层效果
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  // 通过代理的形式，为 form-add 表单绑定 submit 事件
  $('body').on('submit', '#form-add', function (e) {
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 发送 ajax 数据请求
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        console.log(res)
        if (res.status !== 0) {
          return layer.msg('新增文章分类失败！')
        }
        // 成功，调用函数，重新渲染列表数据
        initArtCateList()
        layer.msg('新增文章分类成功！')
        // 调用 layer.close() 方法，根据索引，关闭弹出层
        layer.close(indexAdd)
      }
    })
  })

  // 通过代理的形式，为 btn-edit 按钮绑定点击事件
  // 定义全局变量
  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    // 调用 layer.open() 方法，实现弹出层效果
    // 弹出一个修改文章分类信息的层
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })

    // 获取到数据对应的 Id 值
    var id = $(this).attr('data-id')
    // console.log(id)
    // 发送 ajax 数据请求
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        // console.log(res)
        // 调用 form.val() 快速为表单赋值
        form.val('form-edit', res.data)
      }
    })
  })

  // 通过代理的形式，为修改分类的表单绑定 submit 事件
  $('body').on('submit', '#form-edit', function (e) {
    // 阻止表单默认的提交行为
    e.preventDefault()
    // 发送 ajax 数据请求
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新分类数据失败！')
        }
        layer.msg('更新分类数据成功！')
        // 关闭弹出层
        layer.close(indexEdit)
        // 重新渲染分类列表数据
        initArtCateList()
      }
    })
  })

  // 通过代理的形式，为删除按钮绑定点击事件
  $('tbody').on('click', '.btn-delete', function () {
    // 获取对应数据的 id
    var id = $(this).attr('data-id')
    // 提示用户是否要删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      // 发送 ajax 数据请求
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除分类失败！')
          }
          layer.msg('删除分类成功！')
          // 关闭弹出层
          layer.close(index)
          // 重新渲染分类列表
          initArtCateList()
        }
      })

    })
  })
})