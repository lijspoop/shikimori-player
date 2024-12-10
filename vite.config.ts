import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn, MonkeyUserScript, util } from 'vite-plugin-monkey';

import packageJson from './package.json';

export default defineConfig(async ({ mode, command }) => {

  
  const env = loadEnv(mode, process.cwd(), '');
  const userscript = getUserScriptMeta(packageJson);

  const config = <UserConfig>{};
  if (command === 'serve') {
    if ('match' in userscript) {
      if (Array.isArray(userscript.match)) {
        userscript.match = [ ...userscript.match, '*://127.0.0.1:5173/*' ];
      }
      else {
        userscript.match = [ userscript.match, '*://127.0.0.1:5173/*' ];
      }
    }

    userscript.name = packageJson.name;

    config.server = {
      proxy: {
        '^/shikimori/*': {
          target: 'https://shikimori.one/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/\/shikimori/, ''),
          headers: {
            Authorization: 'Bearer ' + env.ACCESS_TOKEN
          }
        }
      } 
    };
  }
  
  return Object.assign(config, <UserConfig>{
    plugins: [
      vue(),
      monkey({
        entry: 'src/index.ts',
        userscript,
        build: {
          externalGlobals: {
            vue: cdn
              .jsdelivr('Vue', 'dist/vue.global.prod.js')
              .concat(
                cdn.jsdelivr('', 'lib/index.iife.js')[1]('latest', 'vue-demi')
              )
              .concat(util.dataUrl(';window.Vue=Vue;window.vue=Vue;'))
            , pinia: cdn.jsdelivr('Pinia', 'dist/pinia.iife.prod.js')
            , '@fortawesome/fontawesome-svg-core': cdn.jsdelivr('window["fontawesome-svg-core"]', 'index.js')
            , '@fortawesome/free-solid-svg-icons': cdn.jsdelivr('window["free-solid-svg-icons"]', 'index.js')
          }
        }
      })
    ],
    build: {
      minify: 'esbuild'
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./src/vue', import.meta.url))
      }
    },
    define: {
      'import.meta.env.KODIK_TOKEN': JSON.stringify(env.KODIK_TOKEN)
    },
    
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    }
  });
});


function getUserScriptMeta(packageJson) {
  const meta = <MonkeyUserScript>{};

  meta.namespace = packageJson.name;
  meta.version = packageJson.version;

  if ('description' in packageJson) {
    meta.description[''] = packageJson.description; 
  }

  if ('author' in packageJson) {
    meta.author = '';
    
    if ('name' in packageJson.author) {
      meta.author += packageJson.author.name;
      meta.namespace = packageJson.author.name + '/' + packageJson.name;
      meta.updateURL = `https://raw.githubusercontent.com/${meta.namespace}/refs/heads/build/${packageJson.name}.meta.js`;
      meta.downloadURL = `https://raw.githubusercontent.com/${meta.namespace}/refs/heads/build/${packageJson.name}.user.js`;
    }
    if ('url' in packageJson.author) {
      meta.author += ` (${packageJson.author.url})`;
    }
    if ('email' in packageJson.author) {
      meta.author += ` <${packageJson.author.email}>`;
    }

    meta.author = meta.author.trim();
  }

  if ('license' in packageJson) {
    meta.license = packageJson.license;
  }

  return Object.assign(meta, <MonkeyUserScript>packageJson.userScriptMeta);
}