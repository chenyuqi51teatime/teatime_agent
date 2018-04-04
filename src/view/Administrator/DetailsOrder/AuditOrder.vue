<template>
    <div class="AuditOrder" ref='AuditOrder'>
        <div class="foot">
            <el-button @click="back">返回</el-button>
        </div>
        
        <div class="VideoReview">
            <!-- 图片专区 -->
            <div class="pictures">
                <div class="pictureList">
                    <div class="pictureList_sty" v-for='(v,i) in picture_ceng' @click='pic_SetStyle(i)'>第{{v}}层</div>
                </div>
                <div class="pictureBox">
                    <div>
                        <div v-for='(v,i) in picture_pic' class="pic">
                            <img :src=v>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 视频专区 -->
            <div class="video">
                <div class="videoList"><div class="videoList_sty" v-for='(v,i) in video_ceng' @click='vid_SetStyle(i)'>{{v}}</div></div>
                <div class="videoBox">
                    <div>
                        <div v-for='(v,i) in video_vid' class="vid">
                            <video :src=v ></video>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        


        <!-- 审核商品 -->
        <div class="container" style="display:none;">
            <!-- 查询商品 和 展示商品 -->
            <div class="con_left">
                <!-- 查询商品 -->
                <div class="check_container">
                    <span class="tit">查询商品</span>
                    <el-autocomplete class="address-select checkgoods" ref='ipt_checkGoods' v-model="searchData.GoodsName" :autofocus='false' :fetch-suggestions="Search_goods" placeholder="请输入内容" :trigger-on-focus="false"
                        @select="GoodsNameChange" @keyup.native='Keyboard_input_goods($event)'></el-autocomplete>
                </div>
                <!-- 商品列表 -->
                <div class="tr_left" v-for='(v,i) in max_ceng' :key='i'>
                    <div class="tr_tit">第{{arr[i]}}层</div>
                    <ul class="tr_ulst">
                        <li v-for='(val,idx) in DataContainers' :key='idx' v-if="val.ceng == i+1 && val.productName" :class='{checked: val.active_sty}' @click='changeStyle(val,idx)'><span>{{val.productName}}</span></li>
                        <!-- 无商品层数 -->
                        <li v-for='(val,idx) in DataContainers' :key='idx' v-if='val.ceng == i+1 && val.kong' class="kong"><span></span></li>
                    </ul>
                </div>
            </div>
            <!-- 订正数量 -->
            <div class="con_center">
                <!-- 订正数量 -->
                <div class="check_container" style="padding-left: 0px;">
                    <span class="tit">订正数量</span>
                    <el-input class="address-select" ref='ipt_num' v-model="searchData.sum" :maxlength=3 :autofocus='false' @keyup.native='Keyboard_input_num($event)'></el-input>
                </div>
                <!-- 计数器 -->
                <div class="counter">
                    <div><span class="counter_sub count_number" v-for='(v,i) in 3' @click='count_click(v,i)'>{{v}}</span></div>
                    <div><span class="counter_sub count_number" v-for='(v,i) in 3' @click='count_click(v+3,i+3)'>{{v+3}}</span></div>
                    <div><span class="counter_sub count_number" v-for='(v,i) in 3' @click='count_click(v+6,i+6)'>{{v+6}}</span></div>
                    <div>
                        <span class="counter_sub count_number" @click='count_click(0,9)'>{{0}}</span>
                        <span style="margin:0 20px;"></span>
                        <el-button type="warning" @click="count_sure('ok')">确 定</el-button>
                    </div>
                </div>
            </div>
            <!-- 审核结果 -->
            <div class="con_right">               
                <div class="tab">
                    <!-- 表头 -->
                    <div class="thead">
                        <div>审核结果</div>
                        <div><el-button type="warning" @click="clear_all" style="width:100%;">清 空</el-button></div>
                    </div>
                    <!-- 表格数据 滚动区域 -->
                    <div class="tbody">
                        <div class="tr" v-for='(v, i) in goodsNum'>
                            <div class="td"><span class="goodnameBox">{{v.productName}}</span></div>
                            <div class="td">
                                <span class='reduce' @click='reduce(i,v)'>-</span>
                                <span>{{v.amount}}</span>
                                <span class='add' @click='add(i,v)'>+</span>
                            </div>
                            <div class="td" style="width: 80px;"><el-button type="text" size="small" @click="del_vendorId(i,v)">删除</el-button></div>
                        </div>
                        <!-- 补全位置 -->
                        <div class="tr" v-for=' i in count'>
                            <div class="td"></div>
                            <div class="td"></div>
                            <div class="td" style="width: 80px;"></div>
                        </div>
                    </div>
                    <!-- 确定提交 -->
                    <div class="sure_btn"><el-button type="warning" style="width: 80px;" @click="sure_get">确 定</el-button></div>
                </div>
            </div>
        </div>
        <!-- 通过审核 - 确认通过审核？ -->
        <el-dialog title="提示" :visible.sync="AuditOrder_dialog" width="30%" :before-close="AuditOrder_dialog_notsure">
            <div class="exitMsg"> 确认通过审核？ </div>
            <div slot="footer" class="dialog-footer">
              <el-button type="warning" @click="AuditOrder_dialog_sure">确 定</el-button>
              <el-button @click="AuditOrder_dialog_notsure">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    // autoplay="autoplay" 自动播放
    // controls="controls" 显示播放器控件
    // width="320" height="240" 播放器宽高
    // loop="loop" 是否再次播放
    // poster='url'  视频加载前显示图片
    import { Message } from 'element-ui';

    export default {
        data() {
            return {
                AuditOrder_dialog: false, // 通过审核dialog
                currentbrand: [],
                searchData: {
                    GoodsName: '',
                    sum: '', // 订正数量
                },
                arr: ['一', '二', '三', '四', '五', '六', '七'],
                count: 8, // 补位置
                keyCodeIndex: 0, // 通过keyCode控制
                goodsNum: [], // 选中商品数量
                
                init_goodsNum: [], // 初始化请求商品
                add_goodsNum: [], // 新添加商品

                DataContainers: [], // 商品数据
                DataContainers_for: [], // // 商品数据 层数处理后
                max_ceng: 0, // 最大层数
                
                goods_len: 0, // 判断有无商品
                // 视频审查
                picture_ceng: 5,
                picture_pic: [], // 照片数据
                video_ceng: ['顶部','门上','右侧'],
                video_vid: [], // 视频数据
                html:'aaa',
            }
        },
        methods: {
            pic_SetStyle(idx) {
                
                // 更改样式
                new Promise((res, rej) => {
                    res();
                }).then(() => {
                    var el = document.getElementsByClassName('pictureList_sty');

                    for (var i=0; i<el.length; i++) {
                        el[i].className = 'pictureList_sty'
                    }
                    
                    el[idx].className = 'pictureList_sty vider_active'
                })
                // 更改数据
                switch(idx){
                    case 0:
                    this.picture_pic = [
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/20675193653102523999347029.jpg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/5658537043090970449425996.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/8172478743091004974772495.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/6386208443091026696542596.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/722682120434434453582621.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/722682120434434453582621.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/5395879523091155735924468.jpg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/4659314643091924271547657.jpg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/5258259553102559496610814.jpg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/7945688584296384711562861.jpg',
                    ]
                    break;
                    
                    case 1:
                    this.$bounced(this)
                    this.picture_pic = [
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/722682120434434453582621.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/5395879523091155735924468.jpg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/20675193653102523999347029.jpg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/5658537043090970449425996.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/5258259553102559496610814.jpg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/7945688584296384711562861.jpg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/722682120434434453582621.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/4659314643091924271547657.jpg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/8172478743091004974772495.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/6386208443091026696542596.jpeg',
                    ]
                    break;

                    case 2:
                    this.picture_pic = [
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/5395879523091155735924468.jpg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/4659314643091924271547657.jpg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/5258259553102559496610814.jpg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/8172478743091004974772495.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/6386208443091026696542596.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/722682120434434453582621.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/722682120434434453582621.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/7945688584296384711562861.jpg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/20675193653102523999347029.jpg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/5658537043090970449425996.jpeg',
                    ]
                    break;

                    case 3:
                    this.picture_pic = [
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/8172478743091004974772495.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/6386208443091026696542596.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/722682120434434453582621.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/722682120434434453582621.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/20675193653102523999347029.jpg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/5658537043090970449425996.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/8172478743091004974772495.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/6386208443091026696542596.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/722682120434434453582621.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/722682120434434453582621.jpeg',
                        'http://teatime-pic.oss-cn-beijing.aliyuncs.com/5395879523091155735924468.jpg',
                    ]
                    break;

                    default:
                    break;
                }
            },
            vid_SetStyle(idx) {
                new Promise((res, rej) => {
                    res();
                }).then(() => {
                    var el = document.getElementsByClassName('videoList_sty');

                    for (var i=0; i<el.length; i++) {
                        el[i].className = 'videoList_sty'
                    }
                    
                    el[idx].className = 'videoList_sty vider_active'
                })
                // 更改数据
                switch(idx){
                    case 0:
                    this.video_vid = [
                        'http://www.w3school.com.cn/example/html5/mov_bbb.mp4',
                        'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
                        'http://221.228.226.23/11/t/j/v/b/tjvbwspwhqdmgouolposcsfafpedmb/sh.yinyuetai.com/691201536EE4912BF7E4F1E2C67B8119.mp4',
                        'http://221.228.226.5/14/z/w/y/y/zwyyobhyqvmwslabxyoaixvyubmekc/sh.yinyuetai.com/4599015ED06F94848EBF877EAAE13886.mp4',
                        'http://221.228.226.5/15/t/s/h/v/tshvhsxwkbjlipfohhamjkraxuknsc/sh.yinyuetai.com/88DC015DB03C829C2126EEBBB5A887CB.mp4',
                        'http://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8',
                    ]
                    break;
                    
                    case 1:
                    this.video_vid = [
                        'http://www.w3school.com.cn/example/html5/mov_bbb.mp4',
                        'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
                        'http://221.228.226.23/11/t/j/v/b/tjvbwspwhqdmgouolposcsfafpedmb/sh.yinyuetai.com/691201536EE4912BF7E4F1E2C67B8119.mp4',
                        
                    ]
                    break;

                    case 2:
                    this.video_vid = [
                        'http://www.w3school.com.cn/example/html5/mov_bbb.mp4',
                        'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
                        'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
                        'http://221.228.226.23/11/t/j/v/b/tjvbwspwhqdmgouolposcsfafpedmb/sh.yinyuetai.com/691201536EE4912BF7E4F1E2C67B8119.mp4',
                    ]
                    break;

                    case 3:
                    this.video_vid = [
                        'http://www.w3school.com.cn/example/html5/mov_bbb.mp4',
                        'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
                        'http://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8',
                    ]
                    break;

                    default:
                    break;
                }
                
            },
            // 返回
            back() {
                this.$router.go(-1);
            },
            // 查询商品名称 input 值改变后
            GoodsNameChange() {
                // 第二个input 获取焦点
                this.$refs.ipt_num.focus();
                
                // 高亮选中的商品
                this.active_sty(this.searchData.GoodsName);
            },
            // 高亮选中的商品
            active_sty(el){
                // console.log(el)
                
                // 关闭所有样式
                this.DataContainers.forEach((v,i) => {
                    v.active_sty = false;
                    this.$set(this.DataContainers, i, v)
                })

                // 判断查询商品数量
                var len = 0;

                this.DataContainers.forEach((v,i) => {
                    if (v.productName == el) {
                        len++
                    }
                })

                this.goods_len = len;

                // 只有一件商品则高亮
                if (len == 1) {
                    // 更改选中商品高亮
                    this.DataContainers.forEach((v,i) => {
                        if (v.productName == el) {
                            v.active_sty = true;
                            this.$set(this.DataContainers, i, v); 
                        }
                    })
                    return;
                }
                // 有多个商品
                if (len > 1) {
                    // 提示
                    Message({
                        message: '该商品存在多个，请手动选择！',
                        type: 'warning'
                    })
                }
                // 无商品
                if ( len == 0 ) {
                    this.$message.error('所选商品暂无！')
                }

                // console.log(this.DataContainers)
            },
            // 点击高亮样式
            changeStyle(obj,idx){
                
                this.goods_len = 1;

                // 判断高亮是否存在
                if (obj.active_sty) {
                    // 存在
                    this.searchData.GoodsName = '';
                    obj.active_sty = false;
                    this.$set(this.DataContainers, idx, obj)
                }else{
                    // 不存在

                    // 关闭所有样式
                    this.DataContainers.forEach((v,i) => {
                        v.active_sty = false;
                        this.$set(this.DataContainers, i, v)
                    })

                    this.searchData.GoodsName = obj.productName;
                    obj.active_sty = true;
                    this.$set(this.DataContainers, idx, obj)
                }
            },
            // 查询商品名称
            Search_goods(queryString, cb) {
                // queryString 是 输入的内容
        
                // 高亮选中的商品
                this.active_sty(queryString);

                var results = queryString ? this.currentbrand.filter(res => { return (res.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0) }) : this.currentbrand;
                
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            // 点击计数器
            count_click(num,idx) {
                // 获取所有element
                var el = document.getElementsByClassName('count_number');
                // 关闭所有样式
                for(var i=0; i<el.length; i++){
                    el[i].className = 'counter_sub count_number';
                }
                // 添加点击样式
                el[idx].className = 'counter_sub count_number count_number_active';
                
                // 如果 长度大于3 不添加
                if (this.searchData.sum.length >= 3) return;

                this.searchData.sum += num;
            },
            // 键盘事件 - 查询商品input
            Keyboard_input_goods(e){
                switch(e.keyCode){
                    case 13:
                    this.$refs.ipt_num.focus();
                    break;

                    case 37:
                    this.$refs.ipt_checkGoods.focus();
                    break;

                    case 39:
                    this.$refs.ipt_num.focus();
                    break;

                    default:
                    break;
                }
            },
            // 键盘事件 - 订正数量input
            Keyboard_input_num(e){
                switch(e.keyCode){
                    case 13:
                    
                    this.count_sure();

                    break;
                    
                    case 37:
                    this.$refs.ipt_checkGoods.focus();
                    break;

                    case 39:
                    this.$refs.ipt_num.focus();
                    break;

                    default:
                    break;
                }
            },
            // 订正数量确认 - 手动
            count_sure(){
                
                if (this.searchData.GoodsName == '') return this.$message.error('请输入商品！');
                if (this.searchData.sum == '') return this.$message.error('请输入数量！');
                if (this.goods_len == 0) return this.$message.error('所选商品暂无！');
                    
                var flag = false;

                this.DataContainers.forEach((v, i) => {
                    if (v.active_sty) {
                        flag = true;
                    }
                })

                if (!flag) return Message({ message: '该商品存在多个，请手动选择！', type: 'warning' });

                this.count_click_sure();
            },
            // 订正数量确认 - 初始
            count_click_sure() {
                
                // 获取所有element
                var el = document.getElementsByClassName('count_number');

                // // 关闭所有样式
                for(var i=0; i<el.length; i++){
                    el[i].className = 'counter_sub count_number';
                }
                if (isNaN(Number(this.searchData.sum))) return this.$message.error('输入数量有误！');

                // 值不为空的时候
                if (this.searchData.sum != '' && this.searchData.sum != null && this.searchData.GoodsName != '') {
                    
                    if (0 >= parseInt(this.searchData.sum) || parseInt(this.searchData.sum) > 999) return this.$message.error('输入数量在1`999之间');
                    
                    // 找到添加的商品
                    this.DataContainers.forEach((v,i) => {
                        if (v.active_sty) {
                            // 判断是否已经添加过该商品
                            var flag = true;

                            this.goodsNum.forEach((val,idx) => {
                                // 判断是否有该商品 如果有 再判断plantId
                                if (val.skuId == v.skuId) {
                                    if (val.plantId == v.plantId) {
                                        flag = false;
                                        return;
                                    }
                                }
                            })
                            
                            // 不存在添加
                            if (flag){
                                v.amount = parseInt(this.searchData.sum),
                                this.goodsNum.push(v); // 展示
                                this.add_goodsNum.push({
                                    'amount':v.amount || null,
                                    'crTime':v.crTime || null,
                                    'crUser':v.crUser || null,
                                    'id':v.id || null,
                                    'image':v.image || null,
                                    'orderId':v.orderId || null,
                                    'plantId':v.plantId || null,
                                    'price':v.price || null,
                                    'productId':v.productId || null,
                                    'productName':v.productName || null,
                                    'skuId':v.skuId || null,
                                    'skuProperty':v.skuProperty || null,
                                    'status':v.status || null,
                                    'totalWeight':v.totalWeight || null,
                                    'unitWeight':v.unitWeight || null,
                                    'upTime':v.upTime || null,
                                    'upUser':v.upUser || null,
                                });  // 新添加商品
                            }else{
                                this.$message.error('已存在该商品!')
                            }
                        }
                    })
                    
                    // console.log(this.searchData.sum)

                    if (this.goodsNum.length <= 8) {
                        this.count = 8 - this.goodsNum.length
                    } else {
                        this.count = 0
                    }

                    // 关闭所有样式
                    this.DataContainers.forEach((v,i) => {
                        v.active_sty = false;
                        this.$set(this.DataContainers, i, v)
                    })
                    // 清空查询名称
                    this.searchData.GoodsName = ''; 
                    // 清空订正数量
                    this.searchData.sum = ''; 

                }
            },
            // 减
            reduce(idx,obj) {
                // console.log(idx)

                if (obj.amount <= 1) return

                obj.amount --;

                this.$set(this.goodsNum, idx, obj)  
                
            },
            // 加
            add(idx,obj) {
                // console.log(idx)
                var count = 0;
                // 判断最大限定
                this.DataContainers.forEach((val,idx) => {
                    if (obj.skuId == val.skuId && obj.plantId == val.plantId) {
                        console.log(val)
                        count = val.count
                    }
                })

                if (count >= 999) return
                if (obj.amount >= count) return this.$message.error('添加数量超过当前商品库存！')

                obj.amount ++;
                console.log(obj)
                this.$set(this.goodsNum, idx, obj)

            },
            // 删除 商品信息
            del_vendorId(idx,obj) {

                // 更新展示数据数组
                this.goodsNum.forEach((v,i) => {
                    if (v.skuId == obj.skuId && v.plantId == obj.plantId) {
                        this.goodsNum.splice(i,1);
                    }
                })
                // 更新初始化数据数组
                this.init_goodsNum.forEach((v,i) => {
                    if (v.skuId == obj.skuId && v.plantId == obj.plantId) {
                        this.init_goodsNum.splice(i,1);
                    }
                })
                // 更新新添加数据数组
                this.add_goodsNum.forEach((v,i) => {
                    if (v.skuId == obj.skuId && v.plantId == obj.plantId) {
                        this.add_goodsNum.splice(i,1);
                    }
                })


                if (this.goodsNum.length <= 8) {
                    this.count = 8 - this.goodsNum.length
                } else {
                    this.count = 0
                }
            },
            // 全除 商品信息
            clear_all() {
                this.goodsNum = [], // 选中商品数量
                this.init_goodsNum = [], // 初始化请求商品
                this.add_goodsNum = [], // 新添加商品
                this.count = 8;
            },
            // 获取货柜 货道商品信息  和 待审核商品
            containerGoodsMsg() {
                var orderId = this.$route.params.orderId;
                var vendorId = this.$route.params.vendorId;
                
                // console.log(id)
                
                // 货柜商品
                this.$xhr(localStorage.getItem('teauserStatus') === '1' ? 'deviceDetailApi' : 'deviceDetailApiB', {
                    id: vendorId
                }).success(res => {
                    // console.log(res.cargoInformation)
                    this.DataContainers = res.cargoInformation;

                    // 获取所有商品名
                    // 去重
                    var name = [];
                    this.DataContainers.forEach((v) => {
                        if (v.productName != null) {
                            name.push(v.productName)
                        }
                    })
                    var set = new Set(name)
                    name = [...set]

                    // 添加新商品名称
                    for (var i = 0; i < name.length; i++) {
                        this.currentbrand.push({ "value": name[i] })
                    }
                    
                    // 如果该商品不为空 增加改变样式属性
                    this.DataContainers.map((v, i) => {
                        if (v.productName != null) {
                            v.active_sty = false;
                            v.amount = 1;
                        }
                    })

                    // 处理托盘

                    // 取最大值
                    var arr = [];
                    
                    this.DataContainers.forEach((v, i) => {
                        arr.push(Number(v.sensorId.toString().slice(2,3)))
                    })

                    var max = Math.max.apply(null,arr);
                    
                    this.max_ceng = max + 1;
                    // 定义当前层
                    this.DataContainers.map((v, i) => {
                        v.ceng = (max + 1 - parseInt(v.sensorId.toString().slice(2, 3)));
                    })
                    // 排序
                    this.DataContainers.sort((a, b) => {
                        return a.ceng - b.ceng
                    })
                    
                    // 思路 -> 按层数分成二维数组， 判断每层是否商品全部为空，增加kong属性 

                    //  以二维数组形式 =》 按层分商品
                    var a = [];
                    
                    for (var i = 1; i <= max + 1; i++) {

                        // 按层分商品
                        var b = []
                        this.DataContainers.forEach((val, idx) => {
                            if (val.ceng == i) {
                                b.push(val)
                            }
                        })
                        // 判断每层是否全为空商品
                        var len = 0;
                        b.forEach((s, q) => {
                            if (s.productName == null) {
                                len++
                            }
                        })
                        // 如果当前层无商品
                        if (len == b.length) {
                            // 新增属性 kong
                            b.map((q) => {
                                q.kong = 1;
                            })
                        }

                        a.push(b);
                    }
                    
                    this.DataContainers_for = a;
                    
                    // console.log(this.DataContainers)
                })

                // 待审核商品
                this.$http.get(`/v2/vieworder/orderDetail?orderId=${orderId}`).then(res => {
                    
                    this.goodsNum = res.data.orderReviewList;
                    this.init_goodsNum =  JSON.parse(JSON.stringify(res.data.orderReviewList)); // 保存初始请求数据

                    if (this.goodsNum.length <= 8) {
                        this.count = 8 - this.goodsNum.length
                    } else {
                        this.count = 0
                    }
                },err => {
                    console.log(err)
                })
            },
            // 确定 - 审核
            sure_get(){
                this.AuditOrder_dialog = true;
                console.log('确定')
            },
            // 通过审核 - 确认
            AuditOrder_dialog_sure() {
                // 同步初始化数组
                this.init_goodsNum.map((v, i) => {

                    v.upUser = parseInt(localStorage.getItem('tearoleId'));
                    v.crUser = parseInt(localStorage.getItem('tearoleId'));

                    this.goodsNum.forEach((val, idx) => {
                        if (v.skuId == val.skuId && v.plantId == val.plantId) {
                            v.amount = val.amount
                        }
                    })
                })
                console.log(this.init_goodsNum)

                // 同步新添加数组
                this.add_goodsNum.map((a, b) => {

                    a.upUser = parseInt(localStorage.getItem('tearoleId'));
                    a.crUser = parseInt(localStorage.getItem('tearoleId'));

                    this.goodsNum.forEach((value, index) => {
                        if (a.skuId == value.skuId && a.plantId == value.plantId) {
                            a.amount = value.amount
                        }
                    })
                })
                console.log(this.add_goodsNum)

                this.AuditOrder_dialog_notsure();
            },
            // 通过审核 - 取消
            AuditOrder_dialog_notsure(){
                this.AuditOrder_dialog = false;
            }
        },
        created() {
            this.containerGoodsMsg(); // 获取货柜 货道商品信息
            this.count_click_sure();  // 表格空位补齐
            this.pic_SetStyle(0);// 设置第一个列表样式  图片
            this.vid_SetStyle(0);// 设置第一个列表样式  视频


            
        },
    }

</script>
<style scoped>
    .AuditOrder {
        width: 100%;
        /* height: 100%; */
        background: white;
        box-sizing: border-box;
        padding: 10px 20px;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }

    .container {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: space-between;
    }

    .con_left {
        /* border: 1px solid green; */
        flex: 0.5;
    }

    /* 选择条件container */

    .check_container {
        padding: 20px 0 40px 0px;
    }

    /*  标题  */

    .tit {
        margin-right: 10px;
        font-size: 14px;
    }

    /*  选择城市间距  */

    .address-select {
        width: 100px;
    }

    .checkgoods{
        width: 140px;
    }
    
    /* 每一行 */
    .tr_left{
        width:100%;
        /* border: 1px solid green; */
        position: relative;
        box-sizing: border-box;
        padding-left:50px;
    }

    /* 层数 */
    .tr_tit{
        position: absolute;
        top:0;
        left: -10px;
        /* border: 1px solid purple; */
        width: 50px;
        height:50px;
        line-height: 50px;
        text-align: center;
    }

    /* 商品列表 */
    .tr_ulst{
        /* width: 440px; */
        display: flex;
        flex-wrap: wrap;
        /* border: 1px solid red; */
    }

    .tr_ulst>li{
        border:2px solid #f7ba2a;
        border-radius: 4px;
        width: 80px;
        height: 58px;
        margin: 0 20px 20px 0;
        box-sizing: border-box;
        padding: 4px;
        display: flex;
        -webkit-align-items:center;
        align-items:center;
        -webkit-justify-content:center;
        justify-content:center;
        cursor: pointer;
    }

    .tr_ulst>li>span{
        font-size: 14px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }

    .con_center {
        /* border: 1px solid red; */
        box-sizing: border-box;
        /* padding-left: 20px; */
        flex: 0.2;
    }

    /* 计数器 */
    .counter{
        width: 240px;
    }

    .counter_sub{
        display: inline-block;
        text-align: center;
        border:2px solid #f7ba2a;
        border-radius: 4px;
        cursor: pointer;
        box-sizing: border-box;
        padding: 7px 14px;
        margin: 0 20px 20px 0px;
        font-size: 18px;
    }

    /* 计算器点击样式 */
    .count_number_active{
        background: #f7ba2a;
        color: white;
    }

    .con_right {
        /* width: 380px; */
        flex: 0.3;
    }

    /* 表头 */

    .tab {
        width: 100%;
        /* height: 458.4px; */
        height: 504.4px;
        text-align: center;
        color: rgb(61, 59, 31);
        font-size: 14px;
        border: 1px solid #ccc;
    }

    .thead {
        background: rgba(241, 241, 231, 0.7);
        /* border:1px solid black; */
        padding:0;
        margin:0;
        display: flex;
    }

    .thead>div {
        /* display: inline-block; */
        height: 54.6px;
        line-height: 54.6px;
    }

    .thead>div:nth-child(1){
        width: 295px;
        /* border:1px solid red; */
    }
    
    .thead>div:nth-child(2){
        width: 80px;
        /* border:1px solid blue; */
    }

    .tbody {
        height: 404px;
        overflow-x: hidden;
        overflow-y: scroll;     
    }

    .tr {
        display: flex;
        border-top: 1px solid #ccc;
    }

    .td {
        /* flex: 1; */
        /* width: 50%; */
        height: 49.4px;
        line-height: 49.4px;
        border-right: 1px solid #ccc;
        position: relative;
    }

    .td:nth-child(1) {
        flex: 0.4;
        /* border:1px solid red; */
    }

    .td:nth-child(2) {
        flex: 0.4;
        /* border:1px solid blue; */
    }

    .td:nth-child(3) {
        flex: 0.2;
        /* border:1px solid red; */
    }

    /* 减 */
    .reduce{
        position: absolute;
        top: 12.7px;
        left: 20px;
        display: inline-block;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        color: white;
        background: #f7ba2a;
        border-radius:2px;
        margin-right: 14px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
    }

    /* 加 */
    .add{
        position: absolute;
        top: 12.7px;
        right: 20px;
        display: inline-block;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        color: white;
        background: #f7ba2a;
        border-radius:2px;
        margin-left: 14px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
    }
    
    .foot {
        padding: 20px 0;
        /* border: 1px solid red; */
    }

    .kong{
        border: 1px solid red!important;
        display: none!important;
    }

    .kong:nth-child(1){
        display: inline-block!important;
        visibility: hidden;
    }

    /* 商品选中样式 */
    .checked{
        background: #f7ba2a;
        color: white;
        font-weight: 600;
    }

    .goodnameBox{
        margin: 0 auto;
        display: inline-block;
        width: 70%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
    }

    .sure_btn{
        width:100%;
        height: 46px;
        line-height: 46px;
        border-top: 1px solid #ccc;
        /* border:1px solid red; */
    }

    /* 视频审核 */
    
    .VideoReview{
        /* display: none; */
        width: 100%;
        height: 350px;
        /* border: 1px solid #ccc; */
        display: flex;
        justify-content: space-between;
    }
    
    .VideoReview>div{
        /* width: 49.8%; */
        flex: 1;
    }

    /* 图片 */
    .pictures{
        margin-right: 6px;
        /* border:1px solid red; */
        border: 1px solid #ccc;
        display: flex;
        flex-direction: column;
    }

    .pictureList{
        /* width: 500px; */
        height: 42px;
        line-height: 42px;
        /* border-bottom: 1px solid #E0E1E2; */
        display: flex;
        font-size: 14px;
        text-align: center;
        /* border: 1px solid red; */
    }
    
    .pictureList>div{
        width: 100px;
        /* flex: 1; */
        /* border:1px solid red; */
        cursor: pointer;
    }

    .pictureBox{
        flex: 1;
        box-sizing: border-box;
        padding-top: 10px;
        /* border: 1px solid blue; */
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .pictureBox>div{
        display: flex;
        flex-wrap: wrap;
    }

    .pic{
        width: 118px;
        height: 118px;
        border:1px solid #777;
        margin: 10px;
        cursor: pointer;
    }

    .pic>img{
        width:100%;
        max-height:100%;
    }

    /* 视频 */
    .video{
        margin-left: 6px;
        /* border:1px solid blue; */
        display: flex;
        flex-direction: column;
        border: 1px solid #ccc;
    }

    .videoList{
        height: 42px;
        line-height: 42px;
        display: flex;
        font-size: 14px;
        text-align: center;
    }

    .videoList>div{
        width: 100px;
        cursor: pointer;
    }

    .videoBox{
        flex: 1;
        box-sizing: border-box;
        padding-top: 10px;
        /* border: 1px solid blue; */
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .videoBox>div{
        display: flex;
        flex-wrap: wrap;
    }

    .vid{
        width: 118px;
        height: 118px;
        border:1px solid #777;
        margin: 10px;
        cursor: pointer;
    }

    .vid>video{
        width:100%;
        height:100%;
    }

    .vider_active{
        border-bottom: 2px solid #fcd900;
        color: #fcd900;
        background: white;
        font-weight:600;
        font-size: 16px;
    }
</style>