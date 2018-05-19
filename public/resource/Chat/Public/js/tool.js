/**
 * 检查金额
 */
function checkPrice(price){
    var reg = /^\d*(\.\d{1,2})?$/;

    return reg.test(price);
}

// 检查年份
function checkYear(year){
    var reg = /^\d{4}$/;

    return reg.test(year);
}

// 检查手机号码
function checkPhone(phone){
    var reg = /^[1][3-9]\d{9}$/;

    return reg.test(phone);
}

// 检查比率
function checkRatio(ratio){
    var reg = /^\d(\.\d{1,2})?$/;

    return reg.test(ratio);
}

/**
 * 检查数字
 * @param num 待检查的数字
 * @param len 允许几位小数点
 */
function checkNum(num , len){
    len = G.getValType(len) !== 'Number' ? 0 : len;

    if (len === 0) {
        return new RegExp("^\\d+$").test(num);
    }

    return new RegExp("^\\d+(\.\\d{0," + len + "})?$").test(num);
}

// 检查密码
function checkPassword(password){
    var reg = /^.{6,}$/;

    return reg.test(password);
}

// 检查电子邮箱
function checkEmail(email){
    var reg = /^.+@.+$/;

    return reg.test(email);
}