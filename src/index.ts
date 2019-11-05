import { readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import stringToObject, { IConfig } from './utils/stringToObject';
import { configLoader, Logger, lodash } from '@walrus/shared-utils';

export interface Config {
  dir?: string;
  // 配置文件 默认 config.js
  file?: string;
  iterator?: (key, obj) => string;
}

const logger = new Logger();
const { isFunction, template } = lodash;

export class Transform {
  private readonly config: Config;
  private readonly rootDir: string;
  private readonly filePath: string;

  constructor(options: Config = {}) {
    this.rootDir = resolve(options.dir || '.');

    const userConfig = configLoader.loadSync({
      files: [
        'deploy.config.js',
        'deploy.config.ts'
      ],
      cwd: this.rootDir
    });

    this.config = Object.assign({
      dir: process.cwd(),
      file: 'config.js'
    }, userConfig.data);

    this.filePath = resolve(this.config.dir || '', this.config.file || '');
  }

  run() {
    const { iterator } = this.config;
    let code;

    // 1. 读取配置文件
    try {
      code = readFileSync(this.filePath, 'utf-8');
    } catch (e) {
      logger.error('配置文件读取错误！');
      process.exit(1)
    }

    if (!code) {
      logger.error('配置文件为空！');
      return;
    }

    // 2. 转换原有配置为对象
    const config = stringToObject(code);

    // 3. 重新生成转换后的配置
    const newConfig: IConfig = {...config};

    if (isFunction(iterator)) {
      Object.keys(config).forEach(item => {
        const result = iterator(item, config);
        if (result) {
          newConfig[item] = iterator(item, config);
        }
      });
    }

    // 4. 生成新的配置文件
    const configTemplate = readFileSync(join(__dirname, './templates/config.js.tpl'), 'utf-8');

    const compiled = template(configTemplate.toString());
    const result = compiled({
      code: `${Object.keys(newConfig).map(item => `window.${item} = '${newConfig[item]}'`).join(';\n  ')}`
    });

    writeFileSync(this.filePath, result);

    Object.keys(newConfig).forEach(item => {
      logger.info(`${item}: ${newConfig[item]}`)
    });

    logger.done('处理成功！')
  }
}

export default Transform;
