<h1 align="center">update-deploy-config</h1>

修改部署配置的工具，主要供CI使用

> 本项目主要为了配合 [@alitajs/umi-plugin-deploy-config](https://github.com/alitajs/umi-plugin-packages/tree/master/packages/umi-plugin-deploy-config) 插件 解决CI流程自动化修改配置

## 安装

```
// npm 
npm install --dev @walrus/update-deploy-config

// yarn
yarn add --dev @walrus/update-deploy-config
```

**或者安装到全局**

## 使用

* 添加配置文件

```
// deploy.config.ts || deploy.config.js
import { resolve } from 'path';

export default {
  // config.js 存在的目录 必须设置
  dir: resolve(__dirname),
  // 配置文件名称 默认config.js
  file: 'config.js',
  // 迭代器 
  iterator: (key, obj) => {
    if (key === 'baseURL') {
      return 'test';
    }
    return obj[key];
  }
}
```

* 执行命令

```
update-deploy
```
