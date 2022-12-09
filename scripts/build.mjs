// @ts-check
// node模块打包
import { readdirSync, statSync } from 'fs';
import { execa } from 'execa';
import path from 'path';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));

// 获取packages下文件(仅文件夹)
const dirs = readdirSync('packages').filter((pack) =>
  statSync(`packages/${pack}`).isDirectory()
);

// 并行运行的方法
const runParallel = async (source, iteratorFn) => {
  // 遍历
  let results = [];
  source.forEach((item) => {
    const p = Promise.resolve().then(() => iteratorFn(item));
    results.push(p);
  });
  return Promise.all(results);
};

const build = async (target) => {
  // 获取需要打包的文件夹路径
  const pkgDir = path.resolve(`packages/${target}`);
  // const pkg = await import(`${pkgDir}/package.json`);

  // 获取当前环境变量
  const env = 'development';
  // (pkg.buildOptions && pkg.buildOptions.env) ||
  // (devOnly ? 'development' : 'production');

  // const { stdout } = await execa('echo', ['Process execution for humans']);
  // console.log({ stdout });
  // 使用execa创建子进程进行并行打包
  // -c 执行配置文件 -env 环境变量
  await execa(
    'rollup',
    [
      '-c', // 执行rollup配置（rollup.config.js）
      '--environment', // 环境变量
      [
        // `COMMIT:${commit}`,
        `NODE_ENV:${env}`,
        `TARGET:${target}`, // 目标仓库
        // formats ? `FORMATS:${formats}` : ``,
        // buildTypes ? `TYPES:true` : ``,
        // prodOnly ? `PROD_ONLY:true` : ``,
        // sourceMap ? `SOURCE_MAP:true` : ``
      ]
        .filter(Boolean)
        .join(','),
    ],
    { stdio: 'inherit' } // 让子进程输出内容可以展示
  );
};

runParallel(dirs, build).then(() => {
  console.log('成功');
});
