import Phaser from "phaser";

export default class GameOver extends Phaser.Scene
{
    constructor(){
        super('game-over')
    }

    create( data : {title : string} ){

        let { width , height } = this.scale;

        this.add.text( width=0.5 , height = 0.5 , data.title , {
			fontSize: '48px',
			color: '#FFFFFF',
			backgroundColor: '#7ED321',
			padding: { left: 40, right: 40, top: 40, bottom: 40 },
        } )
    }
}