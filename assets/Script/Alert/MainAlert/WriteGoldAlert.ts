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

    @property()
    FormData = new FormData();
    public app = null;
    public action = null;
    public data = null;

    public init(data){
        this.data = data;
        console.log(data)
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
        this.app.getPublicInput(this.amountInput,1);
    }

    onClick(){
        if(Number(this.data.min_gold) >Number(this.amountInput.string)){
            this.app.showAlert('小于最低交易额!')
        }else if( this.amountInput.string == ''){
            this.app.showAlert('输入不能为空!')
        }else{
            this.fetchCheckOrder();

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
        let IMserver = CC_BUILD ?  "http://47.75.133.82:9090" : "http://10.63.60.112:9090" ;

        let url = `${IMserver}/verify`;
        this.FormData= new FormData();
        this.FormData.append('user_id',this.app.UrlData.user_id);
        fetch(url,{
            method:'POST',
            body:this.FormData
        }).then((data)=>data.json()).then((data)=>{
            if(data.code == 0){
                this.fetchBindAccountPay();

            }else{
                this.app.showAlert(`请等待${30-data.seconds}秒后再次交易！`)
            }
        })

    }
    fetchBindAccountPay(){
        let IMserver = CC_BUILD ?  "http://47.75.133.82:9090" : "http://10.63.60.112:9090" ;

        let url = `${IMserver}/transaction`;

        let amount = Number(this.amountInput.string)*Number(this.data.exchange_price);
        this.FormData= new FormData();
        this.FormData.append('user_id',this.app.UrlData.user_id);
        this.FormData.append('user_name',decodeURI(this.app.UrlData.user_name));
        this.FormData.append('replace_id',this.data.user_id);
        this.FormData.append('replace_name',this.data.user_name);
        this.FormData.append('gold',this.amountInput.string);
        this.FormData.append('amount',`${amount}`);
        this.FormData.append('sell_id',this.data.sell_id);
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

                this.app.showAlert('操作成功,请移至IM交易！')
            }else{
                this.app.showAlert(data.msg)
            }
        })
    }

    deleteAmount(){
        this.amountInput.string ='';
    }
    
    removeSelf(){
        this.node.destroy();
    }
    // update (dt) {}
}
