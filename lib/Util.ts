export namespace Activation {
  export function sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x));
  }

  export function sigmoidDeriv(x: number): number {
    return sigmoid(x) * (1 - sigmoid(x));
  }

  export function relu(x: number): number {
    if(x > 0) {
      return x;
    } else {
      return 0;
    }
  }

  export function reluDeriv(x: number): number {
    if(x < 0) {
      return 1;
    } else {
      return 0;
    }
  }
}

namespace Cost {

}
