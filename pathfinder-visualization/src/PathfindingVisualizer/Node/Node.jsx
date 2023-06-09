import React, { Component } from 'react';
import { BsArrowsFullscreen } from 'react-icons/bs';
import { GiFinishLine } from 'react-icons/gi';
import './Node.css';


export default class Node extends Component {
    render() {
      const {
        col,
        isFinish,
        isStart,
        isWall,
        onMouseDown,
        onMouseEnter,
        onMouseUp,
        row,
      } = this.props;

      const renderIcon = () => {
        if (isStart) {
          return <BsArrowsFullscreen className='start-icon'/>;
        } else if (isFinish) {
          return <GiFinishLine className='finish-icon'/>;
        } else {
          return null;
        }
      }

      const extraClassName = isFinish
        ? 'node node-finish'
        : isStart
        ? 'node node-start'
        : isWall
        ? 'node node-wall'
        : 'node';

  
      return (
        <div
          id={`node-${row}-${col}`}
          className={extraClassName}
          onMouseDown={() => onMouseDown(row, col)}
          onMouseEnter={() => onMouseEnter(row, col)}
          onMouseUp={() => onMouseUp()}> 
          {renderIcon()}
        </div>
      );
    }
  }