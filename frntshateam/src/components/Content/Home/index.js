import React, {Component} from 'react';
import Page from '../../Page';
export default class extends Component {
  constructor(){
    super();
    this.state = {
      click : 0
    }

    this.onClickButton = this.onClickButton.bind(this);
  }
  onClickButton(e){
    this.setState({click:(this.state.click + 1)});
  }
  render(){
    return (
      <Page
        showHeader={true}
        showFooter={true}
        title={"ShaTeam"}
      >
        <h2></h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum illo accusamus, similique sequi saepe cum quas labore, fugit repellat assumenda delectus in suscipit harum quisquam accusantium impedit ipsa ut. Dignissimos.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum illo accusamus, similique sequi saepe cum quas labore, fugit repellat assumenda delectus in suscipit harum quisquam accusantium impedit ipsa ut. Dignissimos.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum illo accusamus, similique sequi saepe cum quas labore, fugit repellat assumenda delectus in suscipit harum quisquam accusantium impedit ipsa ut. Dignissimos.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum illo accusamus, similique sequi saepe cum quas labore, fugit repellat assumenda delectus in suscipit harum quisquam accusantium impedit ipsa ut. Dignissimos.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum illo accusamus, similique sequi saepe cum quas labore, fugit repellat assumenda delectus in suscipit harum quisquam accusantium impedit ipsa ut. Dignissimos.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum illo accusamus, similique sequi saepe cum quas labore, fugit repellat assumenda delectus in suscipit harum quisquam accusantium impedit ipsa ut. Dignissimos.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum illo accusamus, similique sequi saepe cum quas labore, fugit repellat assumenda delectus in suscipit harum quisquam accusantium impedit ipsa ut. Dignissimos.</p>
        <p>Clicks: {this.state.click}</p>
        <button onClick={this.onClickButton}>Sign In</button>
      </Page>
    )
  }
}
