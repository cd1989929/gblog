import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App.vue'
import List from "./components/List.vue";
import Article from "./components/Article.vue";
import Error404 from "./components/Error404.vue";
import Gplayer from "./components/Gplayer.vue";

Vue.config.productionTip = false

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.component('player',Gplayer);

const store = new Vuex.Store({
        state: {
                config: {
                        title: 'Gblog',//博客的标题
                        owner: 'your_username',//你的github的用户名
                        repo: 'your_blog_repository',//你要读取issues的仓库名称
                        per_page: 10,//列表页面每页分页条数
                        access_token: 'your_access_token',//你申请的access_token
                        clientid: 'your_clientid',//申请的app clientid
                        clientsecret: 'your_clientsecret',//申请的app clientsecret
                        talk: true,//全局是否开启评论功能
                        disable_talk: 'notalk',//文章禁止评论的标签
                        playlist: '',//网易云音乐歌单id，如 http://music.163.com/#/m/playlist?id=883476456  这个里面的883476456，为空时不显示播放器
                        player_subtitle: 'invictus maneo'//播放器暂停时默认显示的文字，可以作为博客的副标题
                }
        }
})

const router = new VueRouter({
        mode: 'history',
        routes: [
                { path: '/', component: List, props: true },
                { path: '/page', component: List, props: true },
                { path: '/page/:page(\\d+)', component: List, props: true },
                { path: '/tag/:tag', component: List, props: true },
                { path: '/tag/:tag/:page(\\d+)', component: List, props: true },
                { path: '/search/:query', component: List, props: true },
                { path: '/search/:query/:page(\\d+)', component: List, props: true },
                { path: '/post/:id(\\d+)', component: Article, props: true },
                { path: '/*', component: Error404 }
        ]
});

new Vue({
        router,
        store,
        render: h => h(App)
}).$mount('#app')
