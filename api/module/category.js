var conn = require("./dbconn");
//var product_module = require("./product");

//var getProductById = product_module.getProductById;

//获取pid 的子集分类
var getCategoryList = function(pid){
    var sql = `select * from category where parent_id = ${pid}`;

    return new Promise((resolve, reject) => {
        try {
            conn(sql, rows => {
                resolve(rows);
            })
        }catch (e){
            reject({error: 123})
        }
    })
}

//获取所有categorys
var getALLCategorys = () => {
    var sql = "select id,name,parent_id from category";

    return new Promise( (resolve, reject) => {
        try {
            conn(sql, rows => {
                resolve({status: true,data: rows})
            })
        }catch (e){
            reject({status: false,error_code: 123})
        }
    })

}
//获取最顶级分类Id by  product_id
var getCateIDByProductID = function(product_id){

    return new Promise( (resolve, reject) => {

        Promise.all([
            getProductById(product_id),
            getALLCategorys()
        ]).then(function(callback){
            var categorys = callback[1].data;
            var product = callback[0];
            var category_id = product.pid;
            (function(categorys,category_id,resolve){
                var callFn = arguments.callee;

                categorys.forEach(function (category) {
                    if(category.id == category_id){
                        cateP_id = category.parent_id;
                        if(category.parent_id == 0){
                            resolve(category_id)
                        }else {
                            callFn(categorys,category.parent_id,resolve);
                        }
                    }
                })
            })(categorys,category_id,resolve)

        }).catch(function(){
            console.log(arguments)
            reject({error:arguments})
        })
    })
}

//获取分类下的所有子孙级分类
var getCategorySubs = function(category_id) {

    //循环所有分类 获取 所有 父ID 为category_id 的分类 =》 获取category_id 的所有子分类
    //如果没有子分类，则此分类为最后一级分类，否则 继续迭代所有子分类，并 循环
    global.returnArr = [];
    return new Promise( (resolve, reject) => {
        getALLCategorys()
            .then(function(categorydb){

                var categorys = categorydb.data;
                (function(categorys, category_id, global){
                    var callFn = arguments.callee;
                    var subCategorys = [];
                    categorys.forEach(function(item,i){
                        if(item.parent_id == category_id){
                            subCategorys.push(item.id);
                        }
                    })

                    if(subCategorys.length > 0){
                        global.returnArr = global.returnArr.concat(subCategorys);
                        subCategorys.forEach(function(item,i){
                            callFn(categorys,item.id,global);
                        })
                    }else{
                        if(category_id) global.returnArr.push(category_id);
                    }
                })(categorys, category_id, global)

                resolve({status: true,data: global.returnArr})

            })
    })

}
module.exports = {
    getALLCategorys,
    getCategorySubs,
    getCategoryList,
    getCateIDByProductID
}