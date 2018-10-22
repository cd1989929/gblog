<template>
        <div id="app" class="p-2">
                <header class="navbar my-2 py-2">
                        <section class="navbar-section">
                                <router-link to="/" class="navbar-brand mr-2 tooltip tooltip-right" :data-tooltip="$store.state.config.title" v-text="$store.state.config.title"></router-link>
                        </section>
                        <section class="navbar-section">
                                <form class="input-group input-inline" action="" @submit.prevent="search">
                                        <input class="form-input" type="search" placeholder="搜索" v-model="searchkw" @keyup.enter.prevent="search">
                                        <button class="btn btn-primary input-group-btn" @click.prevent="search" type="button"><i class="icon icon-search"></i></button>
                                </form>
                        </section>
                </header>
                <player v-if="$store.state.config.playlist" :playlist="$store.state.config.playlist" :subtitle="$store.state.config.player_subtitle"></player>
                <div class="body my-2"><transition><router-view></router-view></transition></div>
                
                <div class="footer centered">
                        <p>© 2018  invictus maneo. power by <a href="https://github.com/ydq/gblog" target="_blank">Gblog</a>.</p>
                </div>

                <a href="javascript:void(0)" class="gotop tooltip tooltip-left btn" data-tooltip="返回顶部" @click="gotop"><i class="icon icon-upward"></i></a>
        </div>
</template>

<script>
export default {
        name: 'app',
        data(){
                return {
                        searchkw:''
                }
        },
        created(){
                document.title = this.$store.state.config.title;
        },
        methods:{
                search(){
                        this.$router.push(this.searchkw?'/search/'+this.searchkw:'/')
                },
                gotop(){
                        document.documentElement.scrollTop = document.body.scrollTop = 0;
                }
        }
}
</script>

<style lang="scss">
@import "gblog.scss";
::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-track-piece{background-color:rgba(0,0,0,0)}::-webkit-scrollbar-thumb{background:#ccc}::-webkit-scrollbar-thumb:vertical:hover,::-webkit-scrollbar-thumb:horizontal:hover{background:#999}
.v-move,.v-enter-active,.v-leave-active{transition: all .3s ease;}
.v-leave-active,.v-enter-active{position:absolute;width:100%}
.v-enter,.v-leave-active{transform:translateY(50px);opacity:0;}
a:visited{color:$primary-color}
#app{max-width:800px;margin:auto}
.navbar .navbar-brand{font-size:1.6rem}
.body{min-height:70vh;position: relative;}
.gotop{position:fixed;bottom:3.5rem;right:1rem;z-index:9;background:transparent}
</style>
