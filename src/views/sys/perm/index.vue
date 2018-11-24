<template>
  <div class="app-container">
    <div class="app-fifter">
      <el-form :inline="true" :model="listQuery" v-if="isSimpleShow" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input size="small" v-model="listQuery.author" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select size="small" v-model="listQuery.status" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSearch">查询</el-button>
          <el-button size="small" @click="onReset">重置</el-button>
          <el-button size="small" type="text" @click="onShow">展开<i class="el-icon-arrow-down"></i></el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="listQuery" v-if="isShow" class="demo-form-inline">
          <el-form-item label="用户名">
          <el-input size="small" v-model="listQuery.author" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select size="small" v-model="listQuery.status" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="2"></el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="角色">
          <el-select size="small" v-model="listQuery.type" placeholder="请选择角色">
            <el-option label="客服" value="1"></el-option>
            <el-option label="运维" value="2"></el-option>
            <el-option label="开发" value="3"></el-option>
            <el-option label="管理员" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="onSearch">查询</el-button>
          <el-button size="small" @click="onReset">重置</el-button>
          <el-button size="small" type="text" @click="onSimpleShow">收起<i class="el-icon-arrow-up"></i></el-button>
        </el-form-item>
      </el-form>
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
              <el-form-item label="名称">
                <span>{{ props.row.title }}</span>
              </el-form-item>
              <el-form-item label="用户名">
                <span>{{ props.row.author }}</span>
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
            <span>{{ scope.row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.status == 1" :type="scope.row.status | statusFilter">启用</el-tag>
            <el-tag size="mini" v-if="scope.row.status == 2" :type="scope.row.status | statusFilter">禁用</el-tag>
          </template>
        </el-table-column>
         <el-table-column class-name="status-col" label="角色" align="center">
          <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.type == 1" :type="scope.row.type | statusFilter">客服</el-tag>
            <el-tag size="mini" v-if="scope.row.type == 2" :type="scope.row.type | statusFilter">运维</el-tag>
            <el-tag size="mini" v-if="scope.row.type == 3" :type="scope.row.type | statusFilter">开发</el-tag>
            <el-tag size="mini" v-if="scope.row.type == 4" :type="scope.row.type | statusFilter">管理员</el-tag>
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
    padding:1.5rem;
  }
</style>

<script>
import { getPermList } from '@/api/sys';
import permission from '@/directive/permission/index.js';

export default {
  directives: { permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'error',
      }
      return statusMap[status]
    },
    statusName(status) {
       const statusMap = {
        1: '启用',
        2: '禁用',
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      isSimpleShow: true,
      isShow: false,
      listQuery: {
        current: 1,
        limit: 10,
        author: null,
        status: null,
        type: null,
      },
      total: 0,
    }
  },
  created() {
    this.queryList()
  },
  methods: {
    queryList() {
      this.listLoading = true
      getPermList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
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
      this.listQuery={};
      this.queryList();
    },
    onShow() {
      this.isSimpleShow= false;
      this.isShow= true;
    },
    onSimpleShow() {
      this.isSimpleShow= true;
      this.isShow= false;
      this.listQuery.type = null;
    },
    onHandleEdit(params) {
      console.log(params)
    }
  }
}
</script>
