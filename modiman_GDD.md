# Modi Man: Defender of Bharat
### Game Design Document (GDD) v1.0

---

## 1. Overview

**Title:** Modi Man: Defender of Bharat  
**Genre:** Infinite Side-Scroll Runner  
**Engine:** Phaser 3 (JavaScript)  
**Platform:** Web (Desktop + Mobile via browser)  
**Art Style:** Smooth 2D illustrated sprites, cinematic backgrounds  
**Target Audience:** Casual gamers, Indian pop culture fans  

Modi Man is a Jetpack Joyride-style infinite runner where the player controls Modi Ji — a superhero version of India's Prime Minister — as he runs and flies through iconic Indian locations, blasting alien invaders and rogue fighter jets with laser beams from his eyes. The game has no win condition — it is a pure highscore survival experience that gets progressively harder the longer you survive.

---

## 2. Story / Prologue

Before the main menu, a Star Wars-style scrolling text crawl sets the scene:

> *"A long time ago, in a land of spices and satellites…*
> *The forces of chaos — alien armadas and rogue fighter jets — threatened the peace of Bharat.*
> *One man. One kurta. One laser gaze.*
> *Rising from the banks of the Sabarmati, chosen by the cosmos itself,*
> *armed with the power of a billion prayers and an unbreakable resolve…*
> **MODI MAN awakens."***

The crawl plays over a starfield background with epic orchestral music. The player can skip it by pressing Space.

---

## 3. Core Gameplay Loop

```
Game starts → Modi auto-runs right →
Player holds Space to fly over obstacles →
Player taps X to fire lasers at enemies →
Enemies die → score increases →
Speed increases → harder to survive →
Player takes 3 hits → game over → highscore shown
```

The game never ends unless the player dies. Every session is a fresh attempt to beat the previous highscore.

---

## 4. Controls

| Input | Action |
|---|---|
| `Space` — tap | Jump |
| `Space` — hold | Fly (reduced gravity, floats upward) |
| `Space` — release | Fall back to ground |
| `X` — tap | Fire laser projectile |
| Auto | Modi always runs right |

On mobile, tap = jump/fly, double-tap = laser.

---

## 5. Player — Modi Ji

### Character Design
Modi Ji is rendered as a muscular Indian superhero. He wears a blue skintight suit with an orange lotus flower emblem on the chest, and a tricolor cape (saffron top, white middle, green bottom) that billows dynamically. He has white-grey hair, a full white beard, and glasses.

### Lives System
The player starts with **3 lives**, displayed as 3 mini Modi head icons in the top-left HUD. One life is lost each time Modi is hit by an enemy or projectile. After the hit, Modi blinks with invincibility frames for 2 seconds before the next hit can register. When all 3 lives are lost, Modi glitches out and dissolves — triggering the Game Over screen.

### Player States

| State | Trigger | Description |
|---|---|---|
| Run | Default | Modi auto-runs right along the ground |
| Fly | Hold Space | Modi rises upward with reduced gravity |
| Run + Laser | Run + tap X | Running with red eye glow, fires projectile |
| Fly + Laser | Fly + tap X | Flying with red eye glow, fires projectile |
| Hurt (Run) | Hit while running | White flash, recoil, invincibility blink, recover |
| Hurt (Fly) | Hit while flying | White flash, tumble, invincibility blink, recover |
| Dead (Run) | 3rd hit on ground | Glitch corrupt effect, dissolve to empty |
| Dead (Fly) | 3rd hit in air | Glitch corrupt effect, dissolve in mid-air |

---

## 6. Laser System

The laser is Modi's primary weapon. It fires as a **separate projectile sprite** — not part of Modi's animation. Modi's sprite only shows red eye glow while firing.

| Property | Value |
|---|---|
| Projectile speed | 700px/s rightward |
| Gravity | Cancelled — travels perfectly horizontal |
| Charge bar | 0–100, shown in HUD |
| Drain per shot | 20 charge units |
| Recharge rate | 10 units per second (auto) |
| Max on screen | 10 simultaneous projectiles |

When a laser projectile hits an enemy, the projectile disappears and the enemy plays its death animation. When charge hits 0, firing is disabled until it recharges.

---

## 7. Enemies

All enemies spawn from the right side of the screen and move left. Modi must shoot them with lasers to destroy them. Enemies are 80x80px sprites facing left.

### UFO / Flying Saucer
A metallic alien saucer with a green alien visible in the cockpit window. Moves in a sine-wave pattern through the air — drifting up and down unpredictably. Has a pulsing green-blue light beam underneath and rotating rim lights.

| Property | Value |
|---|---|
| Zone | Air |
| Movement | Sine-wave horizontal |
| Defeated by | Laser |
| Score on kill | +150 |
| Death animation | Explodes into chunks, green alien goo splatter |

### Fighter Jet
A military fighter jet in olive green and dark grey, with Indian Air Force roundel markings on the wings. Flies straight horizontally with a flickering afterburner flame.

