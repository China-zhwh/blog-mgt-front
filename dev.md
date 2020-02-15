智慧校园 - 前端开发手册
---

工程基于 `Ant Design Pro 2.2.1`

## 工程参考文档


- AndD Pro预览：http://preview.pro.ant.design
- 使用文档：http://pro.ant.design/docs/getting-started-cn
- 常见问题：http://pro.ant.design/docs/faq-cn
- dva官方：https://dvajs.com
- umijs官方：https://umijs.org/zh/guide/
- momentjs：http://momentjs.cn



## 工程相关

> `src/pages/.umi`是 umi dev 时产生的临时目录，系统的初始化代码在此，包括model的注册等，不需要修改

> `src/models/**/*.js` 为 global model，除非确定为共享的，请不要修改。

> `src/pages/**/models/**/*.js` 为 page model，开发一般页面使用。

> global model 全量载入，page model 在 production 时按需载入，在 development 时全量载入

> `dva-loading` 自动注册并初始化了，所以可以直接使用，相关使用方法[请参考这里](https://www.jianshu.com/p/fd41c3383978)

> `global.less`是全局样式，请在需要时修改，*开发单个功能不需要修改*。

> UMI内置了查询参数解析   
> URL的查询字符串/foo?bar=baz，可以用this.props.location.query.bar获取  
> URL中内嵌的参数的情况/foo/:bar，可以用this.props.match.params.bar获取



## 开始开发

### Git



安装Git

设置提交用户名

```
$ git clone http://{你的用户名}@192.168.3.213:9999/r/smart-edu/base-front.git 
$ git config user.name “你的名字全拼”
$ git config user.email "这个随意"
$ git config --list
```

### 启动（开发模式）

使用命令行
```
$ npm install       # yarn
                    # 安装第三方应用
$ npm start         # yarn start  
                    # 访问 http://localhost:8000
```

### 如何开发一个（组）页面

为了方便开发时参考，`andt pro`提供的页面、菜单均没有删除，请在开发时，尽量仿照已有的代码模式，**最好的学习从模仿开始** 。

一个（组）页面通常指一个功能性菜单所包含的页面，或是业务功能高度相关的页面组。

**开发步骤：**

1. 在`src/pages`目录下建立要开发的页面（组）的文件夹(起个英文名、驼峰命名)。
2. 在上步建立的文件夹下，建立页面js文件（一个页面一个js,驼峰命名），以及对应的less样式文件。
3. 将页面注册至`router.config.js`文件中（注意保持队形，修改完及时提交，避免merge），至此应该可以在左侧菜单中看到你的页面。
4. 在页面组文件夹下建立`model.js`，用于创建model。如果需要建立多个model请先建立model文件夹，然后在文件夹下建立多个model的js文件（可任意起名字）
5. 在页面组文件夹下建立`service.js`，用于调用后端的rest api，为了统一，每个页面（组）只能有且有一个service.js。
6. 测试时，请在工程根目录下的`mock`文件夹，建立与页面（组）文件夹名相同的名字的JS的文件，用于生成后端json，每个页面（组）只能有且有一个测试JS文件。





## 开发规范

**国际化**：不需要使用locale(国际化)，所有文字均可以直接写在使用的地方(程序运行时JS会因此报错，但不影响使用，后期会统一处理该问题)。


**项目图标**：项目中的图标请在 https://ant.design/components/icon-cn/ 中选择，应该够了，如果有特殊的，在`src/assets`引入图片。


**假数据**：模拟数据的生成请使用`mockjs`库，详见 https://cloud.tencent.com/developer/article/1330971


**state**：所有的页面`state`请放在`model`中，不要放在页面组件本身，除非这个页面组件是个公用的组件，需要被其他组件使用。


**git的使用**：使用分支模式进行开发 [详见这里](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/001375840038939c291467cc7c747b1810aab2fb8863508000)，如果不熟悉分支开发，就当成svn开发。为什么拉取主分支时需要加入`rebase` ,[请看这里](https://www.cnblogs.com/wangiqngpei557/p/6056624.html)

```bash
$ git pull --rebase              #在master主分支上首先更新下最新的代码
$ git checkout -b 分支名称        #创建开发分支，并切换到该分之下进行开发
$ git commit                     #在开发分支下，开发完成commit
$ git checkout master            #切换后master分支
$ git pull --rebase              #在master主分支上更新最新的代码
$ git merge 分支名称               #将分支上开发内容和master主分支合并
                                 #merge过程中有若冲突解决冲突
$ git commit                     #在master主分支上提交
$ git push                       #将开发内容push到服务器
```

**防止二次提交**：所有与后台有交互的`button`（提交，保存等）都需要传入`loading`参数，防止二次提交的问题。


**后端接口规范**：在书写mock方法返回数据时，需要遵循返回数据接口格式规范，便于后续和后端api对接。
```javascript

//返回错误
{
	"message": "错误原因描述",
	"state": 0,
	"data": {
	}
}

//返回列表形式
{
	"message": "成功",
	"state": 1, //1=成功 0=失败
	"data": {
		"pagination": {
			"total": 100,
			"pageSize": 10,
			"current": 1
		},
		"list": [{
			"key1": value,
			"key2": value
		}, { ...
		}]
	}
}


//返回单个对象形式
{
	"message": "成功",
	"state": 1,
	"data": {
		"key1": value,
		"key2": value
	}
}

//上传图片成功，返回图片预览地址
{
	"message": "成功",
	"state": 1,
	"data": {
		"imageUrl" : "http://xxxx.com/xxxx/xxxx"       //上传成功后，返回上传图片的预览地址
	}
}
```
**日期类型的处理**： 对于前端日期时间类型，提交到后端时需要符合`YYYY-MM-DD HH:mm:ss`的格式要求；由于`datepicker`组件默认取出的值为`moment`类型，在前端范围内如无必要不需要对日期类型做特别转换。工程框架在提交到后台的方法（request）中做了封装，通过'request.body'方式提交的`moment`均会自动转换为下面的日期时间格式。请参考`src/utils/request.js`代码中的实现。

```javascript
moment().format('YYYY-MM-DD HH:mm:ss'); //2014-09-24 23:36:09 
```


## 代码参考

上传（Upload）的处理

[![Edit 上传组件Upload](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/qk77o5r0lq?fontsize=14)

日期（DatePicker）的处理

[![Edit 日期处理DataPicker](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/o96m7l7qwz?fontsize=14)
