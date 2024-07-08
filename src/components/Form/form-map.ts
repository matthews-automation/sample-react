import { ComponentType } from 'react'
import dynamic from 'next/dynamic'

export default {
  'text': dynamic(() => import('./Input')),
  'email': dynamic(() => import('./Input')),
  'tel': dynamic(() => import('./Phone')),
  'textarea': dynamic(() => import('./TextArea')),
  'select': dynamic(() => import('./Select')),
  'radio': dynamic(() => import('./RadioGroup')),
}