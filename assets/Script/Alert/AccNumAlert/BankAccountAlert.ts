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

    @property(cc.Prefab)
    BankSelectItem : cc.Prefab = null;

    @property(cc.Label)
    label: cc.Label = null;

    @property(cc.EditBox)
    nameInput: cc.EditBox = null;

    @property(cc.EditBox)
    accountInput: cc.EditBox = null;

    @property(cc.EditBox)
    bankNameInput: cc.EditBox = null;

    @property(cc.Label)
    selectLabel: cc.Label = null;

    @property(cc.Node)
    selectContent: cc.Node = null;

    @property()
    FormData = new FormData();
    showSelect = false;
    app = null;
    action = null;
    itemId = null;

    public init(data){
        this.label.string = data.text;
        this.action = data.action;
        this.itemId = data.itemId;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
        this.app.getPublicInput(this.accountInput,1);
        this.app.getPublicInput(this.nameInput,2);
        this.app.getPublicInput(this.bankNameInput,2);
    }

    start () {

    }

    onClick(){

        if(this.accountInput.string == '' || this.nameInput.string == ''){
            this.app.showAlert('姓名和卡号不能为空!')
        }else if(this.selectLabel.string == '请选择银行'){
            this.app.showAlert('请选择银行！')
        }else if(this.bankNameInput.string == ''){
            this.app.showAlert('开户行不能为空！')
        }else{
            this.fetchBindAccountPay();
            this.node.removeFromParent();
        }
    }

    fetchBindAccountPay(){
        let accNum = cc.find('Canvas/content/AccNum').getComponent('AccNum');
        var url = `${this.app.UrlData.host}/api/payment_account/saveAccount`;
        let obj = {
            card_num:this.accountInput.string,
            card_name:this.nameInput.string,
            bank_name:this.selectLabel.string,
            branch_name:this.bankNameInput.string,
        };
        let info = JSON.stringify(obj);
        this.FormData= new FormData();
        this.FormData.append('user_id',this.app.UrlData.user_id);
        this.FormData.append('action',this.action);
        this.FormData.append('type','3');
        this.FormData.append('info',info);
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

    selectClick(){
        var results = ['中国农业银行','交通银行','中国建设银行','兴业银行','民生银行','中信银行','华夏银行','中国工商银行','浦发银行','招商银行','中国银行']
        if(!this.showSelect){
            for( var i = 0 ; i < results.length ; i++){
                var node = cc.instantiate(this.BankSelectItem);
                this.selectContent.addChild(node);
                node.getComponent('BankSelectItem').init({
                    text:results[i],
                    parentComponent:this,
                    index:i
                })
            }
            this.showSelect = true;
        }else{
            this.selectContent.removeAllChildren();
            this.showSelect = false;
        }
    }

    deleteName(){
        this.nameInput.string = '';
    }

    deleteAccount(){
        this.accountInput.string = '';
    }

    deleteBankName(){
        this.bankNameInput.string = '';
    }
    
    removeSelf(){
        this.node.destroy();
    }
    // update (dt) {}
}
