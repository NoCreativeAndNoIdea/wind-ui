export const fromPairs = (parirs?: Array<any[]>) => {
  let index = -1
  const length = parirs ? parirs.length : 0
  const result: Record<string, any> = {}

  while (++index < length) {
    const pari = parirs?.[index] as any[]
    const [key, val] = pari
    result[key] = val
  }

  return result
}
