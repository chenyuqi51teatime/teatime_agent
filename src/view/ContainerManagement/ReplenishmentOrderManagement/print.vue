<template>
    <div class="print">
        <div class="doPrint">
            <div class="dis">startprint</div>
            <div class="titles"> 补 货 单 </div>
            <div class="print_msg">
                <div class="print_txt">
                    <p style="font-size:18px;">补货单号：<span>{{data.replenishmentOrderId}}</span></p>
                    <p style="font-size:18px;">货柜编号：<span>{{data.vendorId}}</span></p>
                    <p style="font-size:18px;">摆放地址：<span>{{data.vendorAddress}}</span></p>
                    <p style="font-size:18px;">打印时间：<span>{{printTime}}</span></p>
                </div>
                <div class="print_ewm" id='code' ref="print_ewm"></div>
            </div>
            <table border="1" cellSpacing='0' cellPadding='10' width='100%' class="tab" style="page-break-after:always">
                <tHead>
                    <tr>
                        <td width='40'></td>
                        <td>商品名称</td>
                        <td style="width:70px;">摆放货道</td>
                        <td style="width:50px;">应补</td>
                        <td style="width:50px;">实补</td>
                        <td style="width:50px;">退回</td>
                        <td style="width:180px;">备注</td>
                    </tr>
                </tHead>
                <tbody>
                    <tr v-for='(v,i) in this.printList' class="tab_tr">
                        <!--  数量  -->
                        <td>{{i+1}}</td>
                        <td style="text-align:left;">{{v.productName}}</td>
                        <!--  摆放货道  -->
                        <td>{{v.pan}}</td>
                        <!--  应补数量  -->
                        <td>{{v.expectNum}}</td>
                        <!--  实补数量  -->
                        <td>{{v.actualNum}}</td>
                        <!--  退回数量  -->
                        <td>{{v.backNum}}</td>
                        <!--  备注  -->
                        <td>{{v.memo}}</td>
                    </tr>
                </tbody>
            </table>
            <div class="dis">endprint</div>
        </div>
    </div>
</template>
<script>
    import QRCode from 'qrcodejs2'
    export default {
        data() {
            return {
                data: null,
                printList: [], // 打印机数据
                codes: '',
                printTime: null,
            }
        },
        methods: {
            useqrcode() {
                var _this = this
                //  console.log(this.data.replenishmentOrderId)
                // console.log(_this.data.replenishmentOrderId.toString())
                var code = document.getElementById('code')
                let qrcode = new QRCode(code, {
                    width: 150,
                    height: 150,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    text: _this.data.replenishmentOrderId.toString() // 二维码内容
                });
            },
            doPrint() {
                var bdhtml = window.document.body.innerHTML;//获取当前页的html代码
                var sprnstr = "startprint";//设置打印开始区域
                var eprnstr = "endprint";//设置打印结束区域
                var prnhtml = bdhtml.substring(bdhtml.indexOf(sprnstr) + 16); //从开始代码向后取html
                prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr) - 25);//从结束代码向前取html
                window.document.body.innerHTML = prnhtml;
                // window.document.body.innerHTML = bdhtml;
                window.print()
            }
        },
        mounted() {
            this.useqrcode();
        },
        created() {
            var _this = this;
            // this.useqrcode();
            this.data = JSON.parse(this.$route.query.orderData);
            // 打印时间
            this.printTime = JSON.parse(this.$route.query.skuDatas).replenishmentDetailList[0].printTime;
            function add0(m) { return m < 10 ? '0' + m : m }
            function format(createTime) {
                //shijianchuo是整数，否则要parseInt转换
                var time = new Date(createTime);
                var y = time.getFullYear();
                var m = time.getMonth() + 1;
                var d = time.getDate();
                var h = time.getHours();
                var mm = time.getMinutes();
                var s = time.getSeconds();
                return _this.printTime = y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
            }
            format(this.printTime)

            this.printList = JSON.parse(this.$route.query.skuDatas).replenishmentDetailList;
            
            // 处理托盘

            // 取最大值
            var arr = [];
            
            this.printList.forEach((v, i) => {
                arr.push(Number(v.sensorId.toString().slice(2,3)))
            })

            var max = Math.max.apply(null,arr);
            
            this.printList.map((v, i) => {
                v.pan = (max + 1 - parseInt(v.sensorId.toString().slice(2, 3))) + '' + (parseInt(v.sensorId.toString().slice(3, 4)) + 1);
            })
            
            this.printList.sort((a, b) => {
                return a.pan - b.pan
            })

            this.printList.map((v, i) => {
                v.pan = v.pan.slice(0,1) + '-' + v.pan.slice(1,2)
            })

            // 调取打印机
            setTimeout(() => {
                this.doPrint();
            }, 1)
        }
    }

</script>
<style scoped>
    @media print {
        .noprint {
            display: none;
        }
    }

    #canvas {
        width: 150px!important;
        height: 150px!important;
    }

    .print {
        width: 100%;
        height: 100%;
        background: white;
        box-sizing: border-box;
        padding: 10px 20px;
        box-shadow: 0 1px 4px 0 rgba(238, 238, 238, 0.5);
        -webkit-box-shadow: 0 1px 4px 0 rgba(238, 238, 238, 0.5);
        /*page-break-before:always;*/
    }

    .doPrint {
        position: fixed;
        top: 0px;
        left: 0;
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        /* border: 1px solid red; */
        background: white;
        z-index: 1000;
        /* width: 650px; */
        font-size: 16px;
    }

    .dis {
        display: none;
    }

    .titles {
        padding: 20px 0 10px 0;
        text-align: center;
        width: 100%;
        font-size: 26px;
    }

    .print_msg {
        margin: 0 auto;
        width: 85%;
        display: flex;
        padding-bottom: 24px;
    }

    .print_txt {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .print_txt>p {
        flex: 1;
        line-height: 38px;
        font-size: 14px;
    }

    .print_ewm {
        margin-right: 20px;
    }

    .tab {
        margin: 10px auto 0 auto;
        width: 85%;
        /* margin-top: 10px; */
        text-align: center;
        font-size: 16px;
    }

    .tab_tr {
        height: 46px;
        font-size: 16px;
    }
</style>