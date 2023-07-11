import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';

 
export default class Gantt extends Component {
    componentDidMount() {
        console.log('window.innerHeight Hiiiiii:::', window.innerHeight);
        gantt.config.date_format = "%Y-%m-%d %H:%i";  
        const { tasks } = this.props;
        gantt.init(this.ganttContainer);
        gantt.parse(tasks);
    }

    render() {
       return (
           <div
                ref={ (input) => { this.ganttContainer = input } }
                style={ { width: '100%', height: '100%' } }
            ></div>
       );
    }
}
