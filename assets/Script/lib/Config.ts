// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const {ccclass, property} = cc._decorator;

@ccclass
export default class Config extends cc.Component {
    @property()
    public token:string=''
    //获取url参数
    public  getUrlData(){
        var path = location.search;
        var arr:any = {};
        path.slice(1).split('&').map(e => e.split('=')).forEach(e => arr[e[0]] = e[1]);
        if(arr.env=='dev'){
            this.token = 'e40f01afbb1b9ae3dd6747ced5bca532'
        }else if(arr.env =='pre'){
            this.token = 'e40f01afbb1b9ae3dd6747ced5bca532'
        }else if(arr.env =='online'){
            this.token = 'e40f01afbb1b9ae3dd6747ced5bca532'
        }
        return arr;
    }
    //复制内容到剪贴板
    public copyToClipBoard(str) {
        var app = cc.find('Canvas').getComponent('Canvas');
        if(document.execCommand){
            try
            {
                let input = document.createElement("input");
                input.readOnly = true;
                input.value = str;
                document.body.appendChild(input);
                this.selectText(input,0,str.length);
                input.setSelectionRange(0, input.value.length);
                document.execCommand("Copy");
                document.body.removeChild(input);
                app.showAlert(`复制成功！${str}`);
            } catch (err)
            {
                app.showAlert(`复制失败！${err}`);
            }
        }else{
            app.showAlert(`无法使用复制，请升级系统！`);
        }

    }
    selectText(textbox, startIndex, stopIndex) {
        if(textbox.createTextRange) {//ie
            var range = textbox.createTextRange();
            range.collapse(true);
            range.moveStart('character', startIndex);//起始光标
            range.moveEnd('character', stopIndex - startIndex);//结束光标
            range.select();//不兼容苹果
        }else{//firefox/chrome
            textbox.setSelectionRange(startIndex, stopIndex);
            textbox.focus();
        }
    }
    //保留两位小数
    public toDecimal(num) {
        var result = parseFloat(num);
        if (isNaN(result)) {
            alert('传递参数错误，请检查！');
            return false;
        }
        result = Math.round(num * 100) / 100;
        var s_x = result.toString();
        var pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
        }
        while (s_x.length <= pos_decimal + 2) {
            s_x += '0';
        }
        return s_x;
    }
    //保留一位小数
    public toDecimal1(num) {
        var result = parseFloat(num);
        if (isNaN(result)) {
            alert('传递参数错误，请检查！');
            return false;
        }
        result = Math.round(num * 100) / 100;
        var s_x = result.toString();
        var pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
        }
        while (s_x.length <= pos_decimal + 1) {
            s_x += '0';
        }
        return s_x;
    }
    //保留三位小数
    public toDecimal3(num) {
        var result = parseFloat(num);
        if (isNaN(result)) {
            alert('传递参数错误，请检查！');
            return false;
        }
        result = Math.round(num * 1000) / 1000;
        var s_x = result.toString();
        var pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
        }
        while (s_x.length <= pos_decimal + 3) {
            s_x += '0';
        }
        return s_x;
    }
    //时间戳转换
    public getTime(time){
        var date = new Date(time * 1000);    //根据时间戳生成的时间对象
        var m = date.getMonth() + 1 > 9 ? date.getMonth()+1 : `0${date.getMonth()+1}`;
        var d = date.getDate()  > 9 ? date.getDate(): `0${date.getDate()}`;
        var h = date.getHours()  > 9 ? date.getHours() : `0${date.getHours()}`;
        var minute = date.getMinutes()  > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
        var s = date.getSeconds()  > 9 ? date.getSeconds(): `0${date.getSeconds()}`;
        var newDate =  m + "-" + d + " " + h + ":" + minute ;
        return newDate;
    }
    //时间戳转换
    public getTime2(time){
        let timer = Number(time);
        var h = Math.floor(timer/60/60) > 9 ? Math.floor(timer/60/60) : `0${Math.floor(timer/60/60)}`;
        var minute = Math.floor(timer/60%60) > 9 ? Math.floor(timer/60%60): `0${Math.floor(timer/60%60)}`;
        var s = timer%60 > 9 ? timer%60 : `0${timer%60}`;
        var newDate =  h + ":" + minute + ":" + s ;
        return newDate;
    }

    public testBankNum(num){
        if (isNaN(num)) {
            alert('传递参数错误，请检查！');
            return false;
        }
        var data = num.replace(/\s/g,'').replace(/(\d{4})\d+(\d{4})$/, "**** **** **** $2") ;
        return data;

    }

    uploadImg(){
        var app = cc.find('Canvas').getComponent('Canvas');
        try
        {
            let input = document.createElement("input");
            input.type = 'file';
            input.id ='imgInput';
            input.accept = 'image/*';
            input.multiple=true;
            input.style.position = 'absolute';
            input.addEventListener('change',(e:any)=>{
                console.log(e);
            })
            input.style.width = '120px';
            input.style.height = '30px';
            let dom = document.getElementById('Cocos2dGameContainer');
            let w =  dom.style.width.replace('px','');
            let h =  dom.style.height.replace('px','');
            if(Number(w)/Number(h) < 1.7){
                input.style.top = '67%';
                input.style.left ='42%';
                input.style.width = '200px';
                input.style.height = '50px';
                //iphonex
            }else if(Number(w)/Number(h) < 2.1){
                input.style.top = '69%';
                input.style.left ='42%';
                input.style.width = '120px';
                input.style.height = '30px';
            }else if(Number(w)/Number(h) > 2.1){
                input.style.top = '67%';
                input.style.left ='43%';
                input.style.width = '150px';
                input.style.height = '30px';
            }else{
                input.style.top = '69%';
                input.style.left ='42%';
                input.style.width = '120px';
                input.style.height = '30px';
            }
            dom.appendChild(input);
        } catch (err)
        {
            console.log(err)
        }
    }
}
