<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightsFilters :flights="cacheFlightsData" @setFlightsData="setFlightsData" />

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <div>
          <!-- 航班列表 -->
          <FlightsItem v-for="(item,index) in dataList" :key="index" :flights="item" />
          <el-pagination
            :total="this.flightsData.total"
            :page-sizes="[10,20,25,30]"
            :page-size="pageSize"
            :current-page="pageIndex"
            @current-change="handleCurrentChange"
            @size-change="changePageSize"
            v-if="this.flightsData.total>0"
            layout="sizes,prev, pager, next"
          />
          <div v-else-if="!isLoad">
            暂时无数据
          </div>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
        <FilghtsAside />
      </div>
    </el-row>
  </section>
</template>

<script>
import FlightsListHead from '@/components/air/flightsListHead.vue'
import FlightsItem from '@/components/air/flightsItem.vue'
import FlightsFilters from '@/components/air/flightsFilters.vue'
import FilghtsAside from '@/components/air/flightsAside.vue'
export default {
  components: {
    FlightsItem,
    FlightsListHead,
    FlightsFilters,
    FilghtsAside
  },
  data () {
    return {
       cacheFlightsData: {
        flights: [],
        options: {},
        info: {}
      },
      flightsData: {
        flights: [],
        options: {},
        info: {}
      },
      // dataList: [],
      pageSize: 10,
      pageIndex: 1,
      isLoad: true
    }
  },
  watch:{
    $route(){
      this.loadPageData()
    }
  },
  computed: {
    dataList () {
      var start = (this.pageIndex - 1) * this.pageSize
      var end = start + this.pageSize
      return this.flightsData.flights.slice(start, end)
    }
  },
  mounted () {
   this.loadPageData()
  },
  methods: {
    handleCurrentChange (value) {
      this.pageIndex = value
    },
    changePageSize (value) {
      this.pageSize = value
    },
    setFlightsData (newflights) {
      this.flightsData.flights = newflights
    },
    loadPageData(){
       this.$axios({
      url: 'airs',
      params: this.$route.query
    }).then((res) => {
      this.flightsData = res.data
      // console.log(this.flightsData)
      this.cacheFlightsData = { ...res.data }
      console.log(this.ckcheFlightsData);
      this.isLoad = false
    })
    }
  }
}
</script>

<style scoped lang="less">
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>
