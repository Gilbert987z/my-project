


// 公用方法库
//index请求接口方法
export default {
    istest(){
        console.log("this is test")
    },
    getBookTypeList() { //图书类型列表
        let bookTypeList
        this.$axios
            .get('/index/book/type/list')
            .then(response => {
              console.log(response)
              bookTypeList = response.data.data.records
              // this.page = response.data.data
            //   console.log('bookTypeList',this.bookTypeList);
              console.log('bookTypeList',response.data);
            
             

            }).catch(function (error) { // 请求失败处理
          console.log(error);
        });

        return bookTypeList     

      },

}