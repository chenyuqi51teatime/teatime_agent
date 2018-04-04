<template>
    <div id="deviceDetail">
        <el-form :model="form" ref="taskForm" :rules="taskRules" label-width="150px">
            <!-- <el-form-item label="货柜编号">
        {{form.id}}
      </el-form-item> -->

            <el-form-item label="mac地址">
                <el-input v-model="form.mac" :maxlength=11 :disabled="true"></el-input>
            </el-form-item>
            <!-- <el-form-item label="绑定时间">
        {{form.createtime}}
      </el-form-item> -->

            <el-form-item label="摆放位置" required>
                <el-form-item class="addr-sel" prop="provinceId">
                    <el-select class="address-select" v-model="form.provinceId" @change="changeProvince" placeholder="请选择省">
                        <el-option v-for="p in provinces" :label="p.name" :value="p.code" :key="p.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="addr-sel" prop="cityId">
                    <el-select class="address-select" v-model="form.cityId" @change="changeCity" placeholder="请选择市">
                        <el-option v-for="c in cities" :label="c.name" :value="c.code" :key="c.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="addr-sel" prop="districtId">
                    <el-select class="address-select" v-model="form.districtId" placeholder="请选择区">
                        <el-option v-for="d in districts" :label="d.name" :value="d.code" :key="d.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form-item>

            <el-form-item label="详细地址" prop="address">
                <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="地址标签" prop="address">
                <el-input v-model="form.abbreviatedAddress" :maxlength="8"></el-input>
            </el-form-item>
            <el-form-item label="维护人姓名" prop="maintainPersonName">
                <el-input v-model="form.maintainPersonName"></el-input>
            </el-form-item>
            <el-form-item label="维护人电话" prop="maintainPersonPhone">
                <el-input v-model="form.maintainPersonPhone" :maxlength=11></el-input>
            </el-form-item>
            <el-form-item label="商务姓名" prop="bdName">
                <el-input v-model="form.bdName"></el-input>
            </el-form-item>
            <el-form-item label="商务电话" prop="bdPhone">
                <el-input v-model="form.bdPhone" :maxlength=11></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input class="input-area" type="textarea" v-model="form.memo"></el-input>
            </el-form-item>
            <el-form-item>
                <div style="text-align:center;">
                    <el-button class="sure" type="warning" @click="onSubmit('taskForm')">保存</el-button>
                    <el-button class="sure" @click="back">返回</el-button>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { areas } from '@/area'
    export default {
        name: 'category_new',
        components: {},
        data() {
            return {
                provinces: areas.filter(area => area.level === 1),
                cities: [],
                districts: [],
                list: [],
                listbar: [],
                page: {
                    totalPage: 1,
                    pageNo: 1,
                    pageSize: 10,
                    total: 0
                },
                form: {
                    id: this.$route.params.did,
                    mac: '',
                    createTime: '',
                    createtime: '',
                    memo: '',
                    abbreviatedAddress: '',
                    provinceId: '',
                    cityId: '',
                    districtId: ''
                },
                searchId: {
                    deviceId: this.$route.params.did
                },
                taskRules: {
                    maintainPersonPhone: [{ min: 11, max: 11, message: '手机号长度为11个字符', trigger: 'blur' },
                    { required: true, message: '请输入手机号', trigger: 'blur' }],
                    bdPhone: [
                        { min: 11, max: 11, message: '手机号长度为11个字符', trigger: 'blur' },
                        { required: true, message: '请输入手机号', trigger: 'blur' }
                    ],
                    maintainPersonName: { required: true, message: '请填写维护人员姓名', trigger: 'blur' },
                    bdName: { required: true, message: '请填写BD联系人姓名', trigger: 'blur' },
                    address: { required: true, message: '请填写详细地址', trigger: 'blur' },
                    abbreviatedAddress: { required: true, message: '请填写地址标签', trigger: 'blur' },
                    provinceId: { required: true, message: '请选择省', trigger: 'change' },
                    cityId: { required: true, message: '请选择城市', trigger: 'change' },
                    districtId: { required: true, message: '请选择区', trigger: 'change' }
                }
            }
        },
        created() {
            /*  取到设备详细和商品表格  */
            this.detail()
            // console.log(areas)
        },
        methods: {
            changeProvince(code) {
                const pCode = code.slice(0, 2)
                this.cities = areas.filter(area => area.level === 2 && area.sheng === pCode)
                if (!this.form.cityId.startsWith(pCode)) {
                    this.form.cityId = ''
                    this.form.districtId = ''
                }
                this.districts = []
            },
            changeCity(code) {
                const pCode = code.substr(0, 2)
                const cCode = code.substr(2, 2)
                this.districts = areas.filter(area => area.level === 3 && area.sheng === pCode && area.di === cCode)
                if (!this.form.districtId.startsWith(code.substr(0, 4))) {
                    this.form.districtId = ''
                }
            },
            detail() {
                this.$get('deviceDetailApis', {
                    params: this.searchId.deviceId
                }).success(res => {
                    // console.log(res)
                    this.form = res.source
                    if (res.source.provinceId === 0) {
                        res.source.provinceId = ''
                    }
                    if (res.source.cityId === 0) {
                        res.source.cityId = ''
                    }
                    if (res.source.districtId === 0) {
                        res.source.districtId = ''
                    }

                    for (var i = 0; i < areas.length; i++) {
                        if (areas[i].code == res.source.provinceId) {
                            this.form.provinceId = areas[i].name
                        }
                        if (areas[i].code == res.source.cityId) {
                            this.form.cityId = areas[i].name
                        }
                        if (areas[i].code == res.source.districtId) {
                            this.form.districtId = areas[i].name
                        }
                    }

                    this.form.provinceId = res.source.provinceId + ''
                    this.form.cityId = res.source.cityId + ''
                    this.form.districtId = res.source.districtId + ''
                    this.form.createtime = this.formatDate(new Date(this.form.createTime))
                })
            },
            onSubmit(formName) {
                // console.log(this.form)
                this.list.forEach(e => {
                    e.id = ''
                })
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        for (var i = 0; i < areas.length; i++) {
                            if (areas[i].name == this.form.provinceId) {
                                this.form.provinceId = areas[i].code
                            }
                            if (areas[i].name == this.form.cityId) {
                                this.form.cityId = areas[i].code
                            }
                            if (areas[i].name == this.form.districtId) {
                                this.form.districtId = areas[i].code
                            }
                        }
                        console.log(this.form)
                        this.$xhr('updateDeviceDetails', this.form).success(res => {
                            this.$message('更新设备详情成功!')
                            this.$store.dispatch('changeEnter', true); // 需要刷新
                            this.$router.back()
                        }).error(err => {
                            this.$message.error(err.message)
                        })
                    } else {
                        return false
                    }
                })
            },
            back() {
                this.$store.dispatch('changeEnter', false); // 不需要刷新
                this.$router.back()
            },
            formatDate(now) {
                var year = now.getFullYear()
                var month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1
                var date = now.getDate() < 10 ? '0' + (now.getDate()) : now.getDate()
                var hour = now.getHours() < 10 ? '0' + (now.getHours()) : now.getHours()
                var minute = now.getMinutes() < 10 ? '0' + (now.getMinutes()) : now.getMinutes()
                var second = now.getSeconds() < 10 ? '0' + (now.getSeconds()) : now.getSeconds()
                return year + '-' + month + '-' + date + '  ' + hour + ':' + minute + ':' + second
            }
        }
    }

</script>

<style scoped>
    #deviceDetail {
        box-sizing: border-box;
        padding: 10px 20px;
        width: 100%;
        /* height: 100%; */
        background: white;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
    }

    .data-header {
        display: flex;
        justify-content: space-between;
    }

    .new-data {
        height: 40px!important;
        margin-top: 10px;
    }

    .sure {
        margin-top: 10px;
    }

    .new {
        float: right;
        margin-top: 5px;
        margin-left: 10px;
    }

    .sensor {
        float: left;
    }

    .table {
        width: 100%;
        height: 1px;
        margin-top: 80px;
    }

    .addr-sel {
        float: left;
        margin-right: 10px;
    }

    .address-input {
        width: 300px;
        margin-top: 30px;
    }

    .add-txt {
        float: left;
    }

    .image {
        height: 40px;
    }
</style>