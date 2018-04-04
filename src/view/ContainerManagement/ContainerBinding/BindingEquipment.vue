<template>
    <div id="admin">
        <el-form :model="deviceData" ref="taskForm" :rules="taskRules" label-width="130px">
            <el-form-item label="mac地址" prop="mac">
                <el-input v-model="deviceData.mac"></el-input>
            </el-form-item>
            <el-form-item label="摆放位置" required>
                <el-form-item class="addr-sel" prop="provinceId">
                    <el-select class="address-select" v-model="deviceData.provinceId" @change="changeProvince" placeholder="请选择省">
                        <el-option v-for="p in provinces" :label="p.name" :value="p.code" :key="p.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="addr-sel" prop="cityId">
                    <el-select class="address-select" v-model="deviceData.cityId" @change="changeCity" placeholder="请选择市">
                        <el-option v-for="c in cities" :label="c.name" :value="c.code" :key="c.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="addr-sel" prop="districtId">
                    <el-select class="address-select" v-model="deviceData.districtId" placeholder="请选择区">
                        <el-option v-for="d in districts" :label="d.name" :value="d.code" :key="d.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
                <el-input v-model="deviceData.address"></el-input>
            </el-form-item>
            <el-form-item label="地址标签" prop="address">
                <el-input v-model="deviceData.abbreviatedAddress" :maxlength="8"></el-input>
            </el-form-item>
            <el-form-item label="维护人姓名" prop="maintainPersonName">
                <el-input v-model="deviceData.maintainPersonName"></el-input>
            </el-form-item>
            <el-form-item label="维护人电话" prop="maintainPersonPhone">
                <el-input v-model="deviceData.maintainPersonPhone" :maxlength=11></el-input>
            </el-form-item>
            <el-form-item label="商务姓名" prop="bdName">
                <el-input v-model="deviceData.bdName"></el-input>
            </el-form-item>
            <el-form-item label="商务电话" prop="bdPhone">
                <el-input v-model="deviceData.bdPhone" :maxlength=11></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="memo">
                <el-input type="textarea" v-model="deviceData.memo"></el-input>
            </el-form-item>
            <el-form-item>
                <div style="text-align:center;">
                    <el-button type="warning" v-if='$route.query.data.state == 1 || $route.query.data.state == 3' @click="submit('taskForm')">保存</el-button>
                    <el-button @click="cancel">取消</el-button>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { areas } from '@/area'
    export default {
        name: 'addDevice',
        data() {
            return {
                provinces: areas.filter(area => area.level === 1),
                cities: [],
                districts: [],
                deviceData: {
                    mac: '',
                    maintainPerson: '',
                    memo: '',
                    address: '',         // 缺少地址
                    provinceId: '',
                    cityId: '',
                    districtId: '',
                    addresstag: ''
                },
                taskRules: {
                    mac: { required: true, message: '请输入mac地址', trigger: 'blur' },
                    abbreviatedAddress: { required: true, message: '请填写地址标签', trigger: 'blur' },
                    maintainPersonPhone: [{ min: 11, max: 11, message: '手机号长度为11个字符', trigger: 'blur' },
                    { required: true, message: '请输入手机号', trigger: 'blur' }],
                    bdPhone: [
                        { min: 11, max: 11, message: '手机号长度为11个字符', trigger: 'blur' },
                        { required: true, message: '请输入手机号', trigger: 'blur' }
                    ],
                    maintainPersonName: { required: true, message: '请填写维护人员姓名', trigger: 'blur' },
                    bdName: { required: true, message: '请填写BD联系人姓名', trigger: 'blur' },
                    address: { required: true, message: '请填写详细地址', trigger: 'blur' },
                    provinceId: { required: true, message: '请选择省', trigger: 'change' },
                    cityId: { required: true, message: '请选择城市', trigger: 'change' },
                    districtId: { required: true, message: '请选择区', trigger: 'change' },
                    yu: { required: true, message: '请输入低销报警阈值', trigger: 'blur' }
                }
            }
        },
        created() {
            this.provinces = areas.filter(area => area.level === 1)
            this.cities = []
            this.districts = []
            this.btnState = this.$route.query.data.state;
            this.containerState();
        },
        methods: {
            changeProvince(code) {
                const pCode = code.slice(0, 2)
                this.cities = areas.filter(area => area.level === 2 && area.sheng === pCode)
                if (!this.deviceData.cityId.startsWith(pCode)) {
                    this.deviceData.cityId = ''
                    this.deviceData.districtId = ''
                }
                this.districts = []
            },
            changeCity(code) {
                const pCode = code.substr(0, 2)
                const cCode = code.substr(2, 2)
                this.districts = areas.filter(area => area.level === 3 && area.sheng === pCode && area.di === cCode)
                if (!this.deviceData.districtId.startsWith(code.substr(0, 4))) {
                    this.deviceData.districtId = ''
                }
            },
            submit(formName) {
                /* 创建管理员 */
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$xhr('addDevice', this.deviceData).success(res => {
                            this.$message('绑定设备成功!')
                            this.$store.dispatch('changeEnter', true); // 需要刷新
                            this.$router.back()
                        }).error(res => {
                            this.$message.error(res.message)
                        })
                    } else {
                        return false
                    }
                })
            },
            cancel() {
                this.$store.dispatch('changeEnter', false); // 不需要刷新
                this.$router.back()
            },
            // 对货柜操作  绑定1 查看2 编辑3
            containerState() {
                // 绑定1 查看2 编辑3
                if (this.$route.query.data.state == 1) {
                    // 绑定
                    this.deviceData = {
                        mac: '',
                        maintainPerson: '',
                        memo: '',
                        address: '',         // 缺少地址
                        provinceId: '',
                        cityId: '',
                        districtId: '',
                        addresstag: ''
                    }
                } else if (this.$route.query.data.state == 2) {
                    // 查看
                    var obj = JSON.parse(this.$route.query.data.data)
                    this.deviceData = {
                        mac: obj.id,
                        maintainPerson: '',
                        memo: obj.memo,
                        address: obj.address,         // 缺少地址
                        provinceId: '',
                        cityId: '',
                        districtId: '',
                        addresstag: ''
                    }
                    for (var i = 0; i < areas.length; i++) {
                        if (areas[i].code == obj.provinceId.toString()) {
                            this.deviceData.provinceId = areas[i].name;

                            for (var j = 0; j < areas.length; j++) {
                                if (areas[j].code == obj.cityId.toString()) {
                                    this.deviceData.cityId = areas[j].name;

                                    for (var k = 0; k < areas.length; k++) {
                                        if (areas[k].code == obj.districtId.toString()) {
                                            this.deviceData.districtId = areas[k].name;
                                        }
                                    }

                                }
                            }

                        }
                    }
                    // console.log(JSON.parse(this.$route.query.data.data).provinceId)
                } else if (this.$route.query.data.state == 3) {
                    // 编辑
                    var obj = JSON.parse(this.$route.query.data.data)
                    this.deviceData = {
                        mac: obj.id,
                        maintainPerson: '',
                        memo: obj.memo,
                        address: obj.address,         // 缺少地址
                        provinceId: '',
                        cityId: '',
                        districtId: '',
                        addresstag: ''
                    }
                    for (var i = 0; i < areas.length; i++) {
                        if (areas[i].code == obj.provinceId.toString()) {
                            this.deviceData.provinceId = areas[i].name;

                            for (var j = 0; j < areas.length; j++) {
                                if (areas[j].code == obj.cityId.toString()) {
                                    this.deviceData.cityId = areas[j].name;

                                    for (var k = 0; k < areas.length; k++) {
                                        if (areas[k].code == obj.districtId.toString()) {
                                            this.deviceData.districtId = areas[k].name;
                                        }
                                    }

                                }
                            }

                        }
                    }
                }
            },
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #admin {
        box-sizing: border-box;
        padding: 10px 20px;
        width: 100%;
        /* height: 100%; */
        background: white;
        box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.1);
        border-radius: 5px;
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
</style>