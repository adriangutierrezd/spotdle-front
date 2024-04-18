import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatSecondsToTime = (input: string | number): string => {

  const toNumber = Number(input)
  if (isNaN(toNumber)) return '00:00:00'

  const hourStatements = []

  const numDays = Math.floor(toNumber / (3600 * 24))
  if (numDays >= 1) {
    hourStatements.push(numDays.toString().padStart(2, '0'))
  }

  hourStatements.push(Math.floor((toNumber % (3600 * 24)) / 3600).toString().padStart(2, '0'))
  hourStatements.push(Math.floor((toNumber % 3600) / 60).toString().padStart(2, '0'))
  hourStatements.push((toNumber % 60).toString().padStart(2, '0'))

  return hourStatements.join(':')

}