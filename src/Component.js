import React, { useState } from "react";
import DrillDownPie from "./DrillDownPie";
import * as d3 from "d3";
import faker from "faker";
import chroma from "chroma-js";

const generateData = (level, prevIndex, color) => {
  const pointsNum = d3.randomUniform(1,10)();
  const colors = color ? d3.range(pointsNum).map( i => chroma(color).darken(i * 0.2).hex()) : d3.schemePaired;

  return d3.range(pointsNum).map(i => ({
    value: Math.abs(d3.randomNormal()()),
    children: level > 0 ? generateData(level-1, i, colors[i]) : [],
    id: `${level}-${i}`,
    name: faker.internet.userName(),
    color: colors[i],
    level,
    index: i,
    prevIndex: prevIndex    
  }))
};

function Component() {
  const data = generateData(5);

  return (
    <div style={{textAlign: "center"}}>
      <h1>Drilldown piechart</h1>
      <svg width="500" height="500">
        <DrillDownPie data={data} x={250} y={250}/>
      </svg>
      
    </div>
  );
}

export default Component;


