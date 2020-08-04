import React from 'react';

export default class ContactForm extends React.Component {
    
    constructor(props) {
        super(props);
        const items = [{name: 'juan', id: 1}, {name: 'rob', id: 2}];
        this.state = { items };
        this.removeItem = this.removeItem.bind(this);
      }
    
      removeItem(id) {
        // Write your code here
      }
    
      render() {
        return(     
          <ul>
            { this.state.items.map( item =>
                <li key={item.id}> {item.name} 
                    <button id="removeBtn"
                            onClick={() => this.removeItem(item.id)} 
                            type="button" >Remove</button>
                </li>
              )}
          </ul>
        )
      }
  }
