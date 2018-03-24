import Vue from 'vue'
export default {
  // 调用后台文件写入用户数据
  setTxt: function (data) {
    Vue.http.get('../../UserData.php', {
      params: {
        'data': data
      }
    }).then((res) => {
    })
  }
}
