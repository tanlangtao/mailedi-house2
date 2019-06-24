// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import scaleTo = cc.scaleTo;

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    @property(cc.EditBox)
    amountInput: cc.EditBox = null;

    @property(cc.Label)
    amountLabel : cc.Label = null;

    @property()
    FormData = new FormData();
    public app = null;
    public action = null;
    public data = null;

    public init(data){
        this.data = data;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
        this.app.getPublicInput(this.amountInput,1);

        this.app.setComponent('alertLogin').setMethod('setAmount', (text) => this.setAmount(text));
         //根据当前环境选择使用的输入组件
         if(this.app.UrlData.client != 'desktop'){
            this.amountInput.node.active = false;
            this.amountLabel.node.active = true;
        }else{
            this.amountInput.node.active = true;
            this.amountLabel.node.active = false;
        }
    }
    setAmount(msg) {
        let msg2 = this.app.labelType(msg,1);
        this.amountLabel.string = msg2 || '请输入金额';
        this.setInputColor(msg2,this.amountLabel);
    }

    setInputColor(msg,input){
        let color1 = new cc.Color(212, 223, 255);
        let color2 = new cc.Color(187, 187, 187);
        //设置字的颜色
        msg == '' ? input.node.color = color2:input.node.color = color1;
    }
    //amoutLabel点击回调
    changeAccountLabel(){
        //此处使用RN 的input组件
        this.app.Client.send('__oninput', { text: this.amountLabel.string == '请输入金额' ? "" :this.amountLabel.string,
            component: 'alertLogin', method: 'setAmount' })
    }

    onClick(){
        if(this.app.UrlData.client != 'desktop'){
            if(Number(this.data.min_gold) >Number(this.amountLabel.string)){
                this.app.showAlert('小于最低交易额!')
            }else if(Number(this.data.last_gold) < Number(this.amountLabel.string)){
                this.app.showAlert('当前上架金币不足！')
            }else if( this.amountLabel.string == '请输入金额'){
                this.app.showAlert('输入不能为空!')
            }else{
                this.fetchCheckOrder();

            }
        }else{
            if(Number(this.data.min_gold) >Number(this.amountInput.string)){
                this.app.showAlert('小于最低交易额!')
            }else if(Number(this.data.last_gold) < Number(this.amountInput.string)){
                this.app.showAlert('当前上架金币不足！')
            }else if( this.amountInput.string == ''){
                this.app.showAlert('输入不能为空!')
            }else{
                this.fetchCheckOrder();

            }
        }
    }
    fetchCheckOrder(){
        let url = `${this.app.UrlData.host}/api/trading_order/checkOrder?user_id=${this.app.UrlData.user_id}&token=${this.app.token}`;
        fetch(url,{
            method:'GET',
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                //判断是否存在订单
                if(data.data.is_exist == 0){
                    console.log('111')
                    this.fetchVeify();
                }else{
                    this.app.showCancleAlert(data.data);
                }
                this.node.removeFromParent();
            }else{
                this.app.showAlert(data.msg)
            }
        })
    }
    fetchVeify(){
        let imHost = this.app.UrlData.imHost;
        let url = `${imHost}/verify`;
        this.FormData= new FormData();
        this.FormData.append('user_id',this.app.UrlData.user_id);
        fetch(url,{
            method:'POST',
            body:this.FormData
        }).then((data)=>data.json()).then((data)=>{
            if(data.code == 0){
                this.fetchBindAccountPay();

            }else{
                this.app.showAlert(`${data.msg}请到聊天工具取消或确认！`)
            }
        })

    }
    fetchBindAccountPay(){
        let imHost = this.app.UrlData.imHost;
        let url = `${imHost}/transaction`;
        //防止丢失精度
        let scale =Number(this.data.exchange_price)*1000000;
        let amount =  Number(this.app.UrlData.client != 'desktop'? this.amountLabel.string : this.amountInput.string)*scale/1000000;

        this.FormData= new FormData();
        this.FormData.append('user_id',this.app.UrlData.user_id);
        this.FormData.append('user_name',decodeURI(this.app.UrlData.user_name));
        this.FormData.append('replace_id',this.data.user_id);
        this.FormData.append('replace_name',this.data.user_name);
        this.FormData.append('gold',this.app.UrlData.client != 'desktop'? this.amountLabel.string : this.amountInput.string);
        this.FormData.append('amount',`${amount}`);
        this.FormData.append('sell_id',this.data.id);
        this.FormData.append('exchange_price',this.data.exchange_price);
        this.FormData.append('client', this.app.UrlData.client)
        this.FormData.append('proxy_user_id', this.app.UrlData.proxy_user_id)
        this.FormData.append('proxy_name', decodeURI(this.app.UrlData.proxy_name))
        this.FormData.append('package_id', this.app.UrlData.package_id)
        this.FormData.append('token',this.app.token);
        fetch(url,{
            method:'POST',
            body:this.FormData
        }).then((data)=>data.json()).then((data)=>{
            if(data.code == 0){
                // 刷新app数据
                this.app.fetchIndex();
                this.app.showAlert('操作成功,请移至聊天中心交易！')
                // 唤起IM
                let self = this;
                let timer = setTimeout(()=>{
                    self.app.Client.send('__onim',{});
                    clearTimeout(timer);
                },1500)
            }else{
                this.app.showAlert(data.msg)
            }
        })
    }

    deleteAmount(){
        this.amountInput.string ='';
        if(this.app.UrlData.client != 'desktop'){
            this.amountLabel.string = '请输入金额';
            this.setInputColor('',this.amountLabel);
        }else{
            this.amountInput.string = '';
        }
    }
    
    removeSelf(){
        this.node.destroy();
    }

    // update (dt) {}
}
