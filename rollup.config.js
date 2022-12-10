// @ts-check
// 引入依赖
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ts from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import resolvePlugin from '@rollup/plugin-node-resolve'; // 用于解析三方外部依赖

// 获取等同于commonjs的__dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

// 确定env环境 若无直接终止
console.log('================================');
console.log(process.env.TARGET);
if (!process.env.TARGET) {
  throw new Error('TARGET package must be specified via --environment flag.');
}

// 获取
const packagesDir = path.resolve(__dirname, 'packages');
const packageDir = path.resolve(packagesDir, process.env.TARGET);
// 获取打包的项目配置
const resolve = (p) => path.resolve(packageDir, p);
// const pkg = require(resolve(`package.json`));
const packageOptions = { format: ['esm-bundler', 'cjs'] };
// 获取被打包的包名
const name = path.basename(packageDir);

// output打包对应表
const outputOptions = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: `es`,
  },
  'esm-browser': {
    file: resolve(`dist/${name}.esm-browser.js`),
    format: `es`,
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: `cjs`,
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: `iife`,
  },
  // runtime-only builds, for main "vue" package only
  'esm-bundler-runtime': {
    file: resolve(`dist/${name}.runtime.esm-bundler.js`),
    format: `es`,
  },
  'esm-browser-runtime': {
    file: resolve(`dist/${name}.runtime.esm-browser.js`),
    format: 'es',
  },
  'global-runtime': {
    file: resolve(`dist/${name}.runtime.global.js`),
    format: 'iife',
  },
};

// 创建配置项
const createConfig = (format, output) => {
  output.name = 'build';
  output.sourcemap = true;

  return {
    input: resolve('src/index.ts'),
    output,
    plugins: [
      json(),
      ts({
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      }),
      resolvePlugin(),
    ],
  };
};
// 默认输出格式
const defaultFormats = ['esm-bundler', 'cjs', 'global'];
packageOptions.formats = packageOptions.formats || defaultFormats;

export default packageOptions.formats.map((format) =>
  createConfig(format, outputOptions[format])
);
