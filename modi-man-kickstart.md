# 🦸 Modi Man: Defender of Bharat
### Phaser 3 Infinite Runner — Full Project Kickstart Guide

---

## 📖 Game Concept

**Genre:** Infinite Side-Scroll Runner (Jetpack Joyride style)  
**Engine:** Phaser 3 (JavaScript)  
**Art Style:** Pixel Art, 16-bit retro  
**Protagonist:** Modi Ji — Indian Superhero  
**Core Loop:** Auto-run right → fly → shoot lasers → defeat enemies → survive as long as possible  

---

## 🌌 Story / Prologue

Displayed as a Star Wars-style upward scrolling text crawl before the main menu.

> *"A long time ago, in a land of spices and satellites…*
> *The forces of chaos — alien armadas and rogue fighter jets — threatened the peace of Bharat.*
> *One man. One kurta. One laser gaze.*
> *Rising from the banks of the Sabarmati, chosen by the cosmos itself,*
> *armed with the power of a billion prayers and an unbreakable resolve…*
> **MODI MAN awakens."***

**Technical:** Phaser Text object, Tween scrolling Y upward, starfield particle background, Indian-classical epic audio (royalty-free).

---

## 🎮 Core Mechanics

### Player Controls

| Input | Action |
|---|---|
| `Spacebar` / Tap | Jump |
| Hold `Spacebar` / Hold Tap | Fly (floats upward) |
| `X` / Double Tap | Fire Laser Beam |
| Auto | Always running right |

### Player States

| State | Description |
|---|---|
| `idle` | Standing, breathing loop |
| `run` | Default, always active on ground |
| `fly` | Hold jump — reduced gravity hover |
| `laser` | Fire red beam from eyes, drains charge |
| `hurt` | Brief knockback, blink invincibility frames |
| `dead` | Tumble fall, game over trigger |

### Laser System

- Laser has a **charge bar** (shown in HUD)
- Each shot drains charge
- Charge **auto-recharges** over time when not firing
- Powerup can **instantly refill** charge

### Scoring

| Action | Points |
|---|---|
| Distance travelled | +1 per 10px |
| Fighter jet destroyed | +100 |
| UFO destroyed | +150 |
| Alien soldier destroyed | +75 |
| Coin collected | +10 |
| Powerup collected | +50 |

Difficulty ramps every 500 points — scroll speed increases by 5%.

---

## 👾 Enemies

| Enemy | Movement | Spawn | Defeat |
|---|---|---|---|
| Fighter Jet | Horizontal from right, fires missiles | Air, random height | Laser only |
| UFO | Sine wave up/down drift | Air, upper zone | Laser or jump-on |
| Alien Soldier | Runs left on ground | Ground | Laser or stomp |
| Missile Barrage | Fast horizontal swarm | Air | Dodge only |

---

## ⚡ Powerups

| Powerup | Name | Effect |
|---|---|---|
| 🧡 Orange shield | Saffron Shield | 5 seconds invincibility |
| ☕ Cup icon | Chai Boost | Speed burst for 3 seconds |
| 🔋 Battery icon | Laser Overcharge | Full laser charge instantly |
| 💰 Gold coin | Sone ka Sikka | 2x score multiplier for 10 seconds |

---

## 🌆 Biomes (Auto-Transition)

| Biome | Trigger | Visual Style |
|---|---|---|
| New Delhi Skyline | Start | Red Fort + glass towers, sunset orange sky |
| Himalayan Heights | 1000 pts | Snow peaks + floating temples, purple sky |
| Cyber Mumbai | 2500 pts | Neon-lit streets, rain, Bollywood holograms |
| Space Frontier | 5000 pts | Stars, Indian flag on moon, alien mothership |

Each biome has 3 parallax layers: far (sky/mountains), mid (buildings), near (ground).

---

## 🎨 Art Assets Required

### Sprite List — Modi Ji (64×64 px each)

| Animation | Frames | File Names |
|---|---|---|
| Idle | 4 | `modi_idle_01.png` → `modi_idle_04.png` |
| Walk | 8 | `modi_walk_01.png` → `modi_walk_08.png` |
| Run | 6 | `modi_run_01.png` → `modi_run_06.png` |
| Fly Horizontal | 6 | `modi_fly_h_01.png` → `modi_fly_h_06.png` |
| Fly Upward | 4 | `modi_fly_up_01.png` → `modi_fly_up_04.png` |
| Laser Eyes | 4 | `modi_laser_01.png` → `modi_laser_04.png` |
| Punch | 4 | `modi_punch_01.png` → `modi_punch_04.png` |
| Jump Takeoff | 3 | `modi_jump_01.png` → `modi_jump_03.png` |
| Landing | 3 | `modi_land_01.png` → `modi_land_03.png` |
| Victory | 4 | `modi_victory_01.png` → `modi_victory_04.png` |
| Hurt | 2 | `modi_hurt_01.png` → `modi_hurt_02.png` |

**Total: 48 frames**

### Enemy Sprites

| Enemy | Frames | Notes |
|---|---|---|
| Fighter Jet | 4 | Exhaust animation loop |
| UFO | 6 | Spinning saucer loop |
| Alien Soldier | 6 | Walk + attack cycle |
| Missile | 2 | Trail glow loop |

### Background Layers (320×180 px, tileable)

| Layer | File |
|---|---|
| Delhi sky | `bg_delhi_sky.png` |
| Delhi mid buildings | `bg_delhi_mid.png` |
| Delhi ground | `bg_delhi_ground.png` |
| Himalaya sky | `bg_himalaya_sky.png` |
| Himalaya mid | `bg_himalaya_mid.png` |
| Himalaya ground | `bg_himalaya_ground.png` |
| Mumbai sky | `bg_mumbai_sky.png` |
| Mumbai mid | `bg_mumbai_mid.png` |
| Mumbai ground | `bg_mumbai_ground.png` |
| Space sky | `bg_space_sky.png` |
| Space mid | `bg_space_mid.png` |
| Space ground | `bg_space_ground.png` |

### UI Assets

| Asset | File |
|---|---|
| Health bar frame | `ui_health_bar.png` |
| Laser charge bar | `ui_laser_bar.png` |
| Score panel | `ui_score_panel.png` |
| Coin icon | `ui_coin.png` |
| Powerup icons (4) | `ui_powerup_shield/chai/laser/coin.png` |

---

## 🖼️ AI Sprite Generation Prompts

### Base Prompt (prepend to every single prompt below)

```
Pixel art, 16-bit retro platformer style, single sprite, transparent background,
64x64 pixels, crisp 1px black outline, no anti-aliasing, no smoothing,
muscular Indian male superhero, white grey hair, white beard, glasses,
blue skintight suit with subtle texture, orange lotus flower chest emblem
with slight pixel glow highlight, tricolor cape (saffron orange top,
white middle, green bottom), facing right, dithering for shading,
retro pixel game feel like SNES/GBA platformer.
```

---

### IDLE (4 Frames)

**Frame 1**
```
[BASE] IDLE FRAME 1 OF 4: neutral relaxed standing pose, arms at sides,
feet together, chest normal, cape hanging straight down naturally,
calm expression, baseline rest position.
```

**Frame 2**
```
[BASE] IDLE FRAME 2 OF 4: breathing in, chest expanded 2 pixels wider,
shoulders slightly raised, cape same position, body 1 pixel taller, inhale pose.
```

**Frame 3**
```
[BASE] IDLE FRAME 3 OF 4: peak inhale, chest fully expanded, shoulders at
highest point, lotus emblem stretching slightly, cape with gentle
left drift of 1-2 pixels, maximum breath held pose.
```

**Frame 4**
```
[BASE] IDLE FRAME 4 OF 4: exhaling, chest returning to normal, shoulders
dropping, body returning to frame 1 height, cape swinging slightly
right returning to rest, transition back to frame 1.
```

---

### WALK (8 Frames)

**Frame 1**
```
[BASE] WALK FRAME 1 OF 8: right foot forward, left foot back, right arm
swinging back, left arm swinging forward, weight on left foot,
cape swaying left gently, upright confident posture.
```

