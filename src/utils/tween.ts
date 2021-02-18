const Tween = {
  Linear: function(t: number, b: number, c: number, d: number) {
    return (c * t) / d + b
  },
  Quad: {
    easeIn: function(t: number, b: number, c: number, d: number) {
      return c * (t /= d) * t + b
    },
    easeOut: function(t: number, b: number, c: number, d: number) {
      return -c * (t /= d) * (t - 2) + b
    },
    easeInOut: function(t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t + b
      return (-c / 2) * (--t * (t - 2) - 1) + b
    }
  },
  Cubic: {
    easeIn: function(t: number, b: number, c: number, d: number) {
      return c * (t /= d) * t * t + b
    },
    easeOut: function(t: number, b: number, c: number, d: number) {
      return c * ((t = t / d - 1) * t * t + 1) + b
    },
    easeInOut: function(t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t * t + b
      return (c / 2) * ((t -= 2) * t * t + 2) + b
    }
  },
  Quart: {
    easeIn: function(t: number, b: number, c: number, d: number) {
      return c * (t /= d) * t * t * t + b
    },
    easeOut: function(t: number, b: number, c: number, d: number) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b
    },
    easeInOut: function(t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b
      return (-c / 2) * ((t -= 2) * t * t * t - 2) + b
    }
  },
  Quint: {
    easeIn: function(t: number, b: number, c: number, d: number) {
      return c * (t /= d) * t * t * t * t + b
    },
    easeOut: function(t: number, b: number, c: number, d: number) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b
    },
    easeInOut: function(t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t * t + b
      return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b
    }
  },
  Sine: {
    easeIn: function(t: number, b: any, c: number, d: number) {
      return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b
    },
    easeOut: function(t: number, b: number, c: number, d: number) {
      return c * Math.sin((t / d) * (Math.PI / 2)) + b
    },
    easeInOut: function(t: number, b: number, c: number, d: number) {
      return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b
    }
  },
  Expo: {
    easeIn: function(t: number, b: number, c: number, d: number) {
      return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
    },
    easeOut: function(t: number, b: number, c: number, d: number) {
      return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b
    },
    easeInOut: function(t: number, b: number, c: number, d: number) {
      if (t == 0) return b
      if (t == d) return b + c
      if ((t /= d / 2) < 1) return (c / 2) * Math.pow(2, 10 * (t - 1)) + b
      return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b
    }
  },
  Circ: {
    easeIn: function(t: number, b: number, c: number, d: number) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
    },
    easeOut: function(t: number, b: number, c: number, d: number) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
    },
    easeInOut: function(t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b
      return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
    }
  },
  Elastic: {
    easeIn: function(
      t: number,
      b: number,
      c: number,
      d: number,
      a: number,
      p: number
    ) {
      let s
      if (t == 0) return b
      if ((t /= d) == 1) return b + c
      if (typeof p == 'undefined') p = d * 0.3
      if (!a || a < Math.abs(c)) {
        s = p / 4
        a = c
      } else {
        s = (p / (2 * Math.PI)) * Math.asin(c / a)
      }
      return (
        -(
          a *
          Math.pow(2, 10 * (t -= 1)) *
          Math.sin(((t * d - s) * (2 * Math.PI)) / p)
        ) + b
      )
    },
    easeOut: function(
      t: number,
      b: any,
      c: number,
      d: number,
      a: number,
      p: number
    ) {
      let s
      if (t == 0) return b
      if ((t /= d) == 1) return b + c
      if (typeof p == 'undefined') p = d * 0.3
      if (!a || a < Math.abs(c)) {
        a = c
        s = p / 4
      } else {
        s = (p / (2 * Math.PI)) * Math.asin(c / a)
      }
      return (
        a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
        c +
        b
      )
    },
    easeInOut: function(
      t: number,
      b: number,
      c: number,
      d: number,
      a: number,
      p: number
    ) {
      let s
      if (t == 0) return b
      if ((t /= d / 2) == 2) return b + c
      if (typeof p == 'undefined') p = d * (0.3 * 1.5)
      if (!a || a < Math.abs(c)) {
        a = c
        s = p / 4
      } else {
        s = (p / (2 * Math.PI)) * Math.asin(c / a)
      }
      if (t < 1)
        return (
          -0.5 *
            (a *
              Math.pow(2, 10 * (t -= 1)) *
              Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
          b
        )
      return (
        a *
          Math.pow(2, -10 * (t -= 1)) *
          Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
          0.5 +
        c +
        b
      )
    }
  },
  Back: {
    easeIn: function(t: number, b: number, c: number, d: number, s: number) {
      if (typeof s == 'undefined') s = 1.70158
      return c * (t /= d) * t * ((s + 1) * t - s) + b
    },
    easeOut: function(t: number, b: number, c: number, d: number, s: number) {
      if (typeof s == 'undefined') s = 1.70158
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
    },
    easeInOut: function(t: number, b: number, c: number, d: number, s: number) {
      if (typeof s == 'undefined') s = 1.70158
      if ((t /= d / 2) < 1)
        return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b
      return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b
    }
  },
  Bounce: {
    easeIn: function(t: number, b: number, c: number, d: number) {
      return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b
    },
    easeOut: function(t: number, b: number, c: number, d: number) {
      if ((t /= d) < 1 / 2.75) {
        return c * (7.5625 * t * t) + b
      } else if (t < 2 / 2.75) {
        return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b
      } else if (t < 2.5 / 2.75) {
        return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b
      } else {
        return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b
      }
    },
    easeInOut: function(t: number, b: number, c: number, d: number) {
      if (t < d / 2) {
        return Tween.Bounce.easeIn(t * 2, 0, c, d) * 0.5 + b
      } else {
        return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b
      }
    }
  }
}

