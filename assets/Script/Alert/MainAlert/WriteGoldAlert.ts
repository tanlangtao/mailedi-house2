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

        if( this.amountInput.string == '')
        {
            this.app.showAlert('输入不能为空!')
        }else{
            this.fetchBindAccountPay();
            this.node.removeFromParent();
        }
    }

    fetchBindAccountPay(){
        this.app.UrlData.host = "http://10.63.60.112:9090";
        let url = `${this.app.UrlData.host}/transaction`;
        let amount = Number(this.amountInput.string)*Number(this.data.exchange_price);
        this.FormData= new FormData();
        this.FormData.append('user_id',this.app.UrlData.user_id);
        this.FormData.append('user_name',decodeURI(this.app.UrlData.user_name));
        this.FormData.append('replace_id',this.data.user_id);
        this.FormData.append('replace_name',this.data.user_name);
        this.FormData.append('gold',this.amountInput.string);
        this.FormData.append('amount',`${amount}`);
        this.FormData.append('sell_id','1');
        this.FormData.append('exchange_price','1');
        this.FormData.append('replace_name','1');
        this.FormData.append('client', this.app.UrlData.client)
        this.FormData.append('proxy_user_id', this.app.UrlData.proxy_user_id)
        this.FormData.append('proxy_name', decodeURI(this.app.UrlData.proxy_name))
        this.FormData.append('package_id', this.app.UrlData.package_id)
        this.FormData.append('token',this.app.token);
        fetch(url,{
            method:'POST',
            body:this.FormData
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                // 刷新app数据
                this.app.fetchIndex();

                this.app.showAlert('操作成功！')
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