**Frame 2**
```
[BASE] WALK FRAME 2 OF 8: weight transferring to right foot, right foot
flat on ground, left foot lifting off heel, arms at middle
neutral swing position, body at tallest point of walk cycle, cape centered.
```

**Frame 3**
```
[BASE] WALK FRAME 3 OF 8: right foot planted, left leg swinging forward
mid-air, right arm now swinging forward, left arm going back,
body slightly lower, cape swaying right.
```

**Frame 4**
```
[BASE] WALK FRAME 4 OF 8: left foot landing forward, right foot about to
lift, arms at opposite neutral mid-swing, body at lowest dip
of walk cycle, cape swaying right still.
```

**Frame 5**
```
[BASE] WALK FRAME 5 OF 8: mirror of frame 1, left foot forward, right
foot back, left arm swinging back, right arm swinging forward,
weight on right foot, cape swaying right, second half of cycle begins.
```

**Frame 6**
```
[BASE] WALK FRAME 6 OF 8: mirror of frame 2, weight on left foot,
left foot flat, right heel lifting, arms returning to neutral
center position, body at peak height again, cape centering.
```

**Frame 7**
```
[BASE] WALK FRAME 7 OF 8: mirror of frame 3, left foot planted, right
leg swinging forward in air, left arm forward, right arm back,
body slightly lower, cape swaying left.
```

**Frame 8**
```
[BASE] WALK FRAME 8 OF 8: mirror of frame 4, right foot landing, left
foot lifting, body at lowest dip, cape swaying left,
cycle completes and loops back to frame 1.
```

---

### RUN (6 Frames)

**Frame 1**
```
[BASE] RUN FRAME 1 OF 6: full sprint, body leaning forward 20 degrees,
right leg fully extended behind, left knee driving high forward,
right arm punching forward, left arm pulling back,
cape streaming straight back horizontally, one pixel speed lines on legs.
```

**Frame 2**
```
[BASE] RUN FRAME 2 OF 6: both feet off ground airborne phase,
body fully horizontal lean, right leg tucking back, left leg
extending forward to land, arms mid-swing, cape billowing
back with slight upward curve, peak float moment.
```

**Frame 3**
```
[BASE] RUN FRAME 3 OF 6: left foot striking ground, right leg swinging
through, body weight absorbing impact, left arm forward,
right arm back, cape snapping back from momentum,
small dust pixel at left foot contact point.
```

**Frame 4**
```
[BASE] RUN FRAME 4 OF 6: mirror of frame 1, left leg fully extended
behind, right knee driving high forward, left arm punching
forward, right arm pulling back, body still leaning forward,
cape streaming back, speed lines on right leg.
```

**Frame 5**
```
[BASE] RUN FRAME 5 OF 6: second airborne phase mirror of frame 2,
left leg tucking, right leg extending to land,
arms at opposite mid-swing, cape billowing up slightly,
full float moment second stride.
```

**Frame 6**
```
[BASE] RUN FRAME 6 OF 6: right foot striking ground, left leg swinging
through, dust pixel at right foot, right arm forward left arm back,
cape snapping, cycle completes back to frame 1.
```

---

### FLY HORIZONTAL (6 Frames)

**Frame 1**
```
[BASE] FLY HORIZONTAL FRAME 1 OF 6: body fully horizontal superman pose,
right fist extended forward, left arm tight at side, legs together
trailing behind, cape streaming straight back flat,
body perfectly level, determined expression.
```

**Frame 2**
```
[BASE] FLY HORIZONTAL FRAME 2 OF 6: body dips 2 pixels lower,
slight downward drift, fist still extended, cape curves
slightly upward at tip from air resistance, legs dip slightly,
natural flight undulation downstroke.
```

**Frame 3**
```
[BASE] FLY HORIZONTAL FRAME 3 OF 6: body rises 2 pixels higher than frame 1,
upward drift, cape dips slightly downward at tip,
both arms now extended forward for speed boost pose,
legs tight together, upstroke of flight undulation.
```

