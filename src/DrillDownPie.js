import React, { useState, useEffect, Fragment } from 'react';
import * as d3 from "d3";
import styled from "styled-components";

const Path = styled.path`
    fill: ${props => props.color};
    cursor: ${props => props.depth ? "pointer" : "default"};
    stroke: black;
`;

const Arc = ({ arcData, onClick }) => {
    const [radiusAdd, setRadiusAdd] = useState(0);
    
    const arc = d3.arc().innerRadius(15 + radiusAdd / 2).outerRadius(105 + radiusAdd);

    const mouseOver = () => {
        setRadiusAdd(20);
    }

    const mouseOut = () => {
        setRadiusAdd(0);
    }

    return <Path
        d={arc(arcData)}
        depth={arcData.data.children.length} 
        color={arcData.data.color}
        onMouseOver={mouseOver}
        onMouseOut={mouseOut}
        onClick={() => onClick(arcData)}
        />
}

const Label = ({d}) => {
    const r = 120;
    var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2;
    const x = Math.cos(a) * (120+30);
    const y = Math.sin(a) * (120 + 30);
    const dCopy = {...d};
    dCopy.cx = Math.cos(a) * (r - 45);
    dCopy.cy = Math.sin(a) * (r - 45);
    dCopy.sx = x - 30/2 - 2;
    dCopy.ox = x + 30/2 + 2;
    dCopy.sy = dCopy.oy = y + 5;

    return (
        <Fragment>
            <text x={x} y ={y}>{(d.value * 100).toFixed()}</text>
            <path fill="none" stroke="black" d={dCopy.cx > dCopy.ox ?
                 "M" + dCopy.sx + "," + dCopy.sy + "L" + dCopy.ox + "," + dCopy.oy + " " + dCopy.cx + "," + dCopy.cy 
                : "M" + dCopy.ox + "," + dCopy.oy + "L" + dCopy.sx + "," + dCopy.sy + " " + dCopy.cx + "," + dCopy.cy}/>
        </Fragment>
    );
};

const DrillDownPie = ({ data, x, y, startAngle = 0 }) => {
    const[percentVisible, setPercentVisible] = useState(0);
    const [renderData, setRenderData] = useState(data);
    const [stack, setStack] = useState([]);
    const [_startAngle, setStartAngle] = useState(startAngle);

    const pie = d3.pie()
        .startAngle(_startAngle)
        .endAngle(_startAngle + percentVisible * Math.PI * 2)
        .value(d => d.value);

    useEffect(() => {
        d3.selection()
            .transition()
            .duration(3000)
            .tween("percentVisible", () => {
                const percentInterpolate = d3.interpolate(0, 100);
                return t => setPercentVisible(percentInterpolate(t));
            })
    }, [renderData]);

    const drilldown = ({startAngle, index}) => {
        setStartAngle(startAngle);
        setStack([...stack, renderData]);
        setRenderData(renderData[index].children);
    }

    const drillup = () => {
        if (stack.length > 0) {
            const prevData = stack.pop();
            setStack(stack);
            setRenderData(prevData);
        }
    }


    return <g transform={`translate(${x},${y})`}>
        {pie(renderData).map(d => (
                <Arc 
                arcData={d} 
                key={d.data.id}
                onClick={() => drilldown({startAngle, index: d.data.index})} />
                
            
        ))}
        {pie(renderData).map(d => (
                <Label d={d}/>
        ))}
        <circle cx={0} cy={0} r={15} onClick={drillup} fill="white"/>
    </g>
}

export default DrillDownPie;