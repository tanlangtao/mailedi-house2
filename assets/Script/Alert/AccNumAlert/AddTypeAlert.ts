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
    selectLabel: cc.Label = null;

    @property(cc.Prefab)
    SelectItem : cc.Prefab = null;

    @property(cc.Node)
    selectContent : cc.Node = null;

    @property()
    public app = null;
    showSelect = false;
    data = null;
    current = 0;
    onLoad () {
        this.app = cc.find('Canvas').getComponent('Canvas');
        this.data = ['支付宝','银行卡'];
        this.initRender();
    }

    selectClick() {
        if (!this.showSelect) {
            for (var i = 0; i < this.data.length; i++) {
                var node = cc.instantiate(this.SelectItem);
                this.selectContent.addChild(node);
                node.getComponent('AddSelectItem').init({
                    text: this.data[i],
                    parentComponent: this,
                    index: i
                })
            }
            this.showSelect = true;
        } else {
            this.selectContent.removeAllChildren();
            this.showSelect = false;
        }
    }

    initRender(){
        this.selectLabel.string = this.data[this.current]
    }

    onClick(){
        if(this.current == 0){
            this.app.showAlipayAccountAlert({
                text:'添加支付宝',
                action:'add',
                itemId:''
            });
        }else if(this.current == 1){
            this.app.showBankAccountAlert({
                text:'添加银行卡',
                action:'add',
                itemId:''
            })
        }
        this.node.destroy();
    }

    removeSelf(){
        this.node.destroy();
    }

}
