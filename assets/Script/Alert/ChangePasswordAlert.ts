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
    @property(cc.EditBox)
    oldPasswordInput: cc.EditBox = null;

    @property(cc.EditBox)
    newPasswordInput: cc.EditBox = null;

    @property(cc.EditBox)
    repeatPasswordInput: cc.EditBox = null;

    @property()
    FormData = new FormData();
    parentComponent  = null;
    showSelect = false;
    public app = null;

    public init(data){
        this.parentComponent = data.parentComponent;
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
        this.app.getPublicInput(this.oldPasswordInput,1);
        this.app.getPublicInput(this.newPasswordInput,1);
        this.app.getPublicInput(this.repeatPasswordInput,1);
    }

    start () {

    }

    onClick(){

        if(this.oldPasswordInput.string == '' || this.newPasswordInput.string == ''|| this.repeatPasswordInput.string == ''){
            this.app.showAlert('密码不能为空!')
        }else if(this.newPasswordInput.string.length < 6 || this.newPasswordInput.string.length > 10){
            this.app.showAlert('请设置6-10位新密码！')
        }else if(this.newPasswordInput.string != this.repeatPasswordInput.string){
            this.app.showAlert('两次密码输入不一致！')
        }else{
            this.fetchBindAccountPay();
            this.node.removeFromParent();
        }
    }

    fetchBindAccountPay(){
        var url = `${this.app.UrlData.host}/api/user_funds_password/updatePassword`;
        this.FormData= new FormData();
        this.FormData.append('user_id',this.app.UrlData.user_id)
        this.FormData.append('old_password',this.oldPasswordInput.string)
        this.FormData.append('password',this.newPasswordInput.string)
        this.FormData.append('token',this.app.token);
        fetch(url,{
            method:'POST',
            body:this.FormData
        }).then((data)=>data.json()).then((data)=>{
            if(data.status == 0){
                this.parentComponent.fetchIndex();
                this.app.showAlert('操作成功！')
            }else{
                this.app.showAlert(data.msg)
            }
        })
    }
    deleteOld(){
        this.oldPasswordInput.string = '';
    }

    deleteNew(){
        this.newPasswordInput.string = '';
    }

    deleteRepeat(){
        this.repeatPasswordInput.string = '';
    }
    
    removeSelf(){
        this.node.destroy();
    }
    // update (dt) {}
}
