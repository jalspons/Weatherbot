import fetch                             from 'node-fetch'
import { parseString }                   from 'xml2js'
import { apiKey, baseUrl, observation }  from './reference.json'

// Generating url and parsing XML and JSON
const weatherUrl = (place, param, type) => `${baseUrl}/${apiKey}/wfs?request=getFeature&storedquery_id=${type}&place=${place}&parameters=${param}`
const xml2json   = async xml => new Promise((resolve, reject) => parseString(xml, (e, j) => e ? reject(e) : resolve(j)))
const data = x => {
  const root   = x['wfs:FeatureCollection']['wfs:member'][0]['omso:PointTimeSeriesObservation'][0]
  const result = root['om:result'][0]['wml2:MeasurementTimeseries'][0]['wml2:point']
    .map( x => x['wml2:MeasurementTVP'][0])
    .map(x => [ x['wml2:time'][0], x['wml2:value'][0] ])
  return result[result.length - 1][1]
}

// Fetching data from database
const weatherData = async (place, param, type) => await fetch(weatherUrl(place, param, type))
  .then(res => res.text())
  .then(x => xml2json(x))
  .then(x => data(x))

// command /sää parameters for the url 
const t = {
    lämpötila: 'tday',
    lumi: 'snow',
    sade: 'rrday'
}

// Generates string for for the response post
const parseWeatherMessage = async (place, parameters) => {
    try {
      let message = `Tänään sää ${place}:\n`
      const data = await Promise.all(parameters.map(async (e) => await weatherData(place, t[e], observation)))
      data.forEach( y => message += `${parameters[data.indexOf(y)]}: ${y}\n`)
      return message
    }
    catch (e) {
      console.log(e)
      return "Did you use proper parameters O_o?\nSee </help saa> for more information :)"
    }
  }

// Export the function for other .js file use
export default parseWeatherMessage
