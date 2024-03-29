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
    inputlabel: cc.Label = null;

   

    @property(cc.Node)
    lowerContent :cc.Node = null;

    @property(cc.Node)
    CapContent :cc.Node = null;

    @property
    label = null;
    isCap = false;
    type = null;
    app = null;
    init(label,type){
        this.label = label;
        if(label.string == '点击输入'){
            this.inputlabel.string = '';
        }else{
            this.inputlabel.string = label.string;
        }
        
        this.type = type;
    }

    onLoad(){
        this.app = cc.find('Canvas').getComponent('Canvas');
        this.CapContent.active = false;
        let dom = document.getElementById('GameCanvas');
        let self = this;
        dom.onkeydown = (e)=>{
            if(e.key.length>1){
                switch(e.key){
                    case 'Backspace':
                        self.deleteString();
                        break;
                    case 'Enter':
                        self.onClick();
                        break;
                    default:
                        break;
                }
            }else{
                self.inputlabel.string = self.inputlabel.string+e.key
            }
        }
    }
    add1(e){
        let font  = e.target.children[0].getComponent(cc.Label).string;
        this.inputlabel.string = this.inputlabel.string+font;
    }
    deleteString(){
        this.inputlabel.string = this.inputlabel.string.substr(0,this.inputlabel.string.length-1);
    }

    deleteAll(e){
        this.inputlabel.string ='';
    }

    toCap(){
        if(this.isCap){
            this.CapContent.active = false;
            this.lowerContent.active = true;
            this.isCap = false;
        }else{
            this.CapContent.active = true;
            this.lowerContent.active = false;
            this.isCap = true;
        }
    }

    onClick(){
        let string = this.app.labelType(this.inputlabel.string,this.type);
        if(string == ''){
            string = '点击输入'
            this.app.setInputColor('',this.label)
        }else{
            this.app.setInputColor('2',this.label)
        }
        this.label.string = string;
        this.node.removeFromParent();
    }

    removeSelf(){
        this.node.removeFromParent();
    }
}
