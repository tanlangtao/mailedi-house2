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
    numberLabel: cc.Label = null;

    @property(cc.Label)
    startTimeLabel: cc.Label = null;

    @property(cc.Label)
    startGoldLabel: cc.Label = null;

    @property(cc.Label)
    remainderGoldLabel: cc.Label = null;

    @property(cc.Label)
    priceLabel: cc.Label = null;

    @property(cc.Label)
    sillLabel: cc.Label = null;

    @property(cc.Label)
    typeLabel: cc.Label = null;

    @property(cc.Label)
    averageTimeLabel: cc.Label = null;

    @property
    public results = {};
    public parentComponent = null;
    public app = null;
    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
    }

    public init(data,parentComponent){
        this.parentComponent = parentComponent;
    }

    onClick(){

    }
    // update (dt) {}
}
