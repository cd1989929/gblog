<template>
        <div>
                <!-- 播放器 -->
                <audio id="gplayer" crossOrigin="anonymous" autoplay="autoplay" @timeupdate="player_timeupdate" @ended="player_next" @error="player_next"></audio>
                <!-- 顶部的默认占位，歌词显示区 -->
                <blockquote class="player-title">
                        <p class="text-ellipsis">
                        <transition>
                                <span v-text="lyric" :key="lyric"></span>
                        </transition>
                        &nbsp;
                        </p>
                </blockquote>
                <!-- 侧边的浮动控制栏 -->
                <div class="gplayer-btn popover popover-left">
                        <a href="javascript:void(0)" class="btn" v-if="ready"><i class="icon icon-apps"></i></a>
                        <div class="popover-container">
                                <div class="card">
                                        <!-- 标题 + 歌词 -->
                                        <div class="card-header tooltip" :data-tooltip="title">
                                                <div class="card-title h5 text-ellipsis"  v-text="title"></div>
                                                <div class="card-subtitle text-gray text-ellipsis">
                                                        <transition>
                                                                <span v-text="lyric" :key="lyric"></span>
                                                        </transition>
                                                        &nbsp;
                                                </div>
                                        </div>
                                        <!-- 专辑图片和频谱 -->
                                        <div class="card-image"><canvas id="gplayer_spectrum" class="img-responsive" width="304" height="150" :style="{'background-image':'url('+pic+')'}"></canvas></div>
                                        <!-- 播放进度条 -->
                                        <div class="card-body">
                                                <div class="bar bar-sm">
                                                        <div class="bar-item tooltip" :data-tooltip="parsetime" :style="{width:(currentTime*100/duration)+'%'}"></div>
                                                </div>
                                        </div>
                                        <!-- 控制按钮 -->
                                        <div class="card-footer">
                                                <div class="btn-group btn-group-block">
                                                        <button class="btn" @click="player_prev">上一曲</button>
                                                        <button class="btn" @click="btn_switch" :class="{'btn-primary':!isplaying}">{{isplaying?'暂停':'播放'}}</button>
                                                        <button class="btn" @click="player_next">下一曲</button>
                                                        <button class="btn" @click="showlist = 1">列表</button>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>

                <!-- 歌曲切换时的toast通知 -->
                <div class="toast-container">
                        <transition>
                                <div class="toast toast-primary" v-if="toast" :key="toast">
                                        <button class="btn btn-clear float-right" @click="toast=''"></button>{{toast}}
                                </div>
                        </transition>
                </div>

                <!-- 播放列表 弹窗 -->
                <div class="modal" :class="{active:showlist}">
                        <a href="javascript:void(0)" class="modal-overlay" @click="showlist=false"></a>
                        <div class="modal-container">
                                <div class="modal-header">
                                        <a href="javascript:void(0)" class="btn btn-clear float-right" @click="showlist=false"></a>
                                        <div class="modal-title h5" v-text="isplaying?'正在播放：#'+(current*1+1)+' '+title:'播放列表'"></div>
                                </div>
                                <div class="modal-body">
                                        <div class="content">
                                                <table class="table table-striped table-hover">
                                                        <thead class="list-header">
                                                                <tr>
                                                                        <th>#</th>
                                                                        <th>歌曲名称</th>
                                                                </tr>
                                                        </thead>
                                                        <tbody>
                                                                <tr v-for="(m,i) in list" :key="m[0]" class="c-hand" :class="{'active text-bold':i==current}" @click="player_play(i)">
                                                                        <td>{{i+1}}</td>
                                                                        <td v-text="m[1]" class="tooltip" :data-tooltip="(i==current?'正在播放：':'点击播放：')+m[1]"></td>
                                                                </tr>
                                                        </tbody>
                                                </table>
                                        </div>
                                </div>
                        </div>
                </div>
        </div>
