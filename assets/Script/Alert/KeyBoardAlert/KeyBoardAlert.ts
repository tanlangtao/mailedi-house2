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

    // @property(cc.Label)
    // label: cc.Label = null;

    @property
    label = null;
    // LIFE-CYCLE CALLBACKS:

    init(label){

        if(label.string == '点击输入'){
            label.string = ''
        }
        this.label = label;
    }

    setInputColor(msg,input){
        let color1 = new cc.Color(255, 255, 255);
        let color2 = new cc.Color(187, 187, 187);
        //设置字的颜色
        msg == '' ? input.node.color = color2:input.node.color = color1;
    }

    add1(e){
        this.label.string = this.label.string+'1';
        this.setInputColor('1',this.label)
    }
    add2(e){
        this.label.string = this.label.string+'2';
        this.setInputColor('1',this.label)
    }
    add3(e){
        this.label.string = this.label.string+'3';
        this.setInputColor('1',this.label)
    }

    add4(e){
        this.label.string = this.label.string+'4';
        this.setInputColor('1',this.label)
    }

    add5(e){
        this.label.string = this.label.string+'5';
        this.setInputColor('1',this.label)
    }

    add6(e){
        this.label.string = this.label.string+'6';
        this.setInputColor('1',this.label)
    }

    add7(e){
        this.label.string = this.label.string+'7';
        this.setInputColor('1',this.label)
    }

    add8(e){
        this.label.string = this.label.string+'8';
        this.setInputColor('1',this.label)
    }
    add9(e){
        this.label.string = this.label.string+'9';
        this.setInputColor('1',this.label)
    }
    add0(e){
        this.label.string = this.label.string+'0';
        this.setInputColor('1',this.label)
    }
    addDian(e){
        this.label.string = this.label.string+'.';
        this.setInputColor('1',this.label)
    }
    deleteString(e){
        this.label.string = this.label.string.substr(0,this.label.string.length-1);
        this.setInputColor('1',this.label)

    }

    onClick(){
        if(this.label.string.length == 0){
            this.label.string = '点击输入';
            this.setInputColor('',this.label)
        }
        this.node.removeFromParent();
    }
}
