import { PARENT, UID, Tip, URL } from '@/utils';

const needLogin = ['/advisory', '/user','/notes'];
let launchParmas;
export default ({ app }) => {
    app.router.beforeEach((to, from, next) => {
        //获取软件 启动参数 注册上级id
        if (process.browser && launchParmas === undefined) {
            launchParmas = to.query || {};
            if (typeof launchParmas === 'object') {
                //注册完上级id后会重置链接uid参数
                PARENT.SET(launchParmas.uid || '');
            }
            //通过 setuid主动设置uid
            if(launchParmas.setuid){
                UID.SET(launchParmas.setuid);
            }
        }
        // const toPath = process.browser ? getPath(location.pathname) : to.path
        /*
        1.为浏览器环境
        2.无token
        // 3.vue router识别为需要登录的页面
        // 4.通过 location.pathname 识别为需要登录的页面
        3.vue router识别为需要登录的页面
        */
        if (process.browser && !UID.GET() && needLogin.includes(to.path)) {
            Tip.error('请先登录');
            // localStorage.setItem('redirect', JSON.stringify({
            //     path: to.path,
            //     query: to.query
            // }))
            // console.log({ from })
            next({
                path: '/login',
                query: {
                    redirect: URL.decode(from.fullPath)
                }
            });
            // next();
        } else {
            //解决首页为携带uid的问题
            if (!to?.query?.uid && UID.GET()) {
                next({
                    path: to.path,
                    query: {
                        ...(to.query || {}),
                        uid: UID.GET()
                    },
                    replace: to.replace
                });
            } else {
                next();
            }
        }
    });
}
