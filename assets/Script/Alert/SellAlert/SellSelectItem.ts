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
    label: cc.Label = null;

    @property
    selectLabel = null;
    showSelect = null;
    selectContent= null;
    info = null;
    parentCom = null;
    // LIFE-CYCLE CALLBACKS:
    public init(data){
        this.label.string = data.text;
        this.selectLabel = data.Label;
        this.showSelect = data.showSelect;
        this.selectContent = data.selectContent;
        this.info = data.info;
        this.parentCom = data.parentCom;
    }
    // onLoad () {}

    start () {

    }

    onClick(){
        this.showSelect = false;
        this.selectLabel.string = this.label.string;
        this.selectContent.removeAllChildren();
        console.log(this.info)
        if(this.info.type == 2){
            this.parentCom.ZfbInfo = this.info;
        }else if(this.info.type == 3){
            this.parentCom.BankInfo = this.info;
        }

    }
    // update (dt) {}
}
