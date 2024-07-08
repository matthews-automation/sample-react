import { headers } from 'next/headers'
import { UAParser } from 'ua-parser-js'

export const isIOSDevice = () => {
  if (typeof process === 'undefined') throw new Error('[Server method] you are importing a server-only module outside of server component')
  const { get } = headers()
  const ua = get('user-agent');
  const device = new UAParser(ua || '');
  const os = device.getOS()
  return os.name === 'iOS';
}