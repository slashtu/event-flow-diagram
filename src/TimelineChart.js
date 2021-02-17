import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import chart from './chart';
import d3Sankey from './sankey';

interface Props {
  config: any;
}

const TimelineChart: React.FC<Props> = ({ config }) => {
  useEffect(() => {
    const sankey = d3Sankey()
      .nodeWidth(250)
      .nodeHeight(30)
      .nodePadding(50)
      .size([800, 1800]);

    let path = sankey.link();

    const { nodes, links }: { nodes: any[], links: any[] } = config;

    sankey.nodes(nodes).links(links).layout(50);

    console.log('nodes', nodes);
    console.log('links', links);

    const svg = chart.createSVG();

    let link = chart.addLinks(svg, links, path);

    let node = chart.addNodes(svg, nodes);

    chart.addRect(node);
    chart.addNodeText(node);
  }, [config]);
  if (config.nodes.length < 1) return null;

  return (
    <TimelineChartStyled>
      <SVGContainer id="my_dataviz" />
    </TimelineChartStyled>
  );
};

const TimelineChartStyled = styled.div``;

const SVGContainer = styled.div`
  .link {
    fill: none;
    /* stroke: #ff8438; */
    stroke-opacity: 0.3;
  }
`;

export default TimelineChart;
