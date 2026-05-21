/**
 * compound.js — Core financial calculation engine.
 * Pure functions, no Vue dependencies. Easy to unit test.
 */

export function compound(principal, annualRate, years, monthlyAdd = 0) {
  const safeRate = Math.max(annualRate, -0.99)
  const monthlyRate = Math.pow(1 + safeRate, 1 / 12) - 1
  let value = Math.max(principal, 0)
  const data = [{ year: 0, value: Math.round(value) }]
  for (let m = 1; m <= years * 12; m++) {
    value = Math.max(value * (1 + monthlyRate) + monthlyAdd, 0)
    if (m % 12 === 0) data.push({ year: m / 12, value: Math.round(value) })
  }
  return data
}

export function buildProjection(config) {
  const { scenario, years, monthlyEtf, monthlyBtc, deployJapan, includeCrypto, assets, returns } = config
  const r = returns[scenario]
  const effectiveStocks = deployJapan ? assets.stocks + assets.japan : assets.stocks

  const etfD  = compound(effectiveStocks, r.etf,              years, monthlyEtf)
  const epfD  = compound(assets.epf,      r.epf,              years, 0)
  const cashD = compound(assets.bank,     0.025,              years, 0)
  const asbD  = compound(assets.asb,      r.asb,              years, 0)
  const btcD  = compound(assets.btc,      r.btc,              years, includeCrypto ? monthlyBtc : 0)
  const solD  = compound(assets.sol,      r.sol + r.solStake, years, 0)

  return etfD.map((p, i) => {
    const btc = includeCrypto ? btcD[i].value : 0
    const sol = includeCrypto ? solD[i].value : 0
    return {
      year:  p.year,
      ETF:   p.value,
      EPF:   epfD[i].value,
      Cash:  cashD[i].value,
      ASB:   asbD[i].value,
      BTC:   btc,
      SOL:   sol,
      Total: p.value + epfD[i].value + cashD[i].value + asbD[i].value + btc + sol
    }
  })
}

export function fmt(v) {
  if (v >= 1_000_000) return `RM${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000)     return `RM${Math.round(v).toLocaleString('en-MY')}`
  return `RM${Math.round(v)}`
}

export function totalContributed(config) {
  const { assets, monthlyEtf, monthlyBtc, years, deployJapan, includeCrypto } = config
  const principal = (deployJapan ? assets.stocks + assets.japan : assets.stocks)
    + assets.epf + assets.bank + assets.asb
    + (includeCrypto ? assets.btc + assets.sol : 0)
  return principal + (monthlyEtf + (includeCrypto ? monthlyBtc : 0)) * years * 12
}
