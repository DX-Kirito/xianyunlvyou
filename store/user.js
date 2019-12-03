export const state=()=>({
    userInfo:{
        token:'',
        user:{}
    }
})

export const mutations={
    //保存用户信息到state
    setUserInfo(state,data){
        state.userInfo=data
    },
    clearUserInfo(state){
        localStorage.removeItem('store'),
        state.userInfo={}
    }
}

export const actions={
    login({commit},data){
        return this.$axios({
            method:'post',
            url:'/accounts/login',
            data
        }).then(res=>{
            commit('setUserInfo',res.data)
            return data
        })
    }
}