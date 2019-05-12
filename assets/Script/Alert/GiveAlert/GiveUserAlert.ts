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

    @property()
    FormData = new FormData();
    public app = null;
    public init(data){
        this.label.string = `您确认赠送${this.app.config.toDecimal(data.gold)}金币，给玩家（ID:${data.data.id},昵称:${data.data.game_nick}）吗？`
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
    }

    start () {

    }

    onClick(){
        this.app.showTestPasswordAlert(6);
        this.node.removeFromParent();
    }

    removeSelf(){
        this.node.destroy();
    }
    // update (dt) {}
}
