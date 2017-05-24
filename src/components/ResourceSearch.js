import React, { Component } from 'react';
import { fetchResources } from '../store/actions.js'
import { connect } from 'react-redux'

// components
import Filters from './resource_search/Filters.js'
import LanguageServiceFilters from './resource_search/LanguageServiceFilters.js'
import ResourceListItem from './ResourceListItem.js'
import { Well, FormGroup, InputGroup, FormControl} from 'react-bootstrap';

// stylesheets
import '../stylesheets/ResourceSearch.css';
import '../stylesheets/Filters.css';

class ResourceSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {type: ''};

    this.fetchData = this.fetchData.bind(this);
    this.typeChanged = this.typeChanged.bind(this);
    this.filtersComponent = this.filtersComponent.bind(this);
  }

  render() {
    const loaded = this.props.resourcesLoaded;
    const FiltersComponent = this.filtersComponent();
    return (
      <div className='resource-search'>
        <Well>
          <FormGroup>
            <InputGroup className='type-select'>
              <FormControl componentClass="select" onChange={this.typeChanged} value={this.state.type}>
                <option value=""></option>
                <option value="interpreter">Interpreter</option>
                <option value="translator">Translator</option>
                <option value="dentist">Dentist</option>
              </FormControl>
            </InputGroup>
          </FormGroup>
          <div className='filters'>
            {this.state.type !== '' &&
              <FiltersComponent fetchData={this.fetchData} />
            }
          </div>
        </Well>
        <ul className='results'>
          {loaded ? this.renderIndex() : 'Wait...'}
        </ul>
      </div>
    );
  }

  filtersComponent() {
    switch (this.state.type) {
      case 'interpreter':
      case 'translator':
        return LanguageServiceFilters;
      default:
        return Filters;
    }
  }

  fetchData(detailsParams) {
    const params = {
      type: this.state.type,
      details: detailsParams
    }
    this.props.dispatch(fetchResources(params));
  }

  typeChanged(event) {
    this.setState({type: event.target.value}, () => {this.fetchData({})});
  }

  renderIndex() {
    return(
      this.props.resources.map((resource) =>
        <ResourceListItem key={resource.id} vals={resource} />
      )
    )
  }
}

const mapStateToProps = (state) => {
  return {
    resources: state.resources.index,
    resourcesLoaded: state.resources.loaded
  }
}

export default connect(
  mapStateToProps
)(ResourceSearch);