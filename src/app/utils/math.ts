import { formatGwei } from 'viem/utils'

export function toRoundedGwei(value: any) {
  return Math.round(Number(formatGwei(value ?? 0)) * 100) / 100
}

export function getMin(numbers: Array<number>) {
  if (numbers.length === 0) return 0

  return numbers.sort((a, b) => a - b)[0]
}

export function getMax(numbers: Array<number>) {
  if (numbers.length === 0) return 0

  return numbers.sort((a, b) => b - a)[0]
}

export function getAverage(numbers: Array<number>) {
  if (numbers.length === 0) return 0

  return Math.round((numbers.reduce((a, b) => a + b) / numbers.length) * 100) / 100
}

export function getMedian(numbers: Array<number>) {
  if (numbers.length === 0) return 0

  let middle = Math.floor(numbers.length / 2)
  numbers = [...numbers].sort((a, b) => a - b)
  return numbers.length % 2 !== 0 ? numbers[middle] : (numbers[middle - 1] + numbers[middle]) / 2
}

