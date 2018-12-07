<template>
  <div class="app-container">
    <div class="app-fifter">
      <!-- 简单搜索 -->
      <el-form
        :inline="true"
        ref="searchQuery"
        :model="listQuery"
        v-if="isSimpleShow"
        class="demo-form-inline"
      >
        <el-form-item label="用户名">
          <el-input size="small" v-model="listQuery.name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select size="small" v-model="listQuery.status" placeholder="请选择状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSearch" icon="el-icon-search">查询</el-button>
          <el-button size="small" @click="onReset" icon="el-icon-refresh">重置</el-button>
          <el-button size="small" type="text" @click="onShow">
            展开
            <i class="el-icon-arrow-down"></i>
          </el-button>
        </el-form-item>
      </el-form>
      <!-- 复杂搜索 -->
      <el-form
        :inline="true"
        ref="searchQuery"
        :model="listQuery"
        v-if="isShow"
        class="demo-form-inline"
      >
        <el-form-item label="用户名">
          <el-input size="small" v-model="listQuery.name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select size="small" v-model="listQuery.status" placeholder="请选择状态">
            <el-option
              number
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select size="small" v-model="listQuery.role" placeholder="请选择角色">
            <el-option
              v-for="item in roleOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSearch" icon="el-icon-search">查询</el-button>
          <el-button size="small" @click="onReset" icon="el-icon-refresh">重置</el-button>
          <el-button size="small" type="text" @click="onSimpleShow">
            收起
            <i class="el-icon-arrow-up"></i>
          </el-button>
        </el-form-item>
      </el-form>
      <!-- 功能按钮 -->
      <div>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="onCreate">新建</el-button>
      </div>
    </div>
    <!-- 主要内容 -->
    <div class="app-page">
      <!-- 表格 -->
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-spinner="el-icon-loading"
        element-loading-text="加载中"
        fit
        highlight-current-row
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="info-table-expand">
              <el-form-item label="ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="用户名">
                <span>{{ props.row.name }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center" label="序号" width="100">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag
              size="mini"
              v-if="scope.row.status == 1"
              :type="scope.row.status | statusFilter"
            >启用</el-tag>
            <el-tag
              size="mini"
              v-if="scope.row.status == 2"
              :type="scope.row.status | statusFilter"
            >禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="角色" align="center">
          <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.role == 1" :type="scope.row.role | statusFilter">客服</el-tag>
            <el-tag size="mini" v-if="scope.row.role == 2" :type="scope.row.role | statusFilter">运维</el-tag>
            <el-tag size="mini" v-if="scope.row.role == 3" :type="scope.row.role | statusFilter">开发</el-tag>
            <el-tag size="mini" v-if="scope.row.role == 4" :type="scope.row.role | statusFilter">管理员</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="修改时间">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ scope.row.modifyTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <a v-permission="['admin']" size="mini" @click="onHandleEdit(scope.row)">编辑</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页插件 -->
    <div class="page-size">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.current"
        :page-sizes="[10, 50, 100]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 修改/添加弹窗 -->
    <el-dialog
      :title="modalType ==='create' ? '添加用户' : '修改用户'"
      :visible.sync="modalVisible"
      top="10vh"
      @close="onClose('dataForm')"
    >
      <el-form
        ref="dataForm"
        :model="formParams"
        :rules="userValidate"
        label-position="left"
        label-width="70px"
        style="width: 50%; margin:0 auto;"
      >
        <el-form-item label="角色名" prop="name">
          <el-input size="small" placeholder="请输入用户名" v-model="formParams.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input size="small" placeholder="请输入手机号" v-model="formParams.phone"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select size="small" v-model="formParams.status" placeholder="请选择状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select size="small" v-model="formParams.role" placeholder="请选择角色">
            <el-option
              v-for="item in roleOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            @click="modalType === 'create' ? onHandleAdd('dataForm') : onHandleUpdate('dataForm')"
          >保存</el-button>
          <el-button size="small" @click="onResetForm('dataForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style>
.info-table-expand {
  font-size: 0;
}
.info-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.info-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.pages {
  float: right;
  padding: 1.5rem;
}
</style>

<script>
import { getUserList, addUser } from "@/api/sys";
import permission from "@/directive/permission/index.js";

export default {
  // 权限
  directives: {
    permission
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: "success",
        2: "error"
      };
      return statusMap[status];
    },
    statusName(status) {
      const statusMap = {
        1: "启用",
        2: "禁用"
      };
      return statusMap[status];
    }
  },
  data() {
    const validateName = function(rule, value, callback) {
      if (value == "") {
        return callback(new Error("请输入用户名"));
      }
      if (!value) {
        return callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    const validatePhone = function(rule, value, callback) {
      if (!value) {
        return callback(new Error("请输入手机号"));
      } else if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(value)) {
        return callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    return {
      list: null, //列表数据
      listLoading: false, // 表格loading状态
      isSimpleShow: true, // 简单搜索
      isShow: false, // 复制搜索
      listQuery: {
        current: 1,
        limit: 10,
        name: "",
        status: "",
        role: ""
      },
      total: 0, // 总条数
      statusOptions: [{ label: "启用", key: "1" }, { label: "禁用", key: "2" }],
      roleOptions: [
        { label: "客服", key: "1" },
        { label: "运维", key: "2" },
        { label: "开发", key: "3" },
        { label: "管理员", key: "4" }
      ],
      modalVisible: false, // 是否显示弹窗
      modalType: "create", // modal类型 添加/修改
      formParams: {
        status: null,
        name: null,
        phone: null,
        role: null
      },
      userValidate: {
        status: [
          {
            required: true,
            type: "string",
            message: "请选择状态",
            trigger: "change"
          }
        ],
        role: [
          {
            required: true,
            type: "string",
            message: "请选择角色",
            trigger: "change"
          }
        ],
        name: [
          {
            required: true,
            type: "string",
            validator: validateName,
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            type: "string",
            validator: validatePhone,
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    // 获取列表数据
    queryList() {
      this.listLoading = true;
      getUserList(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    // 修改分页大小
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.onSearch();
    },

    // 修改当前页码
    handleCurrentChange(val) {
      this.listQuery.current = val;
      this.onSearch();
    },
    // 搜索
    onSearch() {
      this.queryList();
    },
    // 重置搜索框
    onReset(name) {
      this.listQuery = {};
    },
    // 显示复杂搜索
    onShow() {
      this.isSimpleShow = false;
      this.isShow = true;
    },
    // 显示简单搜索
    onSimpleShow() {
      this.isSimpleShow = true;
      this.isShow = false;
      this.listQuery.role = null;
    },
    // 添加用户
    onCreate() {
      this.modalVisible = true;
    },
    // 修改用户
    onHandleEdit(params) {
      this.modalVisible = true;
      this.modalType = "update";
      this.formParams = Object.assign({}, params);
    },
    // 重置Form表单
    onResetForm(name) {
      this.$refs[name].resetFields();
    },
    // 关闭Form表单
    onClose(name) {
      this.$refs[name].resetFields();
      this.modalType = "create";
    },
    // 添加用户
    onHandleAdd(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.modalVisible = false;
          addUser(this.formParams).then(response => {
            this.$message({
              message: "保存成功",
              type: "success",
              center: true
            });
            this.onResetForm(name);
            this.queryList();
          });
        } else {
          this.$message.error({
            message: "请检查输入是否正确",
            type: "error",
            center: true
          });
        }
      });
    },
    // 修改用户
    onHandleUpdate(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.modalVisible = false;
          this.modalType = "create";
          addUser(this.formParams).then(response => {
            this.$message({
              message: "修改成功",
              type: "success",
              center: true
            });
            this.onResetForm(name);
            this.queryList();
          });
        } else {
          this.$message.error({
            message: "请检查输入是否正确",
            type: "error",
            center: true
          });
        }
      });
    }
  }
};
</script>
