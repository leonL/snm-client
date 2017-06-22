import React, { Component } from 'react';
import ResourceProvider from './recommended_resources/ResourceProvider.js';

export default class RecommendedResources extends Component {

  render() {
    const p = this.props;
    return (
      <ul className='recommended-resources'>
        {p.resourcesByProvider.map((provider) => { 
          return <ResourceProvider key={provider.id} provider={provider} />
        })}
      </ul>
    )
  }
}