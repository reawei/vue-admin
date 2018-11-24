<template>
  <div class="app-container">
    <div class="app-fifter">
      <el-form :inline="true" ref="searchQuery" :model="listQuery" v-if="isSimpleShow" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input size="small" v-model="listQuery.name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select size="small" v-model="listQuery.status" placeholder="请选择状态">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSearch" icon="el-icon-search">查询</el-button>
          <el-button size="small" @click="onReset" icon="el-icon-refresh">重置</el-button>
          <el-button size="small" type="text" @click="onShow">展开<i class="el-icon-arrow-down"></i></el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="listQuery" v-if="isShow" class="demo-form-inline">
          <el-form-item label="用户名">
          <el-input size="small" v-model="listQuery.name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select size="small" v-model="listQuery.status" placeholder="请选择状态">
            <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSearch" icon="el-icon-search">查询</el-button>
          <el-button size="small" @click="onReset" icon="el-icon-refresh">重置</el-button>
          <el-button size="small" type="text" @click="onSimpleShow">收起<i class="el-icon-arrow-up"></i></el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" size="small" icon="el-icon-plus">新建</el-button>
      </div>
    </div>
 
    <div class="app-page">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-spinner="el-icon-loading"
        element-loading-text="加载中"
        fit
        highlight-current-row>
          <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="info-table-expand">
              <el-form-item label="ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="用户名">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="订单号">
                <span>{{ props.row.orderId }}</span>
              </el-form-item>
              <el-form-item label="手机号">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="身份证号">
                <span>{{ props.row.idCard }}</span>
              </el-form-item>
              <el-form-item label="IP">
                <span>{{ props.row.ip }}</span>
              </el-form-item>
              <el-form-item label="状态">
                  <el-tag size="mini" v-if="props.row.status == 1" :type="props.row.status | statusFilter">创建</el-tag>
                  <el-tag size="mini" v-if="props.row.status == 2" :type="props.row.status | statusFilter">支付中</el-tag>
                  <el-tag size="mini" v-if="props.row.status == 3" :type="props.row.status | statusFilter">未支付</el-tag>
                  <el-tag size="mini" v-if="props.row.status == 4" :type="props.row.status | statusFilter">成功</el-tag>
                  <el-tag size="mini" v-if="props.row.status == 5" :type="props.row.status | statusFilter">退款</el-tag>
              </el-form-item>
              <el-form-item label="地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.createTime }}</span>
              </el-form-item>
              <el-form-item label="修改时间">
                <span>{{ props.row.modifyTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column align="center" label="序号" width="100">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单号" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.orderId }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.status == 1" :type="scope.row.status | statusFilter">创建</el-tag>
            <el-tag size="mini" v-if="scope.row.status == 2" :type="scope.row.status | statusFilter">支付中</el-tag>
            <el-tag size="mini" v-if="scope.row.status == 3" :type="scope.row.status | statusFilter">未支付</el-tag>
            <el-tag size="mini" v-if="scope.row.status == 4" :type="scope.row.status | statusFilter">成功</el-tag>
            <el-tag size="mini" v-if="scope.row.status == 5" :type="scope.row.status | statusFilter">退款</el-tag>
          </template>
        </el-table-column>
         <el-table-column align="center" prop="created_at" label="创建时间">
          <template slot-scope="scope">
            <i class="el-icon-time"/>
            <span>{{ scope.row.createTime }}</span>
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
           <el-button v-permission="['admin']" size="mini" @click="onHandleEdit(scope.row)">编辑</el-button>
           <el-button v-permission="['admin']" size="mini" @click="onHandleDel(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-size">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.current"
        :page-sizes="[10, 50, 100]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
      <el-dialog title="修改订单" :visible.sync="editModalVisible" top='10vh'>
        <el-form ref="dataForm" :model="formParams" label-position="left" label-width="70px" style="width: 50%; margin:0 auto;">
          <el-form-item label="ID">
            <span>{{ formParams.id }}</span>
          </el-form-item>
          <el-form-item label="用户名">
            <span>{{ formParams.name }}</span>
          </el-form-item>
          <el-form-item label="订单号">
            <span>{{ formParams.orderId }}</span>
          </el-form-item>
          <el-form-item label="手机号">
            <span>{{ formParams.phone }}</span>
          </el-form-item>
          <el-form-item label="身份证号">
            <span>{{ formParams.idCard }}</span>
          </el-form-item>
          <el-form-item label="IP">
            <span>{{ formParams.ip }}</span>
          </el-form-item>
          <el-form-item label="状态">
            <el-select size="small" v-model="formParams.status" placeholder="请选择状态">
              <el-option v-for="item in statusOptions" :key="item.key" :label="item.label" :value='item.key'/>
            </el-select>
          </el-form-item>
          <el-form-item label="地址">
            <span>{{ formParams.address }}</span>
          </el-form-item>
          <el-form-item label="创建时间">
            <span>{{ formParams.createTime }}</span>
          </el-form-item>
          <el-form-item label="修改时间">
            <span>{{ formParams.modifyTime }}</span>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="editModalVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="onUpdate">保存</el-button>
      </div>
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
import { getPayList, updatePayById, delPayById } from "@/api/order";
import permission from "@/directive/permission/index.js";

export default {
  directives: { permission },
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
    return {
      list: null,
      listLoading: true,
      isSimpleShow: true,
      isShow: false,
      editModalVisible: false,
      statusOptions: [
        { label: "创建", key: 1 },
        { label: "支付中", key: 2 },
        { label: "未支付", key: 3 },
        { label: "成功", key: 4 },
        { label: "退款", key: 5 }
      ],
      listQuery: {
        current: 1,
        limit: 10,
        author: null,
        status: null,
        type: null
      },
      formParams: {
        name: null,
        orderId: null,
        phone: null,
        idCard: null,
        status: null,
        ip: null,
        address: null,
        createTime: null,
        modifyTime: null
      },
      total: 0
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    queryList() {
      this.listLoading = true;
      getPayList(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.onSearch();
    },
    handleCurrentChange(val) {
      this.listQuery.current = val;
      this.onSearch();
    },
    onSearch() {
      this.queryList();
    },
    onReset(name) {
      this.listQuery = {};
      this.queryList();
    },
    onShow() {
      this.isSimpleShow = false;
      this.isShow = true;
    },
    onSimpleShow() {
      this.isSimpleShow = true;
      this.isShow = false;
      this.listQuery.type = null;
    },
    onHandleEdit(params) {
      this.editModalVisible = true;
      this.formParams = Object.assign({}, params);
    },
    onUpdate() {
      let params = {};
      params.id = this.formParams.id;
      params.status = this.formParams.status;
      updatePayById(params).then(response => {
        this.editModalVisible = false;
        this.queryList();
      });
    },
    onHandleDel(id) {
      let params = {};
      params.id = id;
      delPayById(params).then(response => {
        this.queryList();
      });
    }
  }
};
</script>
