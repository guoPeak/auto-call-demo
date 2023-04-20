import SortableItem from './Item';
import React from 'react';

export default class SortableList extends React.Component<any, any> {
  state = {
    items: this.props.items,
  };

  onSortItems = (items: any) => {
    this.setState({
      items: items,
    });
  };

  render() {
    const { items } = this.state;
    console.log('items====', items);
    const listItems = items.map((item: any, i: number) => {
      return (
        <SortableItem key={i} onSortItems={this.onSortItems} items={items} sortId={i}>
          {item}
        </SortableItem>
      );
    });

    return <ul className="sortable-list">{listItems}</ul>;
  }
}
