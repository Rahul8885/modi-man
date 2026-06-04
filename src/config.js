export const GAME_CONFIG = {
  SCROLL_SPEED_BASE: 200,
  SCROLL_SPEED_MAX: 500,
  SPEED_RAMP_PER_500PTS: 0.05,
  PLAYER_JUMP_VELOCITY: -450,
  PLAYER_FLY_VELOCITY: -200,
  LASER_CHARGE_MAX: 100,
  LASER_SHOT_COST: 5,
  LASER_SPEED: 700,
  LASER_DRAIN_RATE: 100,      // per second while held
  LASER_RECHARGE_RATE: 10,   // per second after cooldown
  LASER_RECHARGE_DELAY: 1500, // ms after firing before recharge starts
  GRAVITY: 600,
  GROUND_Y: 630, // Fallback only; GameScene computes real ground from cropped PNG height.
  INVINCIBILITY_DURATION: 2000,  // ms
}