| Property | Value |
|---|---|
| Zone | Air |
| Movement | Straight horizontal |
| Defeated by | Laser |
| Score on kill | +100 |
| Death animation | Fireball, metal chunks, black smoke |

---

## 8. Powerups

Powerups spawn randomly as Modi runs and can be collected by running or flying through them.

| Powerup | Name | Effect | Duration |
|---|---|---|---|
| 🧡 Orange shield | Saffron Shield | Full invincibility, no damage taken | 5 seconds |
| ☕ Chai cup | Chai Boost | Speed burst, faster auto-run | 3 seconds |
| 🔋 Battery | Laser Overcharge | Instantly refills laser charge to 100 | Instant |
| 💰 Gold coin | Sone ka Sikka | 2x score multiplier | 10 seconds |

---

## 9. Scoring

| Action | Points |
|---|---|
| Distance travelled | +1 per 10px |
| UFO destroyed | +150 |
| Fighter Jet destroyed | +100 |
| Coin collected | +10 |
| Powerup collected | +50 |

A score multiplier of 2x is active during the Sone ka Sikka powerup. The highscore is stored in localStorage and displayed on the Game Over screen.

---

## 10. Difficulty Progression

The game gets harder the longer the player survives:

| Threshold | Change |
|---|---|
| Every 500 points | Scroll speed +5% |
| Base speed | 200px/s |
| Maximum speed | 500px/s |
| Enemy spawn rate | Increases with speed |

---

## 11. World — Biomes

The game world is divided into biomes that automatically transition as the player's score increases. Each biome has a distinct visual identity inspired by real Indian locations with a futuristic or cinematic twist.

### Biome 1 — New Delhi Night (Start)
A deep midnight blue sky with a large full moon, silhouetted Mughal domes and minarets mixed with modern glass towers, warm amber-lit windows, Indian flag murals on buildings, ornate red sandstone ground with geometric inlay patterns.

### Biome 2 — Cyber Mumbai Night (2500 pts)
A near-black sky with hot-pink and cyan neon bloom rising from below, dark cyberpunk skyscrapers with neon trim lines, chawl buildings with clotheslines and Ganesh murals, neon Hindi shop signs, wet concrete ground with neon light reflections.

### Future Biomes (planned)
- **Himalayan Heights** — 1000 pts — snow peaks, floating temples, purple sky
- **Space Frontier** — 5000 pts — stars, Indian flag on moon, alien mothership

### Parallax System
Each biome is rendered as 4 scrolling TileSprite layers at different speeds to create depth:

| Layer | Scroll Speed | Content |
|---|---|---|
| Sky | 0.2x | Sky, moon, stars, atmosphere |
| Far buildings | 0.5x | Distant silhouette skyline |
| Near buildings | 1.2x | Detailed foreground buildings |
| Ground | 2.5x | Side-view platform Modi runs on |

The ground is always rendered in **strict side view** — Modi runs along the top edge, and only the decorative wall face is visible below. No top-down surface patterns.

Biome transitions use a 800ms fade-out, texture swap, 800ms fade-in crossfade.

---

## 12. HUD

The HUD runs as a separate Phaser scene parallel to the Game scene, overlaid on top.

| Element | Position | Description |
|---|---|---|
| Lives | Top-left | 3 mini Modi head icons, one removed per hit |
| Laser charge bar | Bottom-left | Fills and drains as laser is used |
| Score | Top-right | Current score, updates every frame |
| Highscore | Top-right below score | Previous best, persisted in localStorage |

---

## 13. Scenes

| Scene | Description |
|---|---|
| BootScene | Minimal load, show loading bar |
| PreloadScene | Load all assets — sprites, backgrounds, audio |
| PrologueScene | Star Wars-style text crawl, skip with Space |
| MenuScene | Title, Play button, Highscore display |
| GameScene | Core gameplay loop |
| HUDScene | Overlay — lives, laser bar, score (parallel to Game) |
| GameOverScene | Final score, highscore, restart button |

---

## 14. Art & Assets

### Sprite Pipeline
1. **NanaBanana** — generate single reference frame per animation (always upload approved frame as color reference)
2. **Grok** — upload reference frame + animation prompt → 6-second video
3. **Manual** — trim video, extract frames evenly spaced
4. **Photopea** — stitch frames into horizontal spritesheet (transparent background)
5. **Phaser** — load as spritesheet, create animation

### Sprite Specifications
- **Modi sprites:** 80x80px per frame, smooth art style, facing right
- **Enemy sprites:** 80x80px per frame, facing left
- **Laser projectile:** 160x40px per frame, 2 frames
- **HUD life icon:** 16x16px static
- **Spritesheet layout:** Horizontal strip, all frames left to right, Y=0, transparent background
- **Phaser config:** `pixelArt: false`, `antialias: true`

### Modi Animation List

| Key | Frames | Loop | Notes |
|---|---|---|---|
| modi_idle | 6 | Yes | ✅ Done |
| modi_walk | 8 | Yes | ✅ Done |
| modi_run | 6 | Yes | Normal eyes |
| modi_run_laser | 6 | Yes | Red eye glow only, no beam in sprite |
| modi_fly | 6 | Yes | Horizontal superman pose |
| modi_fly_laser | 6 | Yes | Fly pose + red eye glow |
| modi_jump | 5 | No | Run → crouch → launch → fly pose |
| modi_land | 5 | No | Fly → impact → hero pose → run |
| modi_hurt_run | 6 | No | Flash → recoil → blink → recover |
| modi_hurt_fly | 6 | No | Flash → tumble → blink → recover |
| modi_dead_run | 6 | No | Glitch corrupt → dissolve → empty |
| modi_dead_fly | 6 | No | Glitch corrupt → dissolve → empty |

### Background Specifications
- **Size:** 640x360px, single cohesive image per biome
- **Sliced:** Into 4 layer PNGs in Canva (sky / far / near / ground zones)
- **Must tile seamlessly** horizontally — right edge connects to left edge invisibly
- **Ground layer** strictly side-view — no top-down surface visible

### Audio

| Type | Asset | Source |
|---|---|---|
| BGM | Delhi biome — Indian classical | Pixabay / OpenGameArt |
| BGM | Mumbai biome — Electronic fusion | Pixabay / OpenGameArt |
| BGM | Prologue — Epic orchestral | Pixabay / OpenGameArt |
| SFX | Laser fire — sci-fi zap | Freesound |
| SFX | Jump — whoosh | Freesound |
| SFX | Land — thud | Freesound |
| SFX | Enemy explosion — boom | Freesound |
| SFX | Hurt — oof | Freesound |
| SFX | Coin pickup — ding | Freesound |
| SFX | Powerup — jingle | Freesound |

---

## 15. Technical Specifications

### Stack
- **Engine:** Phaser 3.60+
- **Language:** JavaScript (ES6 modules)
- **Bundler:** Vite
- **Physics:** Arcade (built-in Phaser)

### Phaser Config
```js
{
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  render: {
    pixelArt: false,
    antialias: true
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 600 }, debug: false }
  }
}
```

### Key Constants
```js
SCROLL_BASE:    200   // px/s starting speed
SCROLL_MAX:     500   // px/s max speed
SPEED_RAMP:     0.05  // +5% per 500pts
JUMP_VEL:      -450   // px/s upward on jump
FLY_VEL:       -200   // px/s upward while flying
GRAVITY:        600   // arcade physics gravity
GROUND_Y:       280   // player Y position on ground (360 - 80)
LASER_MAX:      100   // max charge
LASER_DRAIN:     20   // charge per shot
LASER_RECHARGE:  10   // charge per second
INVINCIBILITY: 2000   // ms after being hit
LASER_SPEED:    700   // projectile px/s
```

### Project Structure
```
modi-man/
├── index.html
├── vite.config.js
├── src/
│   ├── main.js
│   ├── config.js
│   ├── scenes/
│   │   ├── BootScene.js
│   │   ├── PreloadScene.js
│   │   ├── PrologueScene.js
│   │   ├── MenuScene.js
│   │   ├── GameScene.js
│   │   ├── HUDScene.js
│   │   └── GameOverScene.js
│   ├── entities/
│   │   ├── Player.js
│   │   ├── Enemy.js
│   │   ├── FighterJet.js
│   │   ├── UFO.js
│   │   └── Projectile.js
│   ├── systems/
│   │   ├── EnemySpawner.js
│   │   ├── ScrollManager.js
│   │   ├── BiomeManager.js
│   │   └── ScoreManager.js
│   └── ui/
│       ├── HealthBar.js
│       ├── LaserBar.js
│       └── ScoreDisplay.js
└── assets/
    ├── sprites/
    │   ├── modi/
    │   ├── enemies/
    │   └── effects/
    ├── backgrounds/
    │   ├── delhi/
    │   └── mumbai/
    ├── ui/
    └── audio/
        ├── bgm/
        └── sfx/
```

---

## 16. Build Roadmap

| Week | Goal |
|---|---|
| 1 | Stitch all collected spritesheets in Photopea, generate missing assets (jet, laser proj) |
| 2 | Phaser project setup, PreloadScene loads all assets, BootScene working |
| 3 | PrologueScene Star Wars crawl + MenuScene |
| 4 | Player run/jump/fly physics in GameScene |
| 5 | Laser mechanic, charge system, projectile collision |
| 6 | Enemy spawner — UFO and Fighter Jet, death animations |
| 7 | Parallax backgrounds, both biomes, biome transition |
| 8 | HUD scene — lives, laser bar, score |
| 9 | Powerups, lives system, game over flow |
| 10 | Audio — BGM + SFX |
| 11 | Polish — screen shake, particles, juice |
| 12 | Deploy to itch.io or GitHub Pages |

---

## 17. Deployment

```bash
npm run build   # outputs to /dist
```

Upload `/dist` folder to:
- **itch.io** — zip the dist folder, upload as HTML5 game
- **GitHub Pages** — push dist to `gh-pages` branch
- **Netlify** — drag and drop dist folder

---

*Modi Man: Defender of Bharat — Built with Phaser 3, JavaScript, and chai ☕*
