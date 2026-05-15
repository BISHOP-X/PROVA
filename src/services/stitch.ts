import axios from 'axios'

export async function callStitch(payload: Record<string, unknown> = {}) {
  const res = await axios.post('/functions/stitch-proxy', payload, {
    headers: { 'Content-Type': 'application/json' },
  })
  return res.data
}

export default callStitch
