<template>
  <div id="classificationList" class="classificationList">
    <el-form :model="form1" :rules="rules1" ref="form1">
      <el-button type="warning" class="addClass" @click.stop="addclass('form1')">添加分类</el-button>
    </el-form>
    <el-tree :data="data" :props="defaultProps" node-key="id" :accordion="false" :expand-on-click-node="false" :render-content="renderContent"
      :default-expanded-keys="arr" class="tree" align="left">
    </el-tree>


    <el-dialog title="修改分类" :visible.sync="editForm">
      <el-form :model="dataOnEdit" :rules="rules" ref="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="label">
          <el-input v-model="dataOnEdit.label" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类副标题" :label-width="formLabelWidth" prop="subName">
          <el-input v-model="dataOnEdit.subName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属父级" :label-width="formLabelWidth">
          <el-input v-model="dataOnEdit.parentName" auto-complete="off" disabled="disabled"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.stop.native.prevent="cancelEdit">取 消</el-button>
        <el-button type="primary" @click.stop.native.prevent="saveForm('form')">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="添加分类" :visible.sync="addForm">
      <el-form :model="form1" :rules="rules1" ref="form1">
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="label">
          <el-input v-model="form1.label" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类副标题" :label-width="formLabelWidth" prop="subName">
          <el-input v-model="form1.subName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属父级" :label-width="formLabelWidth">
          <el-input v-model="form1.parentName" auto-complete="off" disabled="disabled"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click.stop.native.prevent="newForm('form1', data )">创 建</el-button>
      </div>
    </el-dialog>


    <el-dialog title="新增分类" :visible.sync="appendForm">
      <el-form :model="form2" :rules="rules2" ref="form2">
        <el-form-item label="分类名称" :label-width="formLabelWidth" prop="label">
          <el-input v-model="form2.label" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类副标题" :label-width="formLabelWidth" prop="subName">
          <el-input v-model="form2.subName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属父级" :label-width="formLabelWidth">
          <el-input v-model="form2.parentName" auto-complete="off" disabled="disabled"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelNew">取 消</el-button>
        <el-button type="primary" @click.stop.native.prevent="createForm('form2', data )">创 建</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import { mapState, mapActions, mapMutations } from 'vuex'
  export default {
    name: 'classificationList',
    data() {
      return {
        arr: [],
        dataOnEdit: [],
        disabled: 'true',
        item: [],
        data: [],
        rules: {
          label: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
        },
        rules1: {
          label: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
        },
        rules2: {
          label: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        editForm: false,
        addForm: false,
        appendForm: false,
        form1: {
          label: '',
          subName: '',
          parentId: '',
          parentName: ''
        },
        form2: {
          label: '',
          subName: '',
          parentId: '',
          parentName: ''
        },
        formLabelWidth: '120px'
      }
    },
    created() {
      this.search()
    },
    computed: {
      ...mapState(['categoryList', 'parentNode', 'node'])
    },
    methods: {
      ...mapActions(['getCategoryList']),
      ...mapMutations(['init_store']),
      search() {
        this.getCategoryList().then(() => {
          this.data = this.categoryList
          this.getId()
        })
      },
      addclass(formName) {
        this.appendForm = true
        this.form2.parentName = '跟级分类'
        this.form2.parentId = 0
      },
      cancelAdd() {
        this.form1 = {}
        this.addForm = false
      },
      cancelEdit() {
        this.dataOnEdit = {}
        this.editForm = false
      },
      edit(data) {
        this.dataOnEdit = {
          parentId: data.parentId,
          id: data.id,
          label: data.label,
          subName: data.subName,
          parentName: data.parentName
        }
        this.arr.push(this.dataOnEdit.id)
        this.editForm = true
      },
      cancelNew() {
        this.form2 = {}
        this.appendForm = false
      },
      createForm(formName) {
        if (this.form2.label.trim() === '') {
          this.$message.error('分类名称不能为空')
          return false
        }
        this.form2.parentId = 0
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$xhr('addCategory', this.form2).success(res => {
              this.$message('创建成功!')
              this.appendForm = false
              this.search()
              this.form2.label = ''
              this.form2.subName = ''
            }).error(res => {
              this.$message.error('创建失败!')
            })
          } else {
            return false
          }
        })
      },
      append(data, e) {
        this.form1.parentName = data.label
        this.form1.parentId = data.id
        this.arr.push(this.form1.parentId)
        this.addForm = true
      },
      remove(data) {
        this.arr.push(data.id)
        this.$xhr('removeCategory', {
          ids: [data.id]
        }).success(res => {
          this.$alert('删除成功')
          this.search()
        }).error(res => {
          this.$message.error(res.message)
        })
      },
      saveForm(formName) {
        if (this.dataOnEdit.label.trim() === '') {
          this.$message.error('分类名称不能为空')
          return false
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$xhr('updateCategory', this.dataOnEdit).success(res => {
              this.$message('修改成功!')
              this.search()
              this.editForm = false
            }).error(res => {
              this.$message.error('修改失败!')
            })
          } else {
            return false
          }
        })
      },
      newForm(formName) {
        if (this.form1.label.trim() === '') {
          this.$message.error('分类名称不能为空')
          return false
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.arr.push(this.form1.id)
            this.$xhr('addCategory', this.form1).success(res => {
              this.$message('创建成功!')
              this.addForm = false
              this.search()
              this.form1.label = ''
              this.form1.subName = ''
            }).error(res => {
              this.$message.error('创建失败!')
            })
          } else {
            return false
          }
        })
      },
      getId() {
        if (this.categoryList.length === 0) {
        } else {
          for (var a = 0; a < this.categoryList.length; a++) {
            var obj1 = this.categoryList[a]
            if (obj1.children) {
              for (var b = 0; b < obj1.children.length; b++) {
                var obj2 = obj1.children[b]
                if (obj2.children) {
                  for (var c = 0; c < obj2.children.length; c++) {
                    var obj3 = obj2.children[c]
                    this.item.push(obj3.parentId)
                  }
                }
              }
            }
          }
        }
      },
      renderContent(h, { node, data }) {
        return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
            <span style="float: right; margin-right: 20px">
              <span></span>
              <el-button v-show={this.item.every((v, i) => data.parentId !== v)} size="mini" on-click={() => this.append(data)}>添加子级</el-button>
              <el-button size="mini" on-click={() => this.edit(data)}>编辑</el-button>
              <el-button size="mini" on-click={() => this.remove(data)}>删除</el-button>
            </span>
          </span>
        )
      }
    }
  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .classificationList {
    width: 100%;
    /* height: 100%; */
    background: white;
    box-sizing: border-box;
    padding: 10px 20px;
    box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
    -webkit-box-shadow: 0 1px 20px 0 rgba(238, 238, 238, 0.5);
  }



  .tree {
    width: 90%;
    margin-top: 1%;
    /* margin-left: 5%; */
    /* float: left; */
  }

  h2 {
    /* float: left; */
    /* margin-left: 15%; */
  }

  .addClass {
    margin-top: 10px;
    /* margin-left: 5%; */
    /* float: left; */
  }
</style>