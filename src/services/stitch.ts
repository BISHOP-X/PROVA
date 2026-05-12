import axios from 'axios'

export async function callStitch(payload: any = {}) {
  const res = await axios.post('/functions/stitch-proxy', payload, {
    headers: { 'Content-Type': 'application/json' },
  })
  return res.data
}

export default callStitch
