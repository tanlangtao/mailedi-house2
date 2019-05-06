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
export default class NewClass extends cc.Component {
    @property(cc.Label)
    textLabel : cc.Label = null;

    @property
    FormData = new FormData();
    public results = null;
    public app = null;
    type = null;
    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
    }

    public init(data){
        this.results = data;
        let info = JSON.parse(data.info);
        this.type = data.type == 2 ? '支付宝' :(data.type == 3 ? '银行卡' :'');
        if(data.type == 2){
            this.textLabel.string = `交易方式 : ${this.type}, 姓: ${info.account_surname}, 名 : ${info.account_first_name}, 姓名 : ${info.account_name}, 支付宝账号 : ${info.account_card}。`
        }else if(data.type == 3){
            this.textLabel.string = `交易方式 : ${this.type}, 姓名 : ${info.card_name}, 银行 : ${info.bank_name}, 开户行 : ${info.branch_name}, 银行卡号 : ${info.card_num}。`
        }
    }

    editClick(){
        if(this.type == '支付宝'){
            this.app.showAlipayAccountAlert({
                text:'修改支付宝',
                action:'edit',
                itemId:this.results.id
            });
        }else if(this.type == '银行卡'){
            this.app.showBankAccountAlert({
                text:'修改银行卡',
                action:'edit',
                itemId:this.results.id
            })
        }
    }

    deleteClick(){
        let accNum = cc.find('Canvas/content/AccNum').getComponent('AccNum');

        let url = `${this.app.UrlData.host}/api/payment_account/saveAccount`;
        this.FormData= new FormData();
        this.FormData.append('id',this.results.id);
        this.FormData.append('action','del');
        this.FormData.append('token',this.app.token);
        fetch(url,{
            method:'POST',
            body:this.FormData
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                //刷新界面
                accNum.fetchIndex();

                this.app.showAlert('操作成功！')
            }else{
                this.app.showAlert(data.msg)
            }
        })

    }
    // update (dt) {}
}
