<template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额
        <span class="pay-price">￥ {{orderData.price}}</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row type="flex" justify="space-between" align="middle" class="pay-qrcode">
          <div class="qrcode">
            <!-- 二维码 -->
            <canvas id="qrcode-stage" ref="qrCanvas"></canvas>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Qrcode from "qrcode";
export default {
  data() {
    return {
      orderData: {},
      timer:null
    };
  },
  methods: {
    destroyed () {
      //跳出页面时清理定时器
      clearTimeout(this.timer)
    },
    payFinish(tradestate) {
      switch (tradestate) {
        case "SUCCESS": {
          this.$message({
            message: "支付成功",
            type: "success"
          });
          break;
        }

        case "REFUND":
          this.$message({
            message: "转入退款",
            type: "info"
          });
          break;

        case "CLOSED":
          this.$message({
            message: "已关闭",
            type: "info"
          });
          break;

        case "REVOKED":
          this.$message({
            message: "已撤销",
            type: "info"
          });
          break;

        case "PAYERROR":
          this.$message({
            message: "支付失败(其他原因，如银行返回失败)",
            type: "error"
          });
          break;

        default:
          break;
      }
    },
    checkPayStatus() {
      const token = this.$store.state.user.userInfo.token;
      this.$axios({
        url: "/airorders/checkpay",
        method: "post",
        data: {
          id: this.orderData.id,
          nonce_str: this.orderData.price,
          out_trade_no: this.orderData.orderNo
        },
        headers: {
          Authorization: "Bearer " + token
        }
      }).then(res => {
        console.log(res);
        if (res.data.trade_state === "NOTPAY") {
        this.timer=setTimeout(() => {
            this.checkPayStatus();
          }, 3000);
        } else {
          this.payFinish(res.data.trade_state)
        }
      })
    },
    loadData() {
      const token = this.$store.state.user.userInfo.token;
      this.$axios({
        url: "/airorders/" + this.$route.query.id,
        headers: {
          Authorization: "Bearer " + token
        }
      }).then(res => {
        // console.log(res);
        this.orderData = res.data;
        Qrcode.toCanvas(this.$refs.qrCanvas, this.orderData.payInfo.code_url, {
          width: 200
        });
        this.checkPayStatus();
      })
    }
  },
  watch: {
    "$store.state.user.userInfo.token"() {
      this.loadData();
    }
  },
  mounted() {
    if (this.$store.state.user.userInfo.token) {
      this.loadData();
    }
  }
}
</script>

<style scoped lang="less">
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>