# PROJ:ModiMan
game=Phaser3/JS infinite-runner JetpackJoyride-style
art=16bit pixel, 64x64 sprites
canvas=640x360 zoom:3 → effective 213x120
physics=arcade gravity:600
lives=3 fixed (Mario style, HUD shows 3 mini-Modi icons)
win=none — pure highscore survival

## CONTROLS
space=jump | hold-space=fly(reduced gravity) | X=laser-projectile | auto-run-right

## PLAYER STATES
run(default)→fly(hold)→run+laser→fly+laser→hurt(blink invincibility)→dead(glitch dissolve)

## LASER SYSTEM
- tap X → projectile spawns at eye offset (x+30,y-8) → travels right → kills enemy
- sprite shows eye-glow only (no beam in sprite)
- charge bar in HUD, drains on fire, auto-recharges
- laser projectile = separate 16x6px sprite (2 frame flicker loop)

## SCORING
dist:+1/10px | jet:+100 | ufo:+150 | alien:+75 | coin:+10 | powerup:+50
difficulty: speed +5% every 500pts, base:200 max:500

## ENEMIES (64x64, face LEFT)
- UFO: sine-wave air, killed by laser, has hover-loop + death-explosion anims
- FighterJet: horizontal air, killed by laser, has fly-loop + death-explosion anims
- [cut: alien soldier, missile barrage — not implemented yet]

## POWERUPS
saffron-shield:5s invincibility | chai-boost:3s speed | laser-overcharge:full charge | sone-ka-sikka:2x score 10s

## BIOMES (4-layer parallax TileSprite, seamless horizontal tile)
Delhi-Night → start | CyberMumbai-Night → 2500pts | [Himalaya→1000, Space→5000 — future]
layers: sky(scroll:0.2) | far-bldg(0.5) | near-bldg(1.2) | ground(2.5)
ground = SIDE VIEW only — player runs on top edge, decorative wall face visible below

## ASSET PIPELINE
NanaBanana → single ref frame (always upload approved frame as image ref for color consistency)
Grok → 6sec animation video (upload ref frame + prompt)
You → trim video, extract frames
FreeTex Packer → stitch horizontal spritesheet
Phaser → load.spritesheet(key, path, {frameWidth:64,frameHeight:64})

## SPRITE LIST (all Modi = 64x64, facing right)
STATUS: idle✅ walk✅ | remaining below

| key | type | loop | notes |
|---|---|---|---|
| modi_run | NB+Grok | yes | normal eyes |
| modi_run_laser | NB+Grok | yes | identical to run + red eye glow only, no beam |
| modi_fly | NB+Grok | yes | horizontal superman, normal eyes |
| modi_fly_laser | NB+Grok | yes | identical to fly + red eye glow only, no beam |
| modi_jump | NB+Grok | no | run→crouch→launch→fly pose, hold at end |
| modi_land | NB+Grok | no | fly→impact dust→hero pose→run, hold at end |
| modi_hurt_run | NB+Grok | no | hit flash→recoil→blink→recover run |
| modi_hurt_fly | NB+Grok | no | hit flash→tumble→blink→recover fly |
| modi_dead_run | NB+Grok | no | run→white flash→glitch corrupt→dissolve→empty |
| modi_dead_fly | NB+Grok | no | fly→white flash→glitch corrupt→dissolve→empty |
| laser_proj | NB only | yes | 16x6px, 2 frames, red-orange glow bolt facing right |
| modi_icon | NB only | static | 16x16 face icon for HUD lives |
| ufo_hover | NB+Grok | yes | bob+rim lights+beam pulse, face left |
| ufo_death | NB+Grok | no | explode→chunks→green goo→empty |
| jet_fly | NB+Grok | yes | turbulence wobble+afterburner flicker, face left |
| jet_death | NB+Grok | no | explode→metal chunks→smoke→empty |

## CHAR BASE (prepend to all NB sprite prompts)
```
Pixel art, 16-bit retro platformer style, single sprite, transparent background, 64x64 pixels, crisp 1px black outline, no anti-aliasing, no smoothing, muscular Indian male superhero, white grey hair, white beard, glasses, blue skintight suit subtle texture, orange lotus chest emblem slight glow highlight, tricolor cape (saffron top/white mid/green bottom), facing right, dithering for shading, SNES/GBA platformer feel. Match colors exactly from uploaded reference image.
```

## GROK RULES (apply to all anim prompts)
- always upload approved ref frame alongside prompt
- state: "use uploaded frame as exact visual reference — identical colors outfit face cape pixel style"
- end with: "64x64 pixel art, no smoothing, no interpolation blur"
- loops: "seamless loop, last frame connects to first"
- one-shot: "do NOT loop — plays once"
- hit flash pattern: "two rapid full-white silhouette flashes, then colors return"
- invincibility blink: "alternates fully visible and fully transparent, 5-6 cycles, slowing toward end"
- glitch death: "pixel rows offset 3-6px, wrong color blocks magenta/cyan/grey, chunks break off, fade to empty transparent frame"

## BACKGROUNDS
tool: Leonardo.ai preferred over NanaBanana for wide scenes
size: 640x360 single full image → slice in Canva into 4 layer PNGs
slice zones (approx Y): sky:0-162 | far:120-234 | near:180-306 | ground:270-360

### SEAMLESS RULE (append to every bg prompt)
```
CRITICAL SEAMLESS TILING: right edge connects perfectly to left edge no seam. No element cut off at canvas edges — all buildings fully contained. Left/right edge pixel columns identical colors. No gradient starting/ending at canvas edge. Both edges terminate on plain flat wall 40px buffer no decorative elements near edges. Imagine placed next to identical copy — one continuous scene.
```

### GROUND RULE (all biomes)
```
SIDE VIEW ground only — player runs on top edge. Clean straight horizontal platform line at top of ground zone. Below = decorative wall side-face, no top-down surface pattern, no perspective tilt, strictly flat side view.
```

### DELHI NIGHT prompt
```
Pixel art 16-bit retro game background 640x360 seamlessly tileable. NEW DELHI NIGHT single cohesive scene parallax zones:
SKY(top 45%): deep midnight navy→blue-purple gradient, full moon centered upper area pale yellow pixel craters, scattered pixel stars varying sizes, thin dark grey cloud streaks, no elements near left/right edges.
FAR(next 20%): very dark near-silhouette buildings, dark navy-grey, Mughal domes+minarets+modern towers, few tiny dim yellow window pixels only, moon sits just above, no bright colors, tall cluster center shorter toward edges.
NEAR(next 15%): closer buildings desaturated dark night tones, warm amber lit windows only bright accent, Indian flag mural centered one building, string lights tiny warm dot pixels, rooftop water tanks, ornate arch detail, no elements within 40px of edges.
GROUND(bottom 20%): [SIDE VIEW ground rule above]. Dark red sandstone brick side-face, thin ornate cream+dark-red geometric cornice trim just below platform line, solid dark brownish-red stone face below. [SEAMLESS RULE above]
```

### CYBER MUMBAI NIGHT prompt
```
Pixel art 16-bit retro game background 640x360 seamlessly tileable. CYBER MUMBAI NIGHT single cohesive scene parallax zones:
SKY(top 45%): near-black dark teal-purple tint, sparse pixel stars, strong upward neon bloom hot-pink+cyan gradient rising from below even intensity full width, top canvas uniform near-black.
FAR(next 20%): very dark skyscraper silhouettes almost black, barely visible cyan+pink roofline trim pixels, few blinking red antenna pixels, no readable billboards, tall center shorter edges.
NEAR(next 15%): cyberpunk Mumbai street buildings dark moody, chawl+modern mix, clotheslines pixel clothes, rusted water tanks, neon Hindi+English shop signs cyan+pink, large Ganesh pixel mural centered with cyan neon outline glow, amber windows contrast cold neon, neon signs cast soft colored light pools on walls below, no signs within 40px of edges.
GROUND(bottom 20%): [SIDE VIEW ground rule above]. Dark grey concrete side-face, thin neon cyan LED trim line just below platform edge, subtle horizontal concrete texture lines, wet sheen highlights on platform top edge only. [SEAMLESS RULE above]
```

## PROJECT STRUCTURE
```
modi-man/
├── index.html
├── vite.config.js (base:'./')
├── src/
│   ├── main.js (Phaser config, scene list)
│   ├── config.js (GAME_CONFIG constants)
│   ├── scenes/ [Boot,Preload,Prologue,Menu,Game,HUD,GameOver]
│   ├── entities/ [Player,Enemy,FighterJet,UFO,Projectile]
│   ├── systems/ [EnemySpawner,ScrollManager,BiomeManager,ScoreManager]
│   └── ui/ [HealthBar,LaserBar,ScoreDisplay]
└── assets/
    ├── sprites/[modi/,enemies/,effects/]
    ├── backgrounds/[delhi/,mumbai/,himalaya/,space/]
    ├── ui/
    └── audio/[bgm/,sfx/]
```

## KEY PHASER PATTERNS
```js
// config
{type:Phaser.AUTO,width:640,height:360,physics:{default:'arcade',arcade:{gravity:{y:600}}}}

// parallax (update loop)
sky.tilePositionX+=0.2; far.tilePositionX+=0.5; near.tilePositionX+=1.2; ground.tilePositionX+=2.5

// biome switch
tweens.add({targets:[sky,far,near,ground],alpha:0,duration:800,onComplete:()=>{
  [sky,far,near,ground].forEach((l,i)=>l.setTexture(`${biome}_${['sky','far','near','ground'][i]}`))
  tweens.add({targets:[sky,far,near,ground],alpha:1,duration:800})
}})

// anim create
anims.create({key:'run',frames:anims.generateFrameNumbers('modi_run',{start:0,end:5}),frameRate:12,repeat:-1})

// laser fire
fireLaser(){
  const p=projectiles.get(player.x+30,player.y-8,'laser_proj')
  p.setActive(true).setVisible(true)
  p.body.setVelocityX(600)
  p.play('laser_flicker',true)
}

// HUD parallel scene
this.scene.launch('HUDScene')
// in HUDScene read: const gs=this.scene.get('GameScene'); gs.score; gs.laserCharge; gs.lives
```

## CONSTANTS
```js
SCROLL_BASE:200 | SCROLL_MAX:500 | RAMP:0.05/500pts
JUMP_VEL:-450 | FLY_VEL:-200 | GRAVITY:600 | GROUND_Y:270
LASER_MAX:100 | LASER_DRAIN:20/s | LASER_RECHARGE:10/s
INVINCIBILITY:2000ms
```

## SCENES
- Boot→Preload→Prologue(StarWars crawl, text tween y:+400→-600 12s, skip:space)→Menu→Game+HUD(parallel)→GameOver
- Game: player x:120 y:GROUND_Y, stateMachine, EnemySpawner timer+freq ramp, arcade colliders
- HUD: 3 life icons top-left, laser bar, score top-right

## AUDIO (royalty-free sources: pixabay/freesound/opengameart)
sfx: laser-zap, jump-whoosh, land-thud, explosion-boom, hurt-oof, coin-ding, powerup-jingle
bgm: delhi(indian classical), mumbai(electronic fusion), prologue(epic orchestral)

## DEPLOY
npm run build → /dist → itch.io(zip) or gh-pages or netlify
