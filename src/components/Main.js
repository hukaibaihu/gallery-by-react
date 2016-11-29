require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

let imgDatas = require('../stores/imgDatas.json');

imgDatas = (function(list){
	for(let i = 0, len = list.length; i < len; i++) {
		let item = list[i];
		item.imgUrl = require('../images/' + item.fileName);
		list[i] = item;
	}
	return list;
})(imgDatas);

function getRangeRandom(low, high) {
	return Math.ceil(Math.random() * (high - low) + low);
}

function  getDegRandom(deg) {
	if(deg == undefined) deg = 30;
	return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * deg);
}

class ImgFigure extends React.Component {
	clickHandle(e){
		e.preventDefault();
		e.stopPropagation();
		if(this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
	}
	render() {
		let styl = {};

		if(this.props.arrange.pos) {
			styl = this.props.arrange.pos;
		}

		if(this.props.arrange.rotate) {
			[
				'WebkitTransform',
				'MozTransform',
				'msTransform',
				'OTransform',
				'transform'
			].forEach(key => styl[key] = `rotate(${this.props.arrange.rotate}deg)`);
		}

		if(this.props.arrange.isCenter) {
			styl.zIndex = 11;
		}
		
		let cls = 'img-figure';
		if(this.props.arrange.isInverse) {
			cls += ' inversed';
		}

		return (
			<div className={cls} style={styl}>
				<figure className="img-front" onClick={this.clickHandle.bind(this)}>
					<img src={this.props.data.imgUrl} alt={this.props.data.title} />
					<figcaption>
						<h2 className="img-title">{this.props.data.title}</h2>
					</figcaption>
				</figure>
				<div className="img-back" onClick={this.clickHandle.bind(this)}>
					<p>{this.props.data.desc}</p>
				</div>
			</div>
		);
	}
}

class Controller extends React.Component {
	clickHandle(e){
		e.preventDefault();
		e.stopPropagation();
		if(this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
	}
	render() {
		let cls = 'control-item';

		if(this.props.arrange.isCenter) {
			cls += ' center';
			if(this.props.arrange.isInverse) {
				cls += ' inversed';
			}
		}

		return (
			<span className={cls} onClick={this.clickHandle.bind(this)}></span>
		);
	}
}

class AppComponent extends React.Component {
	constructor(){
		super();
		this.state = {
			imgArrangeArr: []
		};
		this.Constant = {
			centerPos: {
				left: 0,
				top: 0
			},
			hRange: {
				leftX: [0, 0],
				rightX: [0, 0],
				y: [0, 0]
			},
			vRange: {
				y: [0, 0],
				x: [0, 0]
			}
		};
	}
	rearrange(index){
		let imgArrangeArr = this.state.imgArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hRange = Constant.hRange,
			vRange = Constant.vRange,
			hRangeLeftX = hRange.leftX,
			hRangeRightX = hRange.rightX,
			hRangeY = hRange.y,
			vRangeY = vRange.y,
			vRangeX = vRange.x,

			imgTopList = [],
			topSize = Math.floor(Math.random() * 2),
			topIndex = 0,

			imgCenterList = imgArrangeArr.splice(index, 1);

		imgCenterList[0] = {
			pos: centerPos,
			rotate: 0,
			isCenter: true
		};

		topIndex = Math.ceil(Math.random() * (imgArrangeArr.length - topSize));
		imgTopList = imgArrangeArr.splice(topIndex, topSize);

		imgTopList.forEach((item, i) => {
			imgTopList[i] = {
				pos: {
					top: getRangeRandom(vRangeY[0], vRangeY[1]),
					left: getRangeRandom(vRangeX[0], vRangeX[1])
				},
				rotate: getDegRandom(),
				isCenter: false
			};
		});

		for(let i = 0, len = imgArrangeArr.length, j = len / 2; i < len; i++) {
			let hRangeLORX = i < j ? hRangeLeftX : hRangeRightX;
			imgArrangeArr[i] = {
				pos: {
					top: getRangeRandom(hRangeY[0], hRangeY[1]),
					left: getRangeRandom(hRangeLORX[0], hRangeLORX[1])
				},
				rotate: getDegRandom(),
				isCenter: false
			};
		}

		if(imgTopList && imgTopList[0]) {
			imgArrangeArr.splice(topIndex, 0, imgTopList[0]);
		}

		imgArrangeArr.splice(index, 0, imgCenterList[0]);

		this.setState({
			imgArrangeArr: imgArrangeArr
		});
	}
	inverse(index){
		return () => {
			let list = this.state.imgArrangeArr;
			list[index].isInverse = !list[index].isInverse;
			this.setState({
				imgArrangeArr: list
			});
		}
	}
	setCenter(index){
		return () => {
			this.rearrange(index)
		}
	}
	componentDidMount(){
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = parseInt(stageW / 2),
			halfStageH = parseInt(stageH / 2);

		let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = parseInt(imgW / 2),
			halfImgH = parseInt(imgH / 2);

		this.Constant.centerPos = {
			top: halfStageH - halfImgH,
			left: halfStageW - halfImgW
		};

		this.Constant.hRange.leftX[0] = -halfImgW;
		this.Constant.hRange.leftX[1] = halfStageW - halfImgW * 3;
		this.Constant.hRange.rightX[0] = halfStageW + halfImgW;
		this.Constant.hRange.rightX[1] = stageW - halfImgW;
		this.Constant.hRange.y[0] = -halfImgH;
		this.Constant.hRange.y[1] = stageH - halfImgH;

		this.Constant.vRange.y[0] = -halfImgH;
		this.Constant.vRange.y[1] = halfStageH - halfImgH * 3;
		this.Constant.vRange.x[0] = halfStageW - imgW;
		this.Constant.vRange.x[1] = halfStageW;

		this.rearrange(0);
	}
  render() {

  	let ctrlUnits = [];

  	let imgFigures = imgDatas.map((item, i) => {
  		if(!this.state.imgArrangeArr[i]) {
  			this.state.imgArrangeArr[i] = {
  				pos: {
  					top: 0,
  					left: 0
  				},
  				rotate: 0,
  				isInverse: false,
  				isCenter: false
  			};
  		}

  		ctrlUnits.push(
  			<Controller key={'control-' + i}
  				arrange={this.state.imgArrangeArr[i]}
  				inverse={this.inverse(i)}
  				center={this.setCenter(i)}/>
  		);

  		return <ImgFigure key={'imgFigure-' + i}
  						  data={item} ref={'imgFigure' + i}
  						  arrange={this.state.imgArrangeArr[i]}
  						  inverse={this.inverse(i)}
  						  center={this.setCenter(i)}/>
  	});

    return (
    	<section className="stage" ref="stage">
    		<section className="img-sec">
    			{imgFigures}
    		</section>
    		<nav className="ctrl-nav">
    			{ctrlUnits}
    		</nav>
    	</section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
