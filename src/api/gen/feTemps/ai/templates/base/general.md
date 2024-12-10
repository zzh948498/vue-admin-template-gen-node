# 重要说明

## 请求方法说明

开发的第一步是找到`@/api/xxx/controller`定义的`axios实例调用`的请求方法，仔细阅读所有列出的请求方法的文件，并且向我请求阅读这些所有请求方法文件内容，并根据请求方法ts文件内实际使用的 所有输入输出interface进行编码
比如下面的请求方法：

```ts
export function postBasicV1VoltageDownloadTplDemo(input?: PostBasicV1VoltageDownloadTplDemoInput, config?: AxiosRequestConfig) {
  return request.post<DeepRequired<PostBasicV1VoltageDownloadTplDemoResult>>(`/basic/v1/voltage/downloadTplDemo`, input, config);
}
```

你要找到`PostBasicV1VoltageDownloadTplDemoInput` 和 `PostBasicV1VoltageDownloadTplDemoResult` 并阅读内容;

## 其他说明

请严格按照下面的说明编码

1. 请求实例统一在 `接口导入地址` 导出了,例如： @/api/xxx/controller 只能使用`@/api/xxx/controller` 这样的导入方式。不能使用 类似这样的完整导入`@/api/xxx/controller/xxx/xxx`
2. 输入输出的interface，有的在接口文件导出了，有的在 @/api/xxx/interface 导出了 直接使用即可，使用方式类似`@/api/xxx/controller`
3. 类似 `<gm-button>` 的组件，完整的复刻了element-plus的组件，只是样式上做了调整，使用时请参考element-plus的文档
4. 当前的代码都处于vue3 + giime（类似element-plus的组件库） + tailwindcss 环境中
5. 当你发现你已经创建了composables/useApiOptions.ts，ts还提示文件不存在，请跳过这个错误，因为可能vscode没有反应过来,除了文件不存在的错误，你都要尝试修复
6. @/api 文件夹下的文件可以简单修改，不能新建和删除文件
7. 写所有功能前都要完整阅读请求文件，请求文件中包含了请求的输入输出，以及请求的注释，请仔细阅读，不要自己编参数
8. 请求的输入和输出都可以在请求文件中找到，请先阅读请求代码。请严格按照请求文件定义的interface来写代码，可以直接使用这些interface，请求文件在controller下面深层文件夹的某个文件内，你要一层一层的文件夹往下找，直到找到请求文件
9. 在请求地址说明中，如果我给你请求文件名，则你自己查找到文件，如果我给你请求路由地址，则文件地址就是通过 请求方法+路由地址反推出来的
   比如 post请求 `/open/v1/system/list` 的文件名是 `postOpenV1SystemList.ts`
10. 数据源：下拉框、单选框等的数据源，可以根据接口文档的注释来获取。获取后 应该在useXxxOptions中抽离复用。

## 代码模板，供你学习代码规范和风格

### 代码模板使用说明：

1. 代码模板中包含增删改查功能的基本实现，请根据实际需求进行调整。
2. 代码模板中的请求地址为示例地址，请根据实际情况修改为真实请求地址。
3. 代码模板中的参数和返回数据结构为示例，请根据实际情况进行调整。
4. 调用请求 逻辑部分可以使用useLoading工具函数，给予用户更好的体验。如果已经内置了isLoading 就不用加了
5. 每个方法和变量定义时，请添加适量jsdoc注释。
6. 如果是增删改查 文件则按模板那样拆分，不能少文件

## 项目目录结构规范

```text
├── src
|  ├── api
|  |  └── userCenter            # 某个模块的api接口目录
|  |     ├── controller             # 具体接口输出目录
|  |     ├── interface              # interface 总目录
|  |     ├── request.ts             # axios实例
|  |     └── swagger.config.json    # 自动生成接口配置
|  ├── App.vue
|  ├── assets
|  |  ├── iconfont              # iconfont图标目录
|  |  |  └── iconfont.config.json
|  |  ├── icons                 # 定义图标目录
|  |  |  └── svg
|  |  └── logo.svg
|  ├── components               # 公共组件目录
|  |  ├── SvgIcon.vue
|  |  └── types.ts
|  ├── composables              # 公共组合式函数目录
|  |  └── useImageUpload.ts
|  ├── env.d.ts
|  ├── main.ts
|  ├── modules
|  |  └── company               # 某个模块目录
|  |     ├── app                    # 某个模块的子模块目录
|  |     ├── components             # 某个模块的组件目录
|  |     ├── composables            # 某个模块的组合式函数目录
|  |     ├── index.vue              # 模块入口文件
|  |     └── stores                 # 某个模块的状态管理目录
|  ├── router                   # 路由目录
|  |  ├── index.ts
|  |  └── modules                  # 模块路由目录
|  |     ├── company.ts              # 某个模块的路由文件
|  |     └── system.ts
|  ├── stores                    # 公共状态管理目录
|  |  └── counter.ts
|  ├── style.css
|  ├── styles
|  |  └── element-ui.scss
|  ├── utils                     # 工具函数目录
|  |  ├── copy.ts
|  |  ├── request.ts
|  |  ├── scroll-to.ts
|  |  └── validateForm.ts
|  ├─constants                  # 常量目录，存放一些公共的常量
|  │      README.md
|  ├─directives                 # 自定义指令目录，存放Vue自定义指令文件
|  │      README.md
|  └── views                     # 视图目录
|     ├── company                   # 某个模块的视图目录
|     |  └── index.vue               # 模块视图入口文件（通常很简单，他导入了modules的组件）
|     ├── HomeView.vue
|     └── system
|        └── index.vue
```
