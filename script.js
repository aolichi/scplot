let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
let req = new XMLHttpRequest()

let data = []

let xScale
let yScale

let w = 800
let h = 600
let p = 40

let svg = d3.select('svg')
let tooltip = d3.select("#tooltip")

let drawCanvas= () => {
  svg.attr("width", w)
  svg.attr("height", h)
}

let generateScales = () => {
  
  xScale= d3.scaleLinear()
            .range([p,w-p])
            .domain([d3.min(data, (d)=>{
               return d['Year']
             }) - 1,d3.max(data,(d)=>{
               return d['Year']
             }) + 1])
            
  //using scaleTime because have to work with minutes/seconds etc
  yScale = d3.scaleTime()
             .range([p,h-p])
  //.domain([d3.min(data,(d)=>d['Year']),d3.max(data,(d)=>d['Year'])])
             .domain([d3.min(data, (d)=>{
               return new Date(d['Seconds'] * 1000)
             }),d3.max(data, (d)=>{
               return new Date(d['Seconds'] * 1000)
             })])
 //the opposite because the ongest time should be at the bottom and the fastes should be at the top
}

let drawDots = () => {
  svg.selectAll('circle')
     .data(data)
     .enter()
     .append('circle')
     .attr("class","dot")
     .attr("r", 5)
     .attr("data-xvalue",(d) => d['Year']) //addressing the keys in objects
     .attr("data-yvalue",(d) => new Date(d['Seconds']*1000)) //time date format newDate
     .attr('cx',(d)=>xScale(d['Year']))
     .attr('cy',(d)=>yScale(new Date(d['Seconds']*1000)))
     .attr("fill",(d)=>{
    if((d['Doping'])!=""){
      return "#EEDE8C"
    }else{
      return "#5EABDB"
    }})
  //mouseover effect
     .on("mouseover",(d)=>{
          tooltip.transition()
                 .style("visibility","visible")
        if((d['Doping'])!=""){
          tooltip.text((d['Year'])+" - "+(d['Name'])+" - "+(d['Doping'])+" - "+(d["Time"]))
        }else{
          tooltip.text((d['Year'])+" - "+(d['Name'])+" - "+(d["Time"]))
        }
          tooltip.attr("data-year",(d['Year']))
  })     
     .on("mouseout",(d)=>{
          tooltip.transition()
                 .style("visibility","hidden")})
  
}

let drawAxis = () => {
  
  let xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format('d')) //getting rid of the coma in years
     svg.append('g')
     .call(xAxis)
     .attr("id","x-axis")
     .attr("transform","translate(0 ," + (h-p) + ")")
  
  let yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.timeFormat('%M:%S'))
   svg.append('g')
     .call(yAxis)
     .attr("id","y-axis")
     .attr("transform","translate(" + p + ")",0)
}



//opening data & loading functions 
req.open('GET',url,true)
req.onload = () => {
  data = JSON.parse(req.responseText)
  console.log(data)
  drawCanvas()
  generateScales()
  drawDots()
  drawAxis()
}
req.send()