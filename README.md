# Pan-n-Zoom

[![Greenkeeper badge](https://badges.greenkeeper.io/abhishekkhandait/pan-n-zoom.svg)](https://greenkeeper.io/) ![enter image description here](https://travis-ci.org/abhishekkhandait/pan-n-zoom.svg?branch=master) [![downloads badge](https://img.shields.io/npm/dt/pan-n-zoom.svg)]([https://www.npmjs.com/package/pan-n-zoom)

**A micro library to enable zoom and pan on any DOM or SVG element with mouse and touch events**

## Install
    npm install pan-n-zoom

## Usage

    import * as panzoom from 'pan-n-zoom';
	
	const element = document.querySelector('#elementid');
	panzoom.init(element);
