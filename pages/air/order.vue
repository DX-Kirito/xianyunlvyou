<template>
  <div class="container">
    <el-row type="flex" justify="space-between">
      <!-- 订单表单 -->
      <div class="main">
          <OrderForm :data='infoData' @changeForm='setMoney'/>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <OrderAside :data='infoData' :asideData='asideData'/>
      </div>
    </el-row>
  </div>
</template>

<script>
import OrderForm from "@/components/air/orderForm.vue"
import OrderAside from "@/components/air/orderAside.vue"
export default {
    data(){
        return {
            infoData:{
              insurances:[],
              seat_infos: {}
            },
            asideData:{}
        }
    },
    components:{
        OrderForm,OrderAside
    },
    methods:{
      setMoney(res){
        this.asideData=res
      }
    },
    mounted(){
        const {query}=this.$route
        console.log(query);
        this.$axios({
            url:`airs/${query.id}`,
            params:{
                seat_xid:query.seat_xid
            }
        }).then(res=>{
            console.log(res.data);
            this.infoData=res.data
        })
    }
};
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  margin: 20px auto;
}

/*aside*/
.aside {
  width: 350px;
  height: fit-content;
  border: 1px #ddd solid;
}
</style>