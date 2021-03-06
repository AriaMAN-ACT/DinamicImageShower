import React from 'react';
import unsplash from '../api/unsplash'
import SearchBar from './SearchBar';
import ImageList from './ImageList';
import Notice from './Notice';
import NoticeType from '../model/NoticeType';
import  '../style/style.css';

class App extends React.Component {
    isTimeToShowNotice= true;

    constructor(props){
        super();
        this.state = {searchValue: '', viewState: 'nothing to show', images: []};
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
    }

    async onSearchSubmit(searchValue) {
        this.setState({searchValue: searchValue});
        this.setState({viewState: 'loading'});
        const request = await unsplash.get('/search/photos', {
            params: {
                query: searchValue
            },
        });
        this.setState({viewState: 'ready' , images: request.data.results});
        if(request.data.results.length === 0) {
            this.setState({viewState: 'nothing to show'});
        }
    }

    showState(){
        if(this.state.viewState === 'loading') {
            return (
                    <div className="ui active dimmer">
                        <div className="ui text loader massive" style={{fontSize: '14px'}}>Loading</div>
                    </div>
          );
        } else if(this.state.viewState === 'nothing to show') {
            return (
                <div className="center">
                    <i style={{fontSize: '20px'}} className="close icon loading inverted blue-color"></i>
                    <i className="bottom right corner blue-color">nothing to show</i>
                </div>
            );
        } else {
            return <ImageList imageList={this.state.images}/>;
        }
    }

    notice() {
        if(this.isTimeToShowNotice) {
            this.isTimeToShowNotice = false;
            return <Notice message="api problem using iran ip" noticeType={NoticeType.YELLOW}/>
        }
    }

    render() {
        return (
            <div className="ui container" style={{marginTop: '10px'}} id="bg-black">
                {this.notice()}
                <SearchBar onSubmit={this.onSearchSubmit}/>
                {this.showState()}
            </div>
        );
    }
}


export default App;