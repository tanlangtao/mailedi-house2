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

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.EditBox)
    firstNameInput: cc.EditBox = null;

    @property(cc.EditBox)
    lastNameInput: cc.EditBox = null;

    @property(cc.EditBox)
    nameInput: cc.EditBox = null;

    @property(cc.EditBox)
    accountInput: cc.EditBox = null;

    @property()
    FormData = new FormData();
    public app = null;
    public action = null;
    public  itemId = null;

    public init(data){
        this.label.string = data.text;
        this.action = data.action;
        this.itemId = data.itemId;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
        this.app.getPublicInput(this.firstNameInput,2);
        this.app.getPublicInput(this.lastNameInput,2);
        this.app.getPublicInput(this.accountInput,1);
        this.app.getPublicInput(this.nameInput,2);
    }

    onClick(){

        if( this.accountInput.string == ''
            || this.nameInput.string == ''
            || this.firstNameInput.string == ''
            || this.lastNameInput.string == '' )
        {
            this.app.showAlert('输入不能为空!')
        }else{
            this.fetchBindAccountPay();
            this.node.removeFromParent();
        }
    }

    fetchBindAccountPay(){
        let accNum = cc.find('Canvas/content/AccNum').getComponent('AccNum');

        let url = `${this.app.UrlData.host}/api/payment_account/saveAccount`;
        let obj = {
            account_card:this.accountInput.string,
            account_surname:this.firstNameInput.string,
            account_first_name:this.lastNameInput.string,
            account_name:this.nameInput.string,

            pay_url:'',
        };
        let info = JSON.stringify(obj);
        this.FormData= new FormData();
        this.FormData.append('user_id',this.app.UrlData.user_id);
        this.FormData.append('user_name',decodeURI(this.app.UrlData.user_name));
        this.FormData.append('action',this.action);
        this.FormData.append('withdraw_type','1');
        this.FormData.append('type','2');
        this.FormData.append('info',info);
        this.FormData.append('client', this.app.UrlData.client)
        this.FormData.append('proxy_user_id', this.app.UrlData.proxy_user_id)
        this.FormData.append('proxy_name', decodeURI(this.app.UrlData.proxy_name))
        this.FormData.append('package_id', this.app.UrlData.package_id)
        this.FormData.append('token',this.app.token);
        if(this.action == 'edit'){
            this.FormData.append('id',this.itemId);
        }
        fetch(url,{
            method:'POST',
            body:this.FormData
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                //刷新界面
                accNum.fetchIndex();
                // 刷新app数据
                this.app.fetchIndex();

                this.app.showAlert('操作成功！')
            }else{
                this.app.showAlert(data.msg)
            }
        })
    }

    deleteFirstName(){
        this.firstNameInput.string = '';
    }

    deleteLastName(){
        this.lastNameInput.string = '';
    }

    deleteName(){
        this.nameInput.string = '';
    }

    deleteAccount(){
        this.accountInput.string = '';
    }
    
    removeSelf(){
        this.node.destroy();
    }
    // update (dt) {}
}