</template>
<script>
export default {
        name: 'Gplayer',
        props:['playlist','subtitle'],
        data(){
                return {
                        api:'https://api.imjad.cn/cloudmusic/',
                        logo:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzA0IiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDwhLS0gQ3JlYXRlZCB3aXRoIFNWRy1lZGl0IC0gaHR0cDovL3N2Zy1lZGl0Lmdvb2dsZWNvZGUuY29tLyAtLT4KIDxkZWZzPgogIDxsaW5lYXJHcmFkaWVudCB5Mj0iMCIgeDI9IjEiIHkxPSIwIiB4MT0iMCIgaWQ9InN2Z18zIj4KICAgPHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjMDA3ZmZmIi8+CiAgIDxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmODAwMCIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiA8L2RlZnM+CiA8Zz4KICA8dGl0bGU+R3BsYXllcjwvdGl0bGU+CiAgPHRleHQgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9InVybCgjc3ZnXzMpIiBzdHJva2Utd2lkdGg9IjAiIHg9IjEyMyIgeT0iNzIuOTA2MjUiIGlkPSJzdmdfMSIgZm9udC1zaXplPSIyNCIgZm9udC1mYW1pbHk9IkZhbnRhc3ksUGluZ0ZhbmcgU0MsTWljcm9zb2Z0IFlhSGVpIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiB4bWw6c3BhY2U9InByZXNlcnZlIiB0cmFuc2Zvcm09Im1hdHJpeCgzLjEzODA3Mjg1NDY0NDQxNCwwLDAsMy4xNzQwMTcyMDg2OTQzMjI0LC0yMzMuOTY3MzczMDYzODc3MTUsLTE0My43MzU0MzM1ODMxMTIxMykgIiBzdHJva2U9IiMwMDAwMDAiPkdwbGF5ZXI8L3RleHQ+CiA8L2c+Cjwvc3ZnPg==',
                        ready:0,
                        current:-1,
                        isplaying:0,
                        player:null,
                        canvas:null,
                        lrc:[],
                        lyric:'',
                        currlrc:0,
                        currentTime:0,
                        duration:1,
                        pic:'about:blank',
                        list:[],
                        title:'Gplayer',
                        toast:'',
                        showlist:0,
                        spectrum:{
                                height:300,
                                canvas_width:304,
                                canvas_height:148,
                                ctx:null,
                                analyser:null,
                                gradient:null,
                                meter_num:null,
                                meter_width:10,
                                gap:1,
                                cap_height:2,
                                cap_color:'#fff',
                                cap_y_position:[],
                                from_color:'rgba(255,255,255,0)',
                                to_color:'#fff'
                        }
                }
        },
        mounted(){
                this.init()
        },
        computed:{
                parsetime(){let min = Math.floor(this.currentTime/60),sec = Math.floor(this.currentTime%60);return (min<10?('0'+min):min)+':'+(sec<10?('0'+sec):sec)}
        },
        methods:{
                api_comon(url){return fetch(url).then(resp=>resp.json())},
                api_list(pid){return this.api_comon(this.api+'?type=playlist&id='+pid+'&_='+Date.now())},
                api_song(sid){return this.api_comon(this.api+'?type=song&id='+sid)},
                api_lrc(sid){return this.api_comon(this.api+'?type=lyric&id='+sid)},
                api_detail(sid){return this.api_comon(this.api+'?type=detail&id='+sid)},
                player_play(i){
                        i= i||0;
                        if(i!=this.current){
                                this.lyric = this.subtitle;
                                this.current = i;
                                window.localStorage.index = this.current;
                                let sid = this.list[i][0];
                                this.lrc = [];
                                this.pic = this.logo;
                                this.api_song(sid).then(json=>{
                                        if(json.code==200){
                                                this.player.src = json.data[0].url;
                                                this.player.play()
                                                .then(_=> this.player_play_succeed())
                                                .catch(e=>{
                                                        console.log('本页面暂时无法自动播放音乐，需要手动点击播放。');
                                                        this.isplaying = 0;
                                                });
                                        }else{
                                                this.list.splice(i,1);
                                                if(this.list.length > 0){
                                                        this.player_next();//获取歌曲地址失败的时候直接跳至下一曲
                                                }else{
                                                        this.ready = 0;
                                                }
                                        }
                                })
                                this.api_lrc(sid).then(json=>{
                                        if(json&&!json.nolyric){
                                                json.lrc.lyric.split('\n').forEach(lrcline=>{
                                                        let lrc_txt = /(?:\[\d+:\d+\.\d+\])+(.*)/g.exec(lrcline);
                                                        lrc_txt&&lrcline.match(/\[\d+:\d+.\d+\]/g).forEach(time=>{
                                                                time= /\[(\d+):(\d+)\.(\d+)\]/.exec(time);
                                                                this.lrc[60*time[1]+1*time[2]] = lrc_txt[1];
                                                        })
                                                })
                                        }
                                })
                                this.api_detail(sid).then(json=>{
                                        if(json.code == 200){
                                                this.pic = json.songs[0].al.picUrl
                                        }
                                })
                        } else {
                                this.player.play()
                                .then(_=> this.player_play_succeed())
                                .catch(e=>{
                                        console.log('本页面暂时无法自动播放音乐，需要手动点击播放。');
                                        this.isplaying = 0;
                                });
                        }
                },
                player_play_succeed(){
                        this.isplaying = 1;
                        let song = this.list[this.current][1];
                        this.title = song;
                        this.player.currentTime <3 && (this.toast = song);
                },
                player_pause(){
                        this.player.pause();
                        this.lyric = this.subtitle;
                        this.isplaying = 0;
                },
                player_prev(){
                        let i = this.current-1;
                        this.player_play(i<0?this.list.length-1:i);
                },
                player_next(){
                        let i = this.current*1+1;
                        this.player_play(i>=this.list.length?0:i);
                },
                player_timeupdate(){
                        let curr = Math.floor(this.player.currentTime);
                        this.currentTime = curr;
                        this.duration = this.player.duration;
                        if(this.lrc.length && curr!=this.currlrc){
                                this.currlrc = curr;
                                this.lrc[curr]&& (this.lyric = this.lrc[curr]);
                        }
                        curr == 3 && (this.toast = '')
                },
                btn_switch(){
                        if(this.isplaying){
                                this.player_pause();
                        } else {
                                this.player_play(window.localStorage.index||0);
                        }
                },
                init(){
                        this.lyric = this.subtitle;
                        this.api_list(this.playlist).then(json=>{
                                if(json.code==200){
                                        for(let track of json.playlist.tracks){
                                                this.list.push([track.id,track.name])
                                        }
                                        if(json.playlist.trackCount>0){
                                                this.pic = this.logo;
                                                this.ready = 1;
                                                this.$nextTick(_=>{
                                                        this.player = document.querySelector('#gplayer');
                                                        this.canvas = document.querySelector('#gplayer_spectrum');
                                                        let index = window.localStorage.index||0;
                                                        if(index >= this.list.length){
                                                                index = 0;
                                                        }
                                                        this.player_play(index);
                                                        /Android|iP(hone|ad|od)/i.test(navigator.userAgent) || this.spectrum_init();
                                                })
                                        }
                                }
                        })
                        .catch(e=>{
                                console.log('获取播放列表失败，可能第三方接口挂掉了，坐等恢复即可...');
                        })
                },
                spectrum_init(){
                        let canvas = this.canvas;
			this.spectrum.meter_num = this.spectrum.canvas_width / (this.spectrum.meter_width+this.spectrum.gap);
			this.spectrum.ctx = canvas.getContext('2d');
			window.AudioContext = window.AudioContext||window.webkitAudioContext;
			let audio_ctx = new AudioContext();
			this.spectrum.analyser = audio_ctx.createAnalyser();
			audio_ctx.createMediaElementSource(this.player).connect(this.spectrum.analyser);
			this.spectrum.analyser.connect(audio_ctx.destination);
                        this.spectrum.gradient = this.spectrum.ctx.createLinearGradient(0,0,0,this.spectrum.canvas_height);
			this.spectrum.gradient.addColorStop(0,this.spectrum.from_color);
			this.spectrum.gradient.addColorStop(1,this.spectrum.to_color);
                        this.spectrum_renderFrame();
                },
                spectrum_renderFrame(){
                        this.spectrum.ctx.clearRect(0,0,this.spectrum.canvas_width,this.spectrum.canvas_height+this.spectrum.cap_height);
			let array = new Uint8Array(this.spectrum.analyser.frequencyBinCount);
			this.spectrum.analyser.getByteFrequencyData(array);
			let step = Math.round(array.length*.7 / this.spectrum.meter_num);
			this.spectrum.ctx.clearRect(0, 0, this.spectrum.cwidth, this.spectrum.canvas_height);
			for (let i = 0; i < this.spectrum.meter_num; i++) {
				let value = array[i * step]*this.spectrum.canvas_height/this.spectrum.height;
				if (this.spectrum.cap_y_position.length < Math.round(this.spectrum.meter_num)) {
					this.spectrum.cap_y_position.push(value)
				}
				this.spectrum.ctx.fillStyle = this.spectrum.cap_color;
				if (value < this.spectrum.cap_y_position[i]) {
					this.spectrum.ctx.fillRect(i * (this.spectrum.meter_width+this.spectrum.gap), this.spectrum.canvas_height - (--this.spectrum.cap_y_position[i]), this.spectrum.meter_width, this.spectrum.cap_height);
				} else {
					this.spectrum.ctx.fillRect(i * (this.spectrum.meter_width+this.spectrum.gap), this.spectrum.canvas_height - value, this.spectrum.meter_width, this.spectrum.cap_height);
					this.spectrum.cap_y_position[i] = value;
				}
				this.spectrum.ctx.fillStyle = this.spectrum.gradient;
				this.spectrum.ctx.fillRect(i * (this.spectrum.meter_width+this.spectrum.gap), this.spectrum.canvas_height - value + this.spectrum.cap_height, this.spectrum.meter_width, this.spectrum.canvas_height);
			}
			requestAnimationFrame(this.spectrum_renderFrame);
                }


        }
}
</script>

<style scoped>
.toast-container{position: fixed;top:1rem;right:1rem;z-index:1000;min-width:12rem}
.gplayer-btn{position:fixed;top:50%;right:1rem;z-index:9}
.toast{white-space:nowrap}
.player-title{padding: 0.2rem 0.8rem}
.list-header th{position:sticky;top:-16px;background:#fff;z-index:1;box-shadow:0  1px 0 #e7e9ed}
.gplayer-btn>.btn{background:transparent}
#gplayer{width:0;height: 0;display:none;position:relative;top:-9999px;left:-9999px}
#gplayer_spectrum{background-size:cover;background-position:50%;background-color:#d3d3d3}
</style>