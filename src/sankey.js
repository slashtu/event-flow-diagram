import * as d3 from 'd3';

const Sankey = function () {
  let sankey = {};
  let nodeWidth = 24;
  let nodeHeight = 30;
  let nodePadding = 30;
  let roundHeight = 100;
  let size = [1, 1];
  let nodes = [];
  let links = [];

  sankey.debug = function () {
    console.log('debug');
    console.log(nodes);
  };

  sankey.nodeWidth = function (_) {
    if (!arguments.length) return nodeWidth;
    nodeWidth = +_;
    return sankey;
  };

  sankey.nodeHeight = function (_) {
    if (!arguments.length) return nodeHeight;
    nodeHeight = +_;
    return sankey;
  };

  sankey.roundHeight = function (_) {
    if (!arguments.length) return roundHeight;
    roundHeight = +_;
    return roundHeight;
  };

  sankey.nodePadding = function (_) {
    if (!arguments.length) return nodePadding;
    nodePadding = +_;
    return sankey;
  };

  sankey.nodes = function (data) {
    if (!arguments.length) return nodes;
    nodes = data;
    nodes.forEach((node, i) => {
      node.id = `node-${i}`;
      node.type = 'node';
    });
    return sankey;
  };

  sankey.links = function (data) {
    if (!arguments.length) return links;
    links = data;
    links.forEach((link, i) => {
      link.id = `link-${i}`;
      link.type = 'link';
    });
    return sankey;
  };

  sankey.size = function (_) {
    if (!arguments.length) return size;
    size = _;
    return sankey;
  };

  sankey.layout = function (iterations) {
    computeNodeLinks();
    computeNodeBreadths();
    computeNodeDepths(iterations);
    computeLinkDepths();
    computeNodeGroup();

    return sankey;
  };

  sankey.relayout = function () {
    computeLinkDepths();
    return sankey;
  };

  sankey.link = function () {
    var curvature = 0.3;

    function link(d) {
      var x0 = d.source.x + (d.sx || 0),
        x1 = d.target.x + (d.tx || 0),
        y0 = d.source.y + d.source.dy,
        y1 = d.target.y,
        xi = d3.interpolateNumber(y0, y1),
        x2 = xi(curvature),
        x3 = xi(1 - curvature);

      return (
        'M' +
        x0 +
        ',' +
        y0 +
        'C' +
        x0 +
        ',' +
        x2 +
        ' ' +
        x1 +
        ',' +
        x3 +
        ' ' +
        x1 +
        ',' +
        y1
      );
    }

    link.curvature = function (_) {
      if (!arguments.length) return curvature;
      curvature = +_;
      return link;
    };

    return link;
  };

  function computeNodeGroup() {
    nodes.forEach(function (node) {
      if (node.group === 'G2') node.y += 50;
    });
  }

  // Populate the sourceLinks and targetLinks for each node.
  // Also, if the source and target are not objects, assume they are indices.
  function computeNodeLinks() {
    nodes.forEach(function (node) {
      node.sourceLinks = [];
      node.targetLinks = [];
    });
    links.forEach(function (link) {
      var source = link.source,
        target = link.target;
      if (typeof source === 'number') source = link.source = nodes[link.source];
      if (typeof target === 'number') target = link.target = nodes[link.target];
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });
  }

  // Iteratively assign the breadth (y-position) for each node.
  // Nodes are assigned the maximum breadth of incoming neighbors plus one;
  // nodes with no incoming links are assigned breadth zero, while
  // nodes with no outgoing links are assigned the maximum breadth.
  function computeNodeBreadths() {
    let remainingNodes = nodes;
    let nextNodes;

    while (remainingNodes.length) {
      nextNodes = [];
      remainingNodes.forEach(function (node) {
        node.y = (node.round - 1) * roundHeight;
        node.dy = nodeHeight;
        node.sourceLinks.forEach(function (link) {
          nextNodes.push(link.target);
        });
      });
      remainingNodes = nextNodes;
    }
  }

  function computeNodeDepths(iterations) {
    const nodesNest = nodes.reduce((o, n) => {
      const key = Math.floor(n.y);
      o[key] = [...(o[key] || []), n];
      return o;
    }, {});

    const nodesByBreadth = Object.values(nodesNest);
    initializeNodeDepth();

    function initializeNodeDepth() {
      var ky = d3.min(nodesByBreadth, function (nodes) {
        return (
          (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value)
        );
      });

      nodesByBreadth.forEach(function (nodes) {
        nodes.forEach(function (node, i) {
          node.x = i * nodeWidth + (i === 0 ? 0 : nodePadding);

          node.dx = nodeWidth;
        });
      });
    }
  }

  function computeLinkDepths() {
    nodes.forEach(function (node) {
      node.sourceLinks.sort(ascendingTargetDepth);
      node.targetLinks.sort(ascendingSourceDepth);
    });
    nodes.forEach(function (node) {
      let sx = 0;
      let tx = 0;

      let dxSource = nodeWidth / (node.sourceLinks.length + 1);
      let dxTarget = nodeWidth / (node.targetLinks.length + 1);

      node.sourceLinks.forEach(function (link) {
        sx += dxSource;
        link.sx = sx;
      });
      node.targetLinks.forEach(function (link) {
        tx += dxTarget;
        link.tx = tx;
      });
    });

    function ascendingSourceDepth(a, b) {
      return a.source.y - b.source.y;
    }

    function ascendingTargetDepth(a, b) {
      return a.target.y - b.target.y;
    }
  }

  function value(link) {
    return link.value;
  }

  return sankey;
};

export default Sankey;