export const TweenMap = {
  Linear: Tween.Linear,
  'Quad-easeIn': Tween.Quad.easeIn,
  'Quad-easeOut': Tween.Quad.easeOut,
  'Quad-easeInOut': Tween.Quad.easeInOut,
  'Cubic-easeIn': Tween.Cubic.easeIn,
  'Cubic-easeOut': Tween.Cubic.easeOut,
  'Cubic-easeInOut': Tween.Cubic.easeInOut,
  'Quart-easeIn': Tween.Quart.easeIn,
  'Quart-easeOut': Tween.Quart.easeOut,
  'Quart-easeInOut': Tween.Quart.easeInOut,
  'Quint-easeIn': Tween.Quint.easeIn,
  'Quint-easeOut': Tween.Quint.easeOut,
  'Quint-easeInOut': Tween.Quint.easeInOut,
  'Sine-easeIn': Tween.Sine.easeIn,
  'Sine-easeOut': Tween.Sine.easeOut,
  'Sine-easeInOut': Tween.Sine.easeInOut,
  'Expo-easeIn': Tween.Expo.easeIn,
  'Expo-easeOut': Tween.Expo.easeOut,
  'Expo-easeInOut': Tween.Expo.easeInOut,
  'Circ-easeIn': Tween.Circ.easeIn,
  'Circ-easeOut': Tween.Circ.easeOut,
  'Circ-easeInOut': Tween.Circ.easeInOut,
  'Elastic-easeIn': Tween.Elastic.easeIn,
  'Elastic-easeOut': Tween.Elastic.easeOut,
  'Elastic-easeInOut': Tween.Elastic.easeInOut,
  'Back-easeIn': Tween.Back.easeIn,
  'Back-easeOut': Tween.Back.easeOut,
  'Back-easeInOut': Tween.Back.easeInOut,
  'Bounce-easeIn': Tween.Bounce.easeIn,
  'Bounce-easeOut': Tween.Bounce.easeOut,
  'Bounce-easeInOut': Tween.Bounce.easeInOut
}

export default Tween
