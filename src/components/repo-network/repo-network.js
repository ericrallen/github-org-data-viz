import React, { Component } from 'react';
import { Graph } from '@vx/network';
import { RadialGradient } from '@vx/gradient';
import random from 'lodash.random';
import clamp from 'lodash.clamp';
import inRange from 'lodash.inrange';

import Node from './node';

const PADDING = 30;

export default class RepoNetwork extends Component {
  state = {
    selectedNode: null,
    graph: {
      nodes: [],
      links: [],
    },
    repos: {},
    parentGraph: {},
  };

  constructor(props) {
    super(props);

    this.selectNode = this.selectNode.bind(this);
  }

  componentDidMount() {
    const repos = this.generateRepoMap();
    const graph = this.generateGraph(repos);

    this.setState({
      repos,
      graph,
    });
  }

  selectNode(e) {
    const { target } = e;
    const { selectedNode, graph, parentGraph } = this.state;

    const repo = target.id.replace('node-', '');

    if (repo !== selectedNode) {
      const newParentGraph = Object.assign({}, graph);

      this.setState({
        selectedNode: repo,
        graph: this.getChildNodes(repo),
        parentGraph: newParentGraph,
      });
    } else {
      // TODO: make this work correctly
      this.setState({
        selectedNode: null,
        graph: parentGraph,
      });
    }
  }

  checkNodesForOverlap = (nodes, x, y, radius) => nodes.some((node) => {
    const { width, height } = this.props;

    const buffer = radius * 2.5;

    const { x: nodeX, y: nodeY, radius: nodeRadius } = node;

    const xMin = clamp(nodeX - nodeRadius - buffer, PADDING, width - PADDING);
    const xMax = clamp(nodeX + nodeRadius + buffer, PADDING, width - PADDING);

    const yMin = clamp(nodeY - nodeRadius - buffer, PADDING, height - PADDING);
    const yMax = clamp(nodeY + nodeRadius + buffer, PADDING, height - PADDING);

    const overlappingX = inRange(x, xMin, xMax);
    const overlappingY = inRange(y, yMin, yMax);

    if (overlappingX && overlappingY) {
      return true;
    }

    return false;
  });

  getChildNodes(selectedNode) {
    const { width, height } = this.props;

    const { repos, graph } = this.state;

    const newGraph = Object.assign({}, graph);

    if (selectedNode) {
      repos[selectedNode].forEach((repo) => {
        const parent = graph.nodes.find((item) => item.label === selectedNode);
        const childRadius = 7;

        const xMin = parent.x - parent.radius - childRadius - 20;
        const xMax = parent.x + parent.radius + childRadius + 20;
        const yMin = parent.y - parent.radius - childRadius - 20;
        const yMax = parent.y + parent.radius + childRadius + 20;

        let childX = clamp(random(xMin, xMax), PADDING, width - PADDING);
        let childY = clamp(random(yMin, yMax), PADDING, height - PADDING);

        let childOverlap = this.checkNodesForOverlap(graph.nodes, childX, childY, childRadius);

        while(childOverlap) {
          childX = clamp(random(xMin, xMax), PADDING, width - PADDING);
          childY = clamp(random(yMin, yMax), PADDING, height - PADDING);

          childOverlap = this.checkNodesForOverlap(graph.nodes, childX, childY, childRadius);
        }

        const childNode = {
          x: childX,
          y: childY,
          label: repo,
          fill: "#f16521",
          radius: childRadius,
          fontSize: 9,
          opacity: parent.opacity,
        };

        newGraph.nodes.push(childNode);

        newGraph.links.push({
          source: parent,
          target: childNode,
        });
      });
    }

    return newGraph;
  }

  generateRepoMap() {
    const { data } = this.props;

    const members = data.organization.membersWithRole.nodes;

    return members.reduce((repoObject, member) => {
      const {
        commitContributionsByRepository = [],
        pullRequestContributionsByRepository =[],
        issueContributionsByRepository = [],
        pullRequestReviewContributionsByRepository = [],
      } = member.contributionsCollection;

      commitContributionsByRepository.forEach(({ repository }) => {
        const owner = repository.owner.login;

        if (!repoObject[owner]) {
          repoObject[owner] = [];
        }

        if (repoObject[owner].indexOf(repository.nameWithOwner) === -1) {
          repoObject[owner].push(repository.nameWithOwner);
        }
      });

      pullRequestContributionsByRepository.forEach(({ repository }) => {
        const owner = repository.owner.login;

        if (!repoObject[owner]) {
          repoObject[owner] = [];
        }

        if (repoObject[owner].indexOf(repository.nameWithOwner) === -1) {
          repoObject[owner].push(repository.nameWithOwner);
        }
      });

      issueContributionsByRepository.forEach(({ repository }) => {
        const owner = repository.owner.login;

        if (!repoObject[owner]) {
          repoObject[owner] = [];
        }

        if (repoObject[owner].indexOf(repository.nameWithOwner) === -1) {
          repoObject[owner].push(repository.nameWithOwner);
        }
      });

      pullRequestReviewContributionsByRepository.forEach(({ repository }) => {
        const owner = repository.owner.login;

        if (!repoObject[owner]) {
          repoObject[owner] = [];
        }

        if (repoObject[owner].indexOf(repository.nameWithOwner) === -1) {
          repoObject[owner].push(repository.nameWithOwner);
        }
      });

      return repoObject;
    }, {});
  }

  generateGraph(repos) {
    const { width, height } = this.props;

    return Object.keys(repos).reduce((graphObject, owner) => {
      const radius = 10 * repos[owner].length / 2;
      const opacity = clamp(0.3 + repos[owner].length * 0.1, 0.3, 0.9);

      let x = random(PADDING + radius, width - PADDING - radius);
      let y = random(PADDING + radius, height - PADDING - radius);

      let overlap = this.checkNodesForOverlap(graphObject.nodes, x, y, radius);

      if (graphObject.nodes.length > 1 ) {
        while(overlap) {
          x = random(PADDING + radius, width - PADDING - radius);
          y = random(PADDING + radius, height - PADDING - radius);

          overlap = this.checkNodesForOverlap(graphObject.nodes, x, y, radius);
        }
      }

      const parentNode = {
        x,
        y,
        radius,
        opacity,
        fill: "#f16521",
        label: owner,
        fontSize: 12,
        onClick: this.selectNode
      };

      graphObject.nodes.push(parentNode);

      return graphObject;
    }, {
      nodes: [],
      links: []
    });
  }

  render () {
    const { width, height } = this.props;

    const { graph } = this.state;

    return (
      <article>
        <header>
          <h3>Where have we been contributing?</h3>
          <p>What public repos and orgranizations are we contributing to?</p>
        </header>
        <svg width={width} height={height}>
          <rect rx={14} width={width} height={height} fill="url('#network-gradients')" />
          <RadialGradient id="network-gradients" r="80%" from="#55bdd5" to="#4f3681" /*from="#0e99dd" to="#053349"*/ />
          <Graph graph={graph} nodeComponent={Node} />
        </svg>
      </article>
    );
  }
}
