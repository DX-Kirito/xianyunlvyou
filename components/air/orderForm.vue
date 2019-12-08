<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人</h2>
      <el-form class="member-info">
        <div class="member-info-item" v-for="(item,index) in users" :key="index">
          <el-form-item label="乘机人类型">
            <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <el-checkbox-group v-model="insurances">
        <div class="insurance-item" v-for="(item,index) in data.insurances" :key="index">
          <el-checkbox :label="item.id" border>
              {{item.type}}：￥{{item.price}}/份×1  最高赔付{{item.compensation}}
          </el-checkbox>
        </div>
        </el-checkbox-group>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入内容" v-model="contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
        <div v-show="false">{{allPrice}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props:['data'],
    data(){
        return{
            users:[{
                username:'',
                id:''
            }],
            insurances:[],
            contactName:'',
            contactPhone:'',
            captcha:''
        }
    },
  computed:{
    allPrice(){
      var res=0
      res+=this.data.seat_infos.par_price*this.users.length
      this.insurances.forEach(id=>{
        this.data.insurances.forEach(item=>{
          if(item.id===id){
            res+=item.price*this.users.length
          }
        })
      })
      res+=this.data.airport_tax_audlet*this.users.length
      this.$emit('changeForm',{
        numUser:this.users.length,
        allPrice:res
      })
      return res
    }
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      this.users.push({
          username:'',
          id:''
      })
    },

    // 移除乘机人
    handleDeleteUser(index) {
        this.users.splice(index,1)
    },

    // 发送手机验证码
    handleSendCaptcha() {
         this.$axios({
        url: `captchas`,
        method: "POST",
        data: {
          tel: this.contactPhone
        }
      }).then(res => {
        const { code } = res.data;
        this.$confirm(`模拟手机验证码为：${code}`, "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning"
        });
      });
    },

    // 提交订单
    handleSubmit() {
        // console.log(this.users);
        // const users = [...this.users]
        
       const orderData={
           users:this.users,
           insurances:this.insurances,
           contactName:this.contactName,
           contactPhone:this.contactPhone,
           invoice:false,
           seat_xid:this.data.seat_xid,
           air:this.data.id,
           captcha:this.captcha
       }
       const token=this.$store.state.user.userInfo.token
       if(!token){
         this.$message({
           message:'请先登录',
           type:'error'
         })
         this.$router.push({
           path:'/user/login'
         })
         return
       }
       console.log(orderData.users);
      //  console.log(this.$axios);
       this.$axios({
           url: "/airorders",
            method: "post",
            data: orderData,
            headers: {
            Authorization: "Bearer " + token
        }
       }).then(res=>{
           console.log(res);
       })
    }
  }
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>