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
    nodes: [],
    links: [],
    repos: this.generateRepoMap()
  };

  constructor(props) {
    super(props);

    this.selectNode = this.selectNode.bind(this);
  }

  componentDidMount() {
    const { repos } = this.state;

    const { nodes, links } = this.generateGraph(repos);

    this.setState({
      nodes,
      links,
    });
  }

  selectNode(e) {
    const { target } = e;
    const { selectedNode, nodes } = this.state;

    const repo = target.id.replace('node-', '');

    const { nodes: childNodes } = this.getChildNodes(selectedNode);

    const childRepos = childNodes.map(node => node.label);

    let updatedNodes = nodes.filter(node => !childRepos.includes(node.label));

    let updatedLinks = [];

    let updatedNode = null;

    if (repo !== selectedNode) {
      const { nodes: childNodes, links: childLinks } = this.getChildNodes(repo);

      updatedNode = repo;

      updatedNodes = [...updatedNodes, ...childNodes];
      updatedLinks = [...updatedLinks, ...childLinks];
    }

    this.setState({
      selectedNode: updatedNode,
      nodes: updatedNodes,
      links: updatedLinks,
    });
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

    const { nodes, repos } = this.state;

    const childNodes = [];
    const childLinks = [];

    if (selectedNode) {
      repos[selectedNode].forEach((repo) => {
        const parent = nodes.find((item) => item.label === selectedNode);
        const childRadius = 7;

        const xMin = parent.x - parent.radius - childRadius - 50;
        const xMax = parent.x + parent.radius + childRadius + 50;
        const yMin = parent.y - parent.radius - childRadius - 50;
        const yMax = parent.y + parent.radius + childRadius + 50;

        let childX = clamp(random(xMin, xMax), PADDING, width - PADDING);
        let childY = clamp(random(yMin, yMax), PADDING, height - PADDING);

        let childOverlap = this.checkNodesForOverlap(nodes, childX, childY, childRadius);

        while(childOverlap) {
          childX = clamp(random(xMin, xMax), PADDING, width - PADDING);
          childY = clamp(random(yMin, yMax), PADDING, height - PADDING);

          childOverlap = this.checkNodesForOverlap(nodes, childX, childY, childRadius);
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

        childNodes.push(childNode);

        childLinks.push({
          source: parent,
          target: childNode,
        });
      });
    }

    return {
      nodes: childNodes,
      links: childLinks,
    };
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
      const radius = clamp(9 * repos[owner].length / 2, 10, 75);
      const opacity = clamp(0.3 + repos[owner].length * 0.125, 0.3, 1.0);

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

    const { nodes, links } = this.state;

    const graph = {
      nodes,
      links,
    };

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
