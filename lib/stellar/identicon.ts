// SPDX-FileCopyrightText: 2026 Padparadscho <contact@padparadscho.com>
// SPDX-License-Identifier: GPL-3.0-only

/**
 * @license Apache-2.0
 * This code is adapted from https://github.com/Lobstrco/stellar-identicon-js/
 * That repo implements Stellar identicons according to SEP-33, but is no longer maintained.
 * Original code licensed under Apache-2.0: https://www.apache.org/licenses/LICENSE-2.0
 * This file provides a self-contained implementation with modifications.
 */

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * Decode a Base32 string into a byte array
 * @param input Base32-encoded string
 * @returns Decoded byte array
 */
function decodeBase32(input: string): number[] {
  const map = new Map<string, number>();
  for (let i = 0; i < BASE32_CHARS.length; i++) {
    map.set(BASE32_CHARS[i], i);
  }
  const result: number[] = [];
  let shift = 8;
  let carry = 0;

  for (const char of input.toUpperCase()) {
    const symbol = (map.get(char) ?? 0) & 0xff;
    shift -= 5;
    if (shift > 0) {
      carry |= symbol << shift;
    } else if (shift < 0) {
      result.push(carry | (symbol >> -shift));
      shift += 8;
      carry = (symbol << shift) & 0xff;
    } else {
      result.push(carry | symbol);
      shift = 8;
      carry = 0;
    }
  }

  if (shift !== 8 && carry !== 0) result.push(carry);
  return result;
}

/**
 * Convert a Stellar public address to a byte array
 * @param address Stellar public address
 * @returns Byte array derived from the address
 */
function publicKeyToBytes(address: string): number[] {
  return decodeBase32(address).slice(2, 16);
}

/**
 * Generate a boolean matrix for the identicon based on the byte array
 * @param bytes Byte array derived from the Stellar public address
 * @returns 7x7 boolean matrix representing the identicon
 */
function generateMatrix(bytes: number[]): boolean[][] {
  const matrix: boolean[][] = [];
  const halfWidth = Math.ceil(7 / 2);

  for (let row = 0; row < 7; row++) {
    const rowData: boolean[] = new Array(7).fill(false);
    for (let col = 0; col < halfWidth; col++) {
      const bitIndex = col + row * halfWidth;
      const byteIndex = Math.floor(bitIndex / 8);
      const bitOffset = 7 - (bitIndex % 8);
      const isSet = (bytes[byteIndex + 1] & (1 << bitOffset)) !== 0;
      if (isSet) {
        rowData[col] = true;
        rowData[7 - col - 1] = true;
      }
    }
    matrix.push(rowData);
  }
  return matrix;
}

/**
 * Convert HSV color to RGB
 * @param h Hue (0 to 1)
 * @param s Saturation (0 to 1)
 * @param v Value (0 to 1)
 * @returns RGB color as a tuple [r, g, b]
 */
function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const cases: [number, number, number] = [
    [v, t, p] as [number, number, number],
    [q, v, p] as [number, number, number],
    [p, v, t] as [number, number, number],
    [p, q, v] as [number, number, number],
    [t, p, v] as [number, number, number],
    [v, p, q] as [number, number, number],
  ][i % 6];
  return [
    Math.round(cases[0] * 255),
    Math.round(cases[1] * 255),
    Math.round(cases[2] * 255),
  ];
}

/**
 * Generate a Stellar SEP-33 identicon as a data URL
 * @param address Stellar public address
 * @param size Pixel size of the generated image
 * @returns Data URL string
 */
export function generateIdenticon(address: string, size: number): string {
  const bytes = publicKeyToBytes(address);
  const matrix = generateMatrix(bytes);
  const [r, g, b] = hsvToRgb(bytes[0] / 255, 0.7, 0.8);

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = `rgb(${r},${g},${b})`;

  const cellSize = size / 7;
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      if (matrix[row][col]) {
        ctx.fillRect(cellSize * col, cellSize * row, cellSize, cellSize);
      }
    }
  }

  return canvas.toDataURL();
}
