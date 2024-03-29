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
    parentComponent = null;
    index = 0;
    // LIFE-CYCLE CALLBACKS:
    public init(data){
        this.label.string = data.text;
        this.parentComponent = data.parentComponent;
        this.index = data.index;
    }
    // onLoad () {}

    start () {

    }

    onClick(){
        console.log(this.index)
        this.parentComponent.current = this.index;
        this.parentComponent.showSelect = false;
        this.parentComponent.selectContent.removeAllChildren();
        this.parentComponent.initRender();
    }
    // update (dt) {}
}
