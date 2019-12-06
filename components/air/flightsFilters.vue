<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{ flights.info.departCity }} - {{ flights.info.destCity }}
        /
        {{ flights.info.departDate }}
      </el-col>
      <el-col :span="4">
        <el-select v-model="airport" @change="runfilters" size="mini" placeholder="起飞机场">
          <el-option
            v-for="(item,index) in flights.options.airport"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="flightTimes" @change="runfilters" size="mini" placeholder="起飞时间">
          <el-option v-for="(item,index) in flights.options.flightTimes" :key="index" :label="`${item.from}:00-${item.to}:00`" :value="`${item.from},${item.to}`" />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="company" @change="runfilters" size="mini" placeholder="航空公司">
          <el-option
            v-for="(item,index) in flights.options.company"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="airSize" @change="runfilters" size="mini" placeholder="机型">
          <el-option v-for="(item,index) in sizeOption" :key="index" :label="item.name" :value="item.size" />
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button @click="handleFiltersCancel" type="primary" round plain size="mini">
        撤销
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['flights'],
  data () {
    return {
      airport: '', // 机场
      flightTimes: '', // 出发时间
      company: '', // 航空公司
      airSize: '', // 机型大小
      sizeOption: [
        { name: '大', size: 'L' },
        { name: '中', size: 'M' },
        { name: '小', size: 'S' }
      ] // 机型大小
    }
  },
  methods: {
    runfilters () {
      let newfilghts = this.flights.flights
      if(this.airport){
        newfilghts=this.handleAirport(newfilghts)
      }
      if(this.flightTimes){
        newfilghts=this.handleFlightTimes(newfilghts)
      }
      if(this.company){
        newfilghts=this.handleCompany(newfilghts)
      }
      if(this.airSize){
        newfilghts=this.handleAirSize(newfilghts)
      }
      this.$emit('setFlightsData', newfilghts)
    },
    // 选择机场时候触发
    handleAirport (oldfilghts) {
      let newfilghts = oldfilghts.filter(v => {
        return v.org_airport_name == this.airport
      })
      return newfilghts
    },
    // 选择出发时间时候触发
    handleFlightTimes (oldfilghts) {
      let newfilghts=oldfilghts.filter(v=>{
        var deptime=+v.dep_time.split(':')[0]
        var before=+this.flightTimes.split(',')[0]
        var after=+this.flightTimes.split(',')[1]
        return deptime>=before&&deptime<after
      })
      return newfilghts
    },

    // 选择航空公司时候触发
    handleCompany (oldfilghts) {
      let newfilghts=oldfilghts.filter(v=>{
        return v.airline_name==this.company
      })
      return newfilghts
    },

    // 选择机型时候触发
    handleAirSize (oldfilghts) {
      let newfilghts=oldfilghts.filter(v=>{
        return v.plane_size==this.airSize
      })
      return newfilghts
    },

    // 撤销条件时候触发
    handleFiltersCancel () {
      this.airport= '', // 机场
      this.flightTimes= '', // 出发时间
      this.company= '', // 航空公司
      this.airSize= '',
      this.runfilters()
    }
  }
}
</script>

<style scoped lang="less">
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>
