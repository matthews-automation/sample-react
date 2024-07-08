"use client"
import "./index.scss";
import YoutubeEmbed from '../Youtube';
import SpecsItem from "../SpecsItem";
import { useState, useEffect, useRef } from "react";
import Toggle from "../Toggle";
import SecondaryButton from "../Buttons/SecondaryButton";
import InlineButton from "../Buttons/InlineButton";
import ImageParallax from "../ImageParallax";
export default function Specs ( props : SpecsProps) {
  const { image_ratio, media_image, media_youtube_video, eyebrow, headline, description, primary_cta, secondary_cta, specs_list_title, specs_list } = props
  
  const [metric, setMetric] = useState(false)

  // Conversion functions
  const convertToMetric = (value: number, unit: string): string => {
    switch(unit.toLowerCase()) {
      case 'in': return `${(value * 25.4).toFixed(2)} mm`
      case 'lb': return `${(value * 0.453592).toFixed(2)} kg`
      case 'in/s': return `${(value * 0.0254).toFixed(2)} m/s`
      default: return `${value} ${unit}`
    }
  }

  const convertToImperial = (value: number, unit: string): string => {
    switch(unit.toLowerCase()) {
      case 'mm': return `${(value / 25.4).toFixed(2)} in`
      case 'kg': return `${(value / 0.453592).toFixed(2)} lb`
      case 'm/s': return `${(value / 0.0254).toFixed(2)} in/s`
      default: return `${value} ${unit}`
    }
  }

  const converter = (measurement: string, unitOfMeasure: string): string => {
    measurement = measurement.replace(/\u00A0/g, ' ')
    const values = measurement.split(' x ')

    if (values.length > 1) {
      const convertedValues = values.map(value => {
        const numValue = parseFloat(value)
        if (metric) {
          if (unitOfMeasure === 'in' || unitOfMeasure === 'lb' || unitOfMeasure === 'in/s') {
            return convertToMetric(numValue, unitOfMeasure).split(' ')[0]
          }
        } else {
          if (unitOfMeasure === 'mm' || unitOfMeasure === 'kg' || unitOfMeasure === 'm/s') {
            return convertToImperial(numValue, unitOfMeasure).split(' ')[0]
          }
        }
        return value
      })
      
      return `${convertedValues.join(' x ')} ${metric ? convertToMetric(1, unitOfMeasure).split(' ')[1] : convertToImperial(1, unitOfMeasure).split(' ')[1]}`
    } else {
      const value = parseFloat(measurement)
      if (metric) {
        if (unitOfMeasure === 'in' || unitOfMeasure === 'lb' || unitOfMeasure === 'in/s') {
          return convertToMetric(value, unitOfMeasure)
        }
      } else {
        if (unitOfMeasure === 'mm' || unitOfMeasure === 'kg' || unitOfMeasure === 'm/s') {
          return convertToImperial(value, unitOfMeasure)
        }
      }
      return `${measurement} ${unitOfMeasure}`
    }
  }


  const [isContentSticky, setIsContentSticky] = useState(false)
  const contentContainer = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsContentSticky(entry.isIntersecting)
      },
      {
        rootMargin: "-1px 0px 0px 0px",
      }
    )

    if (contentContainer.current) {
      observer.observe(contentContainer.current)
    }

    return () => {
      if (contentContainer.current) {
        observer.unobserve(contentContainer.current)
      }
    };
  }, []);
  

  return (
    <div className="specs">
      <div className="container">
        <div className='row'>
          <div ref={contentContainer} className='col-12 col-md-6 video-container'>
            <div ref={contentRef} className={`${isContentSticky ? "sticky" : ""}`}>
              {media_image &&
                <ImageParallax imageUrl={media_image.url} classes={ image_ratio === "6/7" ? ['ratio-6-7'] : image_ratio === "5/4" ? ['ratio-5-4'] : ['']} />
              }
              {media_youtube_video && !media_image && <YoutubeEmbed youtubeurl={media_youtube_video} />}
            </div>
          </div>
          <div className='col-12 col-md-6'>
            <div className='d-flex'>
              <div className='col-md-10 col-12 col-md-offset-2 col-offset-0'>

                <div className="title-lockup">
                  <p className="eyebrow" dangerouslySetInnerHTML={{ __html: eyebrow }} />
                  <h3 className="subtitle-3" dangerouslySetInnerHTML={{ __html: headline }} />
                  <p className="body" dangerouslySetInnerHTML={{ __html: description }} />
                  <div className="buttons-wrap">
                    { primary_cta && <SecondaryButton url={primary_cta.url} label={primary_cta.title} /> }
                    { secondary_cta && <InlineButton url={secondary_cta.url} label={secondary_cta.title}  /> }
                  </div>
                </div>

                <div className="list">
                  <div className="title-list d-flex justify-between">
                    <h4 className="subtitle-4" dangerouslySetInnerHTML={{ __html: specs_list_title }} />
                    <div className="d-flex align-center">
                      <Toggle metric={metric} onClick={() => setMetric(!metric)} />
                      <p className="body">Metric</p>
                    </div>
                  </div>
                  {specs_list && specs_list.map((item, i) => (
                    <SpecsItem key={i}>
                      <div className="d-flex align-center">
                        <p className="col-6 eyebrow" dangerouslySetInnerHTML={{ __html: item.spec_title }} />
                        <p className="col-6 body" dangerouslySetInnerHTML={{ __html: item.unit_of_measure != 'none' ? converter(item.specs_content, item.unit_of_measure) : item.specs_content }}/>
                      </div>
                    </SpecsItem>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}