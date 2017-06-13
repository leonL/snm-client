import React, { Component } from 'react';
import { fetchProviderResources, bookmarkResourceForNeed } from '../../store/actions.js';
import { connect } from 'react-redux';

// components
import Filters from './resource_search/Filters.js';
import LanguageServiceFilters from './resource_search/LanguageServiceFilters.js';
import Results from './resource_search/Results.js';
import { Well, FormGroup, InputGroup, FormControl, Glyphicon, Modal, ControlLabel } from 'react-bootstrap';

// stylesheets
import '../../stylesheets/ResourceSearch.css';
import '../../stylesheets/Filters.css';
import '../../stylesheets/Results.css';

class ResourceSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      need: props.need,
      type: props.need.type || ""
    } 

    this.typeChanged = this.typeChanged.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.saveNeed = this.saveNeed.bind(this);
    this.filtersComponent = this.filtersComponent.bind(this);
    this.bookmarkResource = this.bookmarkResource.bind(this);
  }

  render() {
    const p = this.props,
          FiltersComponent = this.filtersComponent(),
          typeSet = this.state.type !== '',
          needId = this.state.need.id,
          searchRequestObj = p.searchResultsById[needId];

    return (
      <Modal show={this.props.show} onHide={this.props.onHide} bsSize="large" aria-labelledby="contained-modal-title-lg">
      <Modal.Header closeButton>
        <FormGroup>
          <ControlLabel>Need Type:</ControlLabel>
          <InputGroup className='type-select'>
            <FormControl componentClass="select" onChange={this.typeChanged} value={this.state.type}>
              <option value=""></option>
              <option value="interpreter">Interpreter</option>
              <option value="translator">Translator</option>
              <option value="dentist">Dentist</option>
            </FormControl>
          </InputGroup>
        </FormGroup>
      </Modal.Header>
      <Modal.Body>
        <div className='resource-search'>
          <Well>
            <h4>Need Requirements:</h4>
            {typeSet &&
              <FiltersComponent resourceType={this.state.type} 
                requirements={this.props.need.requirements} 
                fetchData={this.fetchData} saveNeed={this.saveNeed} />
            }
          </Well>
          {searchRequestObj && 
            <Results searchResponse={searchRequestObj} bookmarkResource={this.bookmarkResource} />}
        </div>
      </Modal.Body>
      </Modal>
    )
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.need.id !== nextProps.need.id) {
      this.setState({
        need: nextProps.need,
        type: nextProps.need.type || ""
      })
    }
  }

  typeChanged(event) {
    this.setState({type: event.target.value}, () => {
      this.fetchData({});
      this.saveNeed({});
    });
  }

  fetchData(detailsParams) {
    const
    s = this.state,
    p = this.props,
    params = {
      resource_type: s.type,
      details: detailsParams
    }

    p.dispatch(fetchProviderResources(s.need.id, params));
  }

  saveNeed(requirementsParams) {
    const
    s = this.state,
    p = this.props,
    params = {
      need_type: s.type,
      requirements: requirementsParams
    };
    p.updateNeed(params, p.need.id);
  }

  // removeNeed() {
  //   const p = this.props;
  //   p.removeNeed(p.need.id);
  // }

  filtersComponent() {
    let Component;
    switch (this.state.type) {
      case 'interpreter':
      case 'translator':
        Component = LanguageServiceFilters;
        break;
      default:
        Component = Filters;
    }
    return Component;
  }

  bookmarkResource(resourceId, fulfilled) {
    const 
    s = this.state,
    p = this.props;
    p.dispatch(bookmarkResourceForNeed(resourceId, s.need.id, fulfilled));
  }
}

const mapStateToProps = (state) => {
  return {
    searchResultsById: state.searchResultsByNeedId
  }
}

export default connect(
  mapStateToProps
)(ResourceSearch);