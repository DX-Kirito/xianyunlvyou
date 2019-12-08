<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>

    <el-form class="search-form-content" ref="form" label-width="80px">
      <el-form-item label="出发城市">
        <!-- fetch-suggestions 返回输入建议的方法 -->
        <!-- select 点击选中建议项时触发 -->
        <el-autocomplete
          placeholder="请搜索出发城市"
          class="el-autocomplete"
          v-model="form.departCity"
          :fetch-suggestions="searchDepartCity"
          @select="selectDepartCity"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="到达城市">
        <el-autocomplete
          placeholder="请搜索到达城市"
          class="el-autocomplete"
          v-model="form.destCity"
          :fetch-suggestions="searchDestCity"
          @select="selectDestCity"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="出发时间">
        <!-- change 用户确认选择日期时触发 -->
        <el-date-picker
          type="date"
          placeholder="请选择日期"
          style="width: 100%;"
          v-model="form.departDate"
          @change="changeDate"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="searchTicket">搜索</el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="changeCity">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import moment from "moment"
export default {
  data() {
    return {
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" }
      ],
      currentTab: 0,
      form: {
        departCity: "",
        departCode: "",
        destCity: "",
        destCode: "",
        departDate: ""
      }
    };
  },
  methods: {
    async searchDepartCity(departCity, cb) {
      var citys = await this.getCity(departCity);
       if(!citys||citys.length==0){
        citys=[{value:"暂时不支持此城市"}]
      }
      this.form.departCode=citys[0].sort
      // console.log(res)
      // this.citys=res
      cb(citys);
    },
    selectDepartCity(item) {
      // console.log(item);
      this.form.departCity = item.value;
      this.form.departCode = item.sort;
    },
    async searchDestCity(destCity, cb) {
      var citys = await this.getCity(destCity);
      if(!citys||citys.length==0){
        citys=[{value:'暂时不支持此城市'}]
      }
      // 为了避免用户直接输入后啥都不干,直接将输入框失去焦点
      // 可以默认将城市列表第一个 sort 放入 form 当中
      this.form.destCode=citys[0].sort
      // this.citys=res
      cb(citys);
    },
    selectDestCity(item) {
      // console.log(item);
      this.form.destCity = item.value;
      this.form.destCode = item.sort;
    },
    getCity(city) {
      return this.$axios({
        url: "/airs/city",
        params: {
          name: city
        }
      }).then(res => {
        // console.log(res);
        const { data } = res.data;
        const citys = data.map(item => {
          return {
            ...item,
            value: item.name.replace("市", "")
          };
        });
        //把没有sort的城市过滤掉
        const cityList = citys.filter(item => item.sort);
        return cityList;
      });
    },
    searchTicket() {
      this.$store.commit("history/addHistoryItem", this.form)
      console.log(this.form);
      this.$router.push({
        path:'/air/flights',
        query:this.form
      })
    },
    changeCity() {
      const { departCity, departCode, destCity, destCode } = this.form;
      this.form.departCity = destCity;
      this.form.departCode = destCode;
      this.form.destCity = departCity;
      this.form.destCode = departCode;
    },
    changeDate(){
      this.form.departDate=moment(this.form.departDate).format("YYYY-MM-DD");
    },
    handleSearchTab(item, index) {
      if (index === 1) {
        this.$alert("暂时不支持往返机票查询", "提示", {
          confirmButtonText: "哦",
        });
      }
    }
  }
};
</script>

<style scoped lang="less">
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>