**Frame 4**
```
[BASE] FLY HORIZONTAL FRAME 4 OF 6: back to level position matching frame 1,
single fist extended, cape flat streaming back,
small speed line pixels trailing behind body,
slight squint expression from wind, steady cruise.
```

**Frame 5**
```
[BASE] FLY HORIZONTAL FRAME 5 OF 6: body dips again like frame 2,
cape tip fluttering up, legs separate slightly 1-2 pixels apart,
fist still leading, wind effect pixels at fist knuckles.
```

**Frame 6**
```
[BASE] FLY HORIZONTAL FRAME 6 OF 6: rises back matching frame 3 height,
cape settling, legs tight again, transitions smoothly back
to frame 1 for seamless loop.
```

---

### LASER EYES (4 Frames)

**Frame 1**
```
[BASE] LASER EYES FRAME 1 OF 4: standing upright facing right,
eyes beginning to glow red, tiny 2-pixel red dots at eyes,
glasses tinted red slightly, fists clenching at sides,
body tensing, cape still, power charging expression,
no beam yet just eye glow start.
```

**Frame 2**
```
[BASE] LASER EYES FRAME 2 OF 4: eyes now bright red glowing 4-pixel radius,
thin red laser beam beginning to extend from eyes to right canvas edge,
beam is 2 pixels thick, red-orange gradient on beam,
small glow aura around eyes, grimace expression,
feet planted wide stance.
```

**Frame 3**
```
[BASE] LASER EYES FRAME 3 OF 4: full power laser beam, eyes blazing red,
beam now 4 pixels thick extending full width to right edge,
bright orange core with red outer beam, large glow halo around eyes,
body slightly pushed back from recoil, cape billowing from energy blast,
intense power expression.
```

**Frame 4**
```
[BASE] LASER EYES FRAME 4 OF 4: peak maximum power, eyes white-hot center
with red ring, beam at thickest 5 pixels with yellow white core,
full screen-width beam, energy crackle pixels around beam,
lotus emblem also glowing brighter in sympathy,
heroic determined face, cape whipping hard back from energy.
```

---

### PUNCH (4 Frames)

**Frame 1**
```
[BASE] PUNCH FRAME 1 OF 4: windup pose, right fist pulled all the way back
past hip, left arm guarding forward, body weight shifted to left foot,
knees slightly bent coiling energy, cape swinging left from windup,
determined focused expression.
```

**Frame 2**
```
[BASE] PUNCH FRAME 2 OF 4: mid-punch, right fist at chest level extending
forward rapidly, body rotating into punch, weight shifting to right foot,
left arm pulling back, cape swinging right from momentum,
body leaning into strike.
```

**Frame 3**
```
[BASE] PUNCH FRAME 3 OF 4: full extension impact moment, right fist fully
extended to right side of canvas, impact star burst of 6-8 yellow
orange pixels at fist, speed lines trailing behind fist,
body fully rotated into punch, triumphant impact expression,
cape snapping hard right.
```

**Frame 4**
```
[BASE] PUNCH FRAME 4 OF 4: recovery pose, right fist pulling back to
guard position, body returning to neutral, weight centering,
cape settling, ready stance, small remaining impact sparks
dissipating to right, transitioning back to idle or run.
```

---

### JUMP TAKEOFF (3 Frames)

**Frame 1**
```
[BASE] JUMP TAKEOFF FRAME 1 OF 3: deep crouch preparation, knees bent 90
degrees, body lowered significantly, arms swinging down and back,
cape draping forward between legs slightly, feet flat on ground,
coiled spring energy pose, looking upward.
```

**Frame 2**
```
[BASE] JUMP TAKEOFF FRAME 2 OF 3: launching upward, legs rapidly extending
pushing off ground, only toes touching ground, arms swinging upward
explosively, cape just beginning to billow up and back,
body rising, small dust burst pixels at feet contact point,
explosive upward energy.
```

