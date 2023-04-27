import Images from './images.mjs'
import Object from './object.mjs'
import ShotLine from './shots.mjs'
import Enemies from './enemies.mjs'
import { Xy, Range } from './utils.mjs';
import Creature from './creature.mjs';
import { isGameOver } from './status.mjs';
import setting from './setting.mjs';

let playerShots;
let player;
let rock;
let rocket;
let frameCount;

const images = new Images([
    {
        name: 'player',
        size: new Xy(120, 151),
    },
    {
        name: 'player_shot_sm',
        size: new Xy(15, 90),
    },
    {
        name: 'rock',
        size: new Xy(40, 40),
    },
    {
        name: 'rocket',
        size: new Xy(60, 80),
    },
    {
        name: 'blast_enemy',
        size: new Xy(110, 110),
    }
]);

function main(p) {
    // 素材の読み込み処理
    p.preload = async function () {
        images.preload(p);
    }

    // 初期処理
    p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);

        playerShots = new ShotLine(
            new Object(
                p,
                images.get('player_shot_sm'),
                player => new Xy(0, 0)
            ),
            {
                speed: setting.playerShots.speed,
                shotResolveFrameNum: setting.playerShots.shotResolveFrameNum,
                shotMax: setting.playerShots.shotMax,
            }
        );

        player = new Creature(
            p,
            images.get('player'),
            player => new Xy(
                p.windowWidth / 2,
                p.windowHeight - player.size.y / 2 - 30
            ),
            playerShots,
            { getStartY: player => player.pos.y - player.size.y / 2 - 40 }
        );

        rock = new Enemies(
            new Object(
                p,
                images.get('rock'),
                rock => new Xy(0, 0)
            ),
            images.get('blast_enemy'),
            {
                speedYRange: new Range(
                    setting.rock.speedYRangeMin, 
                    setting.rock.speedYRangeMax
                ),
                speedXpyMax: setting.rock.slopeMax,
                intervalMin: setting.rock.intervalMin,
                intervalMax: setting.rock.intervalMax,
            }
        );

        rocket = new Enemies(
            new Object(
                p,
                images.get('rocket'),
                rocket => new Xy(0, 0)
            ),
            images.get('blast_enemy'),
            {
                speedYRange: new Range(
                    setting.rocket.speedYRangeMin, 
                    setting.rocket.speedYRangeMax
                ),
                speedXpyMax: setting.rocket.slopeMax,
                intervalMin: setting.rocket.intervalMin,
                intervalMax: setting.rocket.intervalMax,
            }
        );

        frameCount = 0;
    }

    // ウィンドウサイズが変化した際の処理
    p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        p.background(0);
    }

    p.mousePressed = function () {
        player.addShot();
    }

    // フレームごとの描画処理
    p.draw = function () {
        p.frameRate(60)
        p.background(0);

        if (isGameOver.get()) {
            p.fill(255, 255, 255);
            const fontSize = 44;
            const textContent = 'Game Over'
            p.textSize(fontSize);
            p.text(
                'Game Over',
                p.windowWidth / 2 - fontSize * (textContent.length * 0.25),
                p.windowHeight / 2 - fontSize * (textContent.length * 0.25)
            );
            p.textSize(28);
            p.text(
                `記録: ${Math.floor(frameCount / 60)}.${Math.floor(frameCount / 6) % 10}秒`,
                p.windowWidth / 2 - fontSize * (textContent.length * 0.25),
                p.windowHeight / 2 - fontSize * (textContent.length * 0.25) + 50
            );
            
            return;
        }

        player.setPos(new Xy(
            p.mouseX,
            p.windowHeight - player.size.y / 2 - 30
        ));

        player.draw();
        rock.draw(player);
        rocket.draw(player);

        // 秒数
        p.fill(150, 150, 150);
        p.rect(0, 0, p.windowWidth, 40);
        p.fill(255, 255, 255);
        p.textSize(24);
        p.text(`経過時間: ${Math.floor(frameCount / 60)}.${Math.floor(frameCount / 6) % 10}秒`, 10, 30)

        // ゲージ
        const gageWidth = p.windowWidth / playerShots.shotMax;
        for (let i = 0; i < playerShots.shotMax; i++) {
            if (i < playerShots.shotCount) {
                p.fill(200, 50, 50);
            }
            else {
                p.fill(100, 100, 100);
            }
            p.rect(i * gageWidth, p.windowHeight - 40, (i + 1) * gageWidth, 40);
        }

        if (playerShots.shotCount < playerShots.shotMax) {
            p.fill(255, 255, 255);
            p.textSize(28);
            const shotResolveFrameCountSecond = playerShots.shotResolveFrameCount / 60;
            const shotResolveFrameNumSecond = playerShots.shotResolveFrameNum / 60;
            p.text(
                `${(shotResolveFrameNumSecond - shotResolveFrameCountSecond).toPrecision(1)}秒`,
                (playerShots.shotCount - 1) * gageWidth, 
                p.windowHeight - 40, playerShots.shotCount * gageWidth, 40
            );
        }
        frameCount++;
    }
};

new p5(main);
