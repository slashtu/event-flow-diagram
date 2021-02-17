import * as d3 from 'd3';

const highlight = (id: string, type: string) => {
  if (type === 'node') {
    d3.select(`#${id}`).style('fill', '#c7b546');
  }

  if (type === 'link') {
    d3.select(`#${id}`).style('stroke-opacity', 1);
  }
};

export default {
  createSVG: () => {
    const svg = d3
      .select('#my_dataviz')
      .append('svg')
      .attr('width', 800)
      .attr('height', 2000);

    return svg;
  },

  addLinks: (svg: any, links: any, path: any) => {
    return svg
      .append('g')
      .selectAll('.link')
      .data(links)
      .enter()
      .append('path')
      .attr('class', function (d: any) {
        return 'link';
      })
      .attr('d', path)
      .attr('id', function (d: any) {
        return d.id;
      })
      .style('stroke-width', function (d: any) {
        // return Math.max(1, d.dy);
        return 3;
      })
      .style('stroke', function (d: any) {
        console.log();
        if (d.mechanism === 'lockBonus') {
          return '#ff8438';
        }

        if (d.mechanism === 'inheritance') {
          return '#54ff60';
        }
      })
      .sort(function (a: any, b: any) {
        return b.dy - a.dy;
      });
  },

  addNodes: (svg: any, nodes: any) => {
    return svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll()
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', function (d: any) {
        return 'translate(' + d.x + ',' + d.y + ')';
      })
      .on('mouseover', function (event: any, node: any) {
        let stroke_opacity = 0;
        // if (d3.select(this).attr('data-clicked') == '1') {
        //   d3.select(this).attr('data-clicked', '0');
        //   stroke_opacity = 0.2;
        // } else {
        //   d3.select(this).attr('data-clicked', '1');
        //   stroke_opacity = 0.5;
        // }

        let traverse = [
          {
            linkType: 'sourceLinks',
            nodeType: 'target',
          },
          {
            linkType: 'targetLinks',
            nodeType: 'source',
          },
        ];

        highlight(node.id, 'node');

        traverse.forEach((step) => {
          let depth = 1;
          const nextNodes: any[] = [node];

          while (nextNodes.length > 0 && depth > 0) {
            const node = nextNodes.shift();

            node[step.linkType].forEach(function (link: any) {
              nextNodes.push(link[step.nodeType]);
              highlight(link[step.nodeType].id, 'node');
              highlight(link.id, 'link');
            });

            depth--;
          }
        });
      })
      .on('mouseout', () => {
        // reset color
        d3.selectAll('.link').style('stroke-opacity', 0.3);
        d3.selectAll('.rect')
          .style('opacity', 0.3)
          .style('fill', function (d: any) {
            if (d.status === 'error') return 'red';
            else return '#4083ac';
          });
      });
  },

  addRect: (node: any) => {
    return node
      .append('rect')
      .attr('id', function (d: any) {
        return d.id;
      })
      .attr('class', 'rect')
      .attr('height', function (d: any) {
        return d.dy;
      })
      .attr('width', function (d: any) {
        return d.dx;
      })
      .style('fill', function (d: any) {
        if (d.status === 'error') return 'red';
        else return '#4083ac';
      })
      .style('opacity', 0.3)
      .style('stroke', function (d: any) {
        return '#6ebeff';
      })
      .append('title')
      .text(function (d: any) {
        return d.name;
      });
  },

  addNodeText: (node: any) => {
    return node
      .append('text')
      .style('fill', '#c9c9ce')
      .attr('x', 10)
      .attr('text-anchor', 'start')
      .attr('y', function (d: any) {
        return d.dy / 2;
      })
      .attr('dy', '.35em')
      .attr('transform', null)
      .text(function (d: any) {
        return d.name;
      });
  },
};