**Frame 3**
```
[BASE] JUMP TAKEOFF FRAME 3 OF 3: fully airborne rising, both feet off
ground, knees tucking upward, arms raised above head,
cape flowing downward and back from upward momentum,
body at peak takeoff velocity, exhilarated expression,
transitions into fly horizontal animation.
```

---

### LANDING (3 Frames)

**Frame 1**
```
[BASE] LANDING FRAME 1 OF 3: falling downward, body angled feet-first,
legs extended below, arms spread slightly for balance,
cape flowing upward above body from downward fall momentum,
focused concentration expression preparing for impact.
```

**Frame 2**
```
[BASE] LANDING FRAME 2 OF 3: feet just touching ground impact moment,
large dust cloud of 8-10 pixels bursting outward from feet,
knees beginning to bend absorbing impact, arms spreading wide
for balance, cape still floating above, shockwave pixel ring
on ground surface, body compressed slightly.
```

**Frame 3**
```
[BASE] LANDING FRAME 3 OF 3: classic hero landing pose, one knee nearly
touching ground, one foot flat, one fist on ground, one arm raised,
body low and stable, cape dramatically draping and settling around body,
dust particles still floating, confident composed expression,
iconic superhero landing position.
```

---

### VICTORY (4 Frames)

**Frame 1**
```
[BASE] VICTORY FRAME 1 OF 4: facing slightly toward camera three-quarter view,
right fist raising upward, left arm at side, standing tall,
cape beginning to billow outward from sides in wind,
warm smile expression, lotus emblem brightening.
```

**Frame 2**
```
[BASE] VICTORY FRAME 2 OF 4: right fist raised fully above head at peak,
cape spreading wide on both sides dramatically,
small star sparkle pixels appearing around body,
lotus emblem glowing brightly, triumphant beaming smile,
body at full proud upright height.
```

**Frame 3**
```
[BASE] VICTORY FRAME 3 OF 4: both fists raised to sky, cape at maximum
spread width, more sparkle stars orbiting body,
lotus emblem pulsing bright orange, eyes closed in satisfaction,
pure joy expression, cape tricolor fully visible and spread,
most dramatic frame of the sequence.
```

**Frame 4**
```
[BASE] VICTORY FRAME 4 OF 4: returning to right fist raised,
cape settling back slightly, sparkles beginning to fade,
eyes open warm smile, loops back to frame 1 for
continuous celebration animation.
```

---

### HURT (2 Frames)

**Frame 1**
```
[BASE] HURT FRAME 1 OF 2: recoiling backward, body leaning sharply left,
arms thrown back from impact force, one leg lifting from knockback,
pain grimace expression eyes squinting, cape whipping forward
from sudden backward movement, white highlight flash overlay
on entire sprite silhouette, starburst impact pixels on chest.
```

**Frame 2**
```
[BASE] HURT FRAME 2 OF 2: recovering from hit, body returning toward
upright, still slightly hunched, arms coming back to guard,
determined recovering expression, cape settling,
normal colors returning, ready to continue fighting,
transition back to run or idle.
```

---

## 🛠️ AI Tool Workflow (Prompt → Phaser)

### Step 1 — Generate on PixelLab.ai
- Go to **pixellab.ai** (best for pixel art specifically)
- Set canvas size to **64x64**
- Paste the full prompt including base
- Generate 4-6 variations, pick best
- Use **img2img / reference mode**: upload frame 1 as reference when generating frame 2, 3 etc. — keeps character consistent

### Step 2 — Clean up in Piskel
- Go to **piskel.com** (free, browser-based)
- Open the PNG, fix stray pixels, adjust outline
- Export as PNG with transparency

### Step 3 — Stitch into Spritesheet
- Go to **free-tex-packer.com/app**
- Upload all frames of one animation
- Set layout to **horizontal strip**, frame size **64x64**
- Export as PNG + JSON

### Step 4 — Load in Phaser
```javascript
// PreloadScene.js
this.load.spritesheet('modi_run', 'assets/sprites/modi_run_sheet.png', {
    frameWidth: 64,
    frameHeight: 64
});

// GameScene.js - create animation
this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('modi_run', { start: 0, end: 5 }),
    frameRate: 12,
    repeat: -1
});

// On player sprite
this.player.play('run');
```

---

## 🏗️ Project Structure

```
modi-man/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js               ← Phaser game config entry
│   ├── config.js             ← constants, game settings
│   ├── scenes/
│   │   ├── BootScene.js      ← minimal load, show loading bar
│   │   ├── PreloadScene.js   ← load all assets
│   │   ├── PrologueScene.js  ← Star Wars crawl
│   │   ├── MenuScene.js      ← main menu
│   │   ├── GameScene.js      ← core gameplay
│   │   ├── HUDScene.js       ← score, health, laser (runs parallel)
│   │   └── GameOverScene.js  ← final score + restart
│   ├── entities/
│   │   ├── Player.js         ← player class, state machine, physics
│   │   ├── Enemy.js          ← base enemy class
│   │   ├── FighterJet.js     ← enemy subclass
│   │   ├── UFO.js            ← enemy subclass
│   │   ├── AlienSoldier.js   ← enemy subclass
│   │   └── Projectile.js     ← laser beam + missiles
│   ├── systems/
│   │   ├── EnemySpawner.js   ← timed random enemy spawn logic
│   │   ├── ScrollManager.js  ← parallax background, speed ramp
│   │   ├── BiomeManager.js   ← handles biome transitions
│   │   └── ScoreManager.js   ← score tracking, multipliers
│   └── ui/
│       ├── HealthBar.js
│       ├── LaserBar.js
│       └── ScoreDisplay.js
└── assets/
    ├── sprites/
    │   ├── modi/             ← all player spritesheets
    │   ├── enemies/          ← enemy spritesheets
    │   └── effects/          ← particles, explosions
    ├── backgrounds/
    │   ├── delhi/
    │   ├── himalaya/
    │   ├── mumbai/
    │   └── space/
    ├── ui/
    └── audio/
        ├── bgm/              ← background music per biome
        └── sfx/              ← laser, jump, hit, explosion sounds
```

---

## ⚙️ Setup Commands

```bash
# 1. Create project
npm create vite@latest modi-man -- --template vanilla
cd modi-man

# 2. Install Phaser
npm install phaser

# 3. Run dev server
npm run dev
```

**vite.config.js**
```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist'
  }
})
```

**index.html**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Modi Man: Defender of Bharat</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #000; display: flex; justify-content: center; align-items: center; height: 100vh; }
    canvas { display: block; }
  </style>
</head>
<body>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**src/main.js**
```javascript
import Phaser from 'phaser'
import BootScene from './scenes/BootScene.js'
import PreloadScene from './scenes/PreloadScene.js'
import PrologueScene from './scenes/PrologueScene.js'
import MenuScene from './scenes/MenuScene.js'
import GameScene from './scenes/GameScene.js'
import HUDScene from './scenes/HUDScene.js'
import GameOverScene from './scenes/GameOverScene.js'

const config = {
  type: Phaser.AUTO,
  width: 480,
  height: 270,
  zoom: 3,
  backgroundColor: '#1a0a2e',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 600 }, debug: false }
  },
  scene: [
    BootScene,
    PreloadScene,
    PrologueScene,
    MenuScene,
    GameScene,
    HUDScene,
    GameOverScene
  ]
}

new Phaser.Game(config)
```

**src/config.js**
```javascript
export const GAME_CONFIG = {
  SCROLL_SPEED_BASE: 200,
  SCROLL_SPEED_MAX: 500,
  SPEED_RAMP_PER_500PTS: 0.05,
  PLAYER_JUMP_VELOCITY: -450,
  PLAYER_FLY_VELOCITY: -200,
  LASER_CHARGE_MAX: 100,
  LASER_DRAIN_RATE: 20,      // per second
  LASER_RECHARGE_RATE: 10,   // per second
  GRAVITY: 600,
  GROUND_Y: 220,
  INVINCIBILITY_DURATION: 2000,  // ms
}
```

---

## 🎬 Scene Breakdown

### PrologueScene.js — Star Wars Crawl
```javascript
// Key logic:
// 1. Black background
// 2. Starfield: random white 1px dots, twinkling tween
// 3. Text block with story content
// 4. Tween: text.y from +400 to -600 over 12 seconds
// 5. On complete OR spacebar: start MenuScene
```

### GameScene.js — Core Loop
```javascript
// Key logic:
// 1. Create player at x:120, y:GROUND_Y
// 2. TileSprite backgrounds (3 layers per biome, different scroll speeds)
// 3. Input: space = jump/fly, X = laser
// 4. Player state machine: idle → run → fly → laser → hurt
// 5. EnemySpawner: setInterval pattern, increases frequency over time
// 6. Arcade physics colliders: player vs enemies, laser vs enemies
// 7. On player death: stop physics, play hurt, trigger GameOverScene
// 8. Launch HUDScene in parallel: this.scene.launch('HUDScene')
```

### HUDScene.js — Overlay
```javascript
// Key logic:
// 1. Scene runs parallel to GameScene (launched, not started)
// 2. Reads score + laser charge from GameScene via scene.get()
// 3. Updates every frame in update()
// 4. Health bar: rectangle drawn, shrinks on hit
// 5. Laser bar: separate color rectangle
// 6. Score text: top right corner
```

---

## 📅 Build Roadmap

| Week | Goal | Milestone |
|---|---|---|
| 1 | Generate all 48 sprites using AI prompts | All PNG frames ready |
| 2 | Stitch spritesheets, setup Phaser project | `npm run dev` shows canvas |
| 3 | Prologue crawl + Main Menu scene | Playable intro |
| 4 | Player run/jump/fly with physics | Character moves on screen |
| 5 | Laser mechanic + charge system | Shooting works |
| 6 | Enemy spawner + collision + game over | Core loop playable |
| 7 | Parallax scroll + biome transitions | Full visual world |
| 8 | HUD, score, powerups | Complete gameplay |
| 9 | Sound effects + background music | Audio layer done |
| 10 | Polish: particles, screenshake, juice | Game feels good |
| 11 | Bug fixes, balance, difficulty tuning | Ready to ship |
| 12 | Deploy to itch.io or GitHub Pages | **LAUNCHED** 🚀 |

---

## 🔊 Audio Resources (Free / Royalty-Free)

| Source | Type | URL |
|---|---|---|
| Pixabay | BGM + SFX | pixabay.com/music |
| Freesound | SFX | freesound.org |
| OpenGameArt | BGM + SFX | opengameart.org |
| Zapsplat | SFX | zapsplat.com |

**Sounds needed:**
- Laser fire (sci-fi zap)
- Jump (whoosh)
- Landing (thud)
- Enemy explosion (retro boom)
- Hit/hurt (oof)
- Coin pickup (ding)
- Powerup collect (power-up jingle)
- BGM per biome (Indian classical + electronic fusion)
- Prologue music (epic orchestral)

---

## 🚀 Deployment

```bash
# Build for production
npm run build

# Output is in /dist folder
# Upload to:
# - itch.io (HTML5 game, zip the dist folder)
# - GitHub Pages (push dist to gh-pages branch)
# - Netlify (drag and drop dist folder)
```

---

## 📝 Quick Reference — Phaser Animation Cheatsheet

```javascript
// Create animation
this.anims.create({
  key: 'modi_run',
  frames: this.anims.generateFrameNumbers('modi_run', { start: 0, end: 5 }),
  frameRate: 12,
  repeat: -1  // -1 = loop forever, 0 = play once
})

// Play animation
sprite.play('modi_run')

// Play animation if not already playing
sprite.play('modi_run', true)  // true = ignore if already playing

// Stop animation
sprite.stop()

// Listen for animation complete
sprite.on('animationcomplete', (anim) => {
  if (anim.key === 'modi_laser') {
    sprite.play('modi_run')
  }
})

// Change animation frame rate dynamically
sprite.anims.msPerFrame = 50  // lower = faster

// Flip sprite horizontally (for left-facing)
sprite.setFlipX(true)
```

---

*Built with Phaser 3 + ❤️ + Chai ☕*
