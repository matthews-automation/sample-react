import { ComponentType } from 'react'
import dynamic from 'next/dynamic'

const ComponentMap: { [key: string]: ComponentType } = {
  'overview_images': dynamic(() => import('@/components/OverviewImages')),
  'overview_text_only': dynamic(() => import('@/components/OverviewText')),
  'two_up': dynamic(() => import('@/components/TwoUp')),
  'testimonials': dynamic(() => import('@/components/Testimonials')),
  'link_listing': dynamic(() => import('@/components/LinkListing')),
  'accordion': dynamic(() => import('@/components/Accordion')),
  'media': dynamic(() => import('@/components/Media')),
  'content_block': dynamic(() => import('@/components/ContentBlock')),
  'slideshow': dynamic(() => import('@/components/Slideshow')),
  'feature_cards': dynamic(() => import('@/components/FeatureCards')),
  'specs': dynamic(() => import('@/components/Specs')),
  'listing_feature': dynamic(() => import('@/components/ListingFeature')),
  'expanding_content': dynamic(() => import('@/components/Section')),
  'Threeup': dynamic(() => import('@/components/Threeup')),
}

export default ComponentMap;
