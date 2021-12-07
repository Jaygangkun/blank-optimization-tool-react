import React from 'react'
import HtmlToReact from 'html-to-react';
import {
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';

const HtmlToReactParser = new HtmlToReact.Parser();

let svgTagAttr = {};
let svgUpload = null;
let svgDraw = null;
let stageWrapContent = null;

let dragImg = null;

let svgRectViewInitial = null;
let svgRectViewDragStart = null;
let dragStartPoint = null;

const isValidNode = function () {
    return true;
};

const preprocessingInstructions = [
    {
        shouldPreprocessNode: function (node) {
            return node.attribs && node.attribs['data-process'] === 'shared';
        },
        preprocessNode: function (node) {
            node.attribs = {id: `preprocessed-${node.attribs.id}`,};
        },
    }
];

const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
const processingInstructions = [
    // {
    //     shouldProcessNode: function (node) {
    //         return node.attribs && node.attribs.id === 'preprocessed-first';
    //     },
    //     processNode: function(node, children, index) {
    //         return React.createElement('h1', {key: index, id: node.attribs.id,}, 'First');
    //     },
    // },
    {
        shouldProcessNode: function (node) {
            return node.tagName === 'svg';
        },
        processNode: function (node, children, index) {
            svgTagAttr = node.attribs;

            node.attribs.className = 'svgUpload';
            node.attribs.id = 'svgUpload';            
            return processNodeDefinitions.processDefaultNode(node, children, index);
        },
    },
    {
        shouldProcessNode: function (node) {
            return true;
        },
        processNode: processNodeDefinitions.processDefaultNode,
    },
];

function UploadSvg(svgText) {
    React.useEffect(() => {
        if(svgUpload == null) {
            svgUpload = document.getElementById('svgUpload');
        }

        if(svgDraw == null) {
            svgDraw = document.getElementById('svgDraw');
        }   

        if(stageWrapContent == null) {
            stageWrapContent = document.getElementById('stageWrapContent');
        }

        if(dragImg == null) {
            dragImg = document.createElement("img");
        }

        if(svgRectViewInitial == null && svgUpload != null) {
            const svgRectViewBox = svgUpload.getAttribute('viewBox').split(' ');
        
            svgRectViewInitial = {
                x: svgRectViewBox[0],
                y: svgRectViewBox[1],
                width: svgRectViewBox[2],
                height: svgRectViewBox[3],
            }
        }
    });
    return (
        <div className="UploadSvg">
            { HtmlToReactParser.parseWithInstructions(svgText, isValidNode, processingInstructions, preprocessingInstructions) }
        </div>
    )
}

function DrawSvg(constraints, constraintPoints, eventPoints) {
    return (
        <div className="DrawSvg">
            <svg xmlns={svgTagAttr.xmlns} viewBox={svgTagAttr.viewbox} id="svgDraw">
                {
                    constraints?.map((constraint, index) => {
                        return (
                            <polygon key={index} className="polyline polyline_{index}" opacity="0.3" fill="blue" points={constraint?.points?.toString()}></polygon>
                        )
                    })
                }
                <polygon className="polyline polyline_{index}" opacity="0.3" fill="blue" points={constraintPoints?.toString()}></polygon>
            </svg>
            <div className="DrawSvgPoints">
            {
                eventPoints?.map((point, index) => {
                    return (
                        <span key={index} className="DrawSvgPoint" style={{left: point.x, top: point.y}}/>
                    )
                })
            }
            </div>
        </div>
    )
}

function WorkToolBarButton(props) {
    const className = props.active ? "btn btn-sm btn-active mx-1 rounded" : (props.enable ? "btn btn-sm btn-enable mx-1 rounded" : "btn btn-sm btn-secondary mx-1 rounded disabled");
    return (
        <span className={className} onClick={props.onClick}>
            {props.children}
        </span>
    )
}

const zoom = (direction) => {

    if(svgUpload == null) {
        return;
    }

    if(svgDraw == null) {
        return;
    }

    if(direction === 'out') {
        svgUpload.setAttribute(
            'viewBox',
            svgUpload.getAttribute('viewBox').split(' ')[0] + ' ' + 
            svgUpload.getAttribute('viewBox').split(' ')[1] + ' ' + 
            (Number(svgUpload.getAttribute('viewBox').split(' ')[2]) + Number(svgUpload.getAttribute('viewBox').split(' ')[2]*0.1)) + ' ' + 
            (Number(svgUpload.getAttribute('viewBox').split(' ')[3]) + Number(svgUpload.getAttribute('viewBox').split(' ')[3]*0.1))
        );

        svgDraw.setAttribute(
            'viewBox',
            svgDraw.getAttribute('viewBox').split(' ')[0] + ' ' + 
            svgDraw.getAttribute('viewBox').split(' ')[1] + ' ' + 
            (Number(svgDraw.getAttribute('viewBox').split(' ')[2]) + Number(svgDraw.getAttribute('viewBox').split(' ')[2]*0.1)) + ' ' + 
            (Number(svgDraw.getAttribute('viewBox').split(' ')[3]) + Number(svgDraw.getAttribute('viewBox').split(' ')[3]*0.1))
        );
    }
    else if (direction === "in")
    {
        svgUpload.setAttribute(
            'viewBox',
            svgUpload.getAttribute('viewBox').split(' ')[0] + ' ' + 
            svgUpload.getAttribute('viewBox').split(' ')[1] + ' ' + 
            (Number(svgUpload.getAttribute('viewBox').split(' ')[2]) - Number(svgUpload.getAttribute('viewBox').split(' ')[2]*0.1)) + ' ' + 
            (Number(svgUpload.getAttribute('viewBox').split(' ')[3]) - Number(svgUpload.getAttribute('viewBox').split(' ')[3]*0.1))
        );

        svgDraw.setAttribute(
            'viewBox',
            svgDraw.getAttribute('viewBox').split(' ')[0] + ' ' + 
            svgDraw.getAttribute('viewBox').split(' ')[1] + ' ' + 
            (Number(svgDraw.getAttribute('viewBox').split(' ')[2]) - Number(svgDraw.getAttribute('viewBox').split(' ')[2]*0.1)) + ' ' + 
            (Number(svgDraw.getAttribute('viewBox').split(' ')[3]) - Number(svgDraw.getAttribute('viewBox').split(' ')[3]*0.1))
        );
    }
}

const panMove = (offset) => {
    if(svgUpload == null) {
        return;
    }

    if(svgDraw == null) {
        return;
    }

    // convert view offset to svg offset
    const svgDomRect = svgUpload.getBoundingClientRect();
    const viewBoxOffset = {
        x: offset.x * svgRectViewDragStart.width / svgDomRect.width,
        y: offset.y * svgRectViewDragStart.height / svgDomRect.height
    }
    
    svgUpload.setAttribute(
        'viewBox',
        (parseInt(svgRectViewDragStart.x) + parseInt(viewBoxOffset.x)) + ' ' + 
        (parseInt(svgRectViewDragStart.y) + parseInt(viewBoxOffset.y)) + ' ' + 
        svgRectViewDragStart.width + ' ' + 
        svgRectViewDragStart.height
    );

    svgDraw.setAttribute(
        'viewBox',
        (parseInt(svgRectViewDragStart.x) + parseInt(viewBoxOffset.x)) + ' ' + 
        (parseInt(svgRectViewDragStart.y) + parseInt(viewBoxOffset.y)) + ' ' + 
        svgRectViewDragStart.width + ' ' + 
        svgRectViewDragStart.height
    );
}

function WorkStage() {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('accept', '.svg');
    // const [svgElement, setSvgElement] = React.useState('');
    const [ svgFile, setSvgFile ] = React.useState('');
    const readFile = function(evt) {
        var reader  = new FileReader();
        reader.readAsText(fileSelector.files[0]);
        reader.onloadend = function () {
            setSvgFile(reader.result);
            setBtnEditEnable(true);
            setBtnZoomInEnable(true);
            setBtnZoomOutEnable(true);
            setBtnHandEnable(true);
            setBtnResetEnable(true);
        }
    }

    fileSelector.addEventListener('change', readFile, false);
    const openFile = function() {
        fileSelector.click();
    }

    const [isEdit, setIsEdit] = React.useState(false);

    const [constraints, setContraints] = React.useState([]);
    const [constraintPoints, setConstraintPoints] = React.useState([]);
    const [eventPoints, setEventPoints] = React.useState([]);
    
    const stageClick = function(event) {
        if(svgUpload == null || svgDraw == null) {
            return;
        }

        if(typeof svgUpload == 'undefined') {
            alert('No SVG Uploaded!');
            return;
        }

        if(btnHandActive) {
            return;
        }

        if(!isEdit) {
            alert('Please Click Constraint Icon');
            return;
        }

        if(typeof svgUpload.firstElementChild.tagName == 'g') {

        }
        else {
            const pt = svgUpload.createSVGPoint();    
                
            // pass event coordinates
            pt.x = event.clientX;
            pt.y = event.clientY;
        
            // transform to SVG coordinates
            const svgP = pt.matrixTransform(svgUpload.getScreenCTM().inverse());

            setConstraintPoints([...constraintPoints, [svgP.x, svgP.y]]);

            setEventPoints([...eventPoints, {x: event.clientX - stageWrapContent.getBoundingClientRect().left, y: event.clientY - stageWrapContent.getBoundingClientRect().top}]);
        }
    }

    
    // drag functions
    const stageDragStart = function(event) {

        if(!btnHandActive) {
            return;
        }

        event.dataTransfer.setDragImage(dragImg, 0, 0);

        const svgRectViewBox = svgUpload.getAttribute('viewBox').split(' ');
        
        svgRectViewDragStart = {
            x: svgRectViewBox[0],
            y: svgRectViewBox[1],
            width: svgRectViewBox[2],
            height: svgRectViewBox[3],
        }

        dragStartPoint = {
            x: event.clientX,
            y: event.clientY
        };
    }

    const stageDragEnd = function(event) {
        if(!btnHandActive) {
            return;
        }

        svgRectViewDragStart = null;
        dragStartPoint = null;
    }

    const stageDrag = function(event) {
        
        if(!btnHandActive) {
            return;
        }

        if(event.clientX != 0 && event.clientY != 0) {
            panMove({
                x: dragStartPoint.x - event.clientX,
                y: dragStartPoint.y - event.clientY
            })
        }
    }

    // toolbar button status

    const [btnEditEnable, setBtnEditEnable] = React.useState(false);
    const [btnZoomInEnable, setBtnZoomInEnable] = React.useState(false);
    const [btnZoomOutEnable, setBtnZoomOutEnable] = React.useState(false);
    const [btnHandEnable, setBtnHandEnable] = React.useState(false);
    const [btnResetEnable, setBtnResetEnable] = React.useState(false);

    const [btnEditActive, setBtnEditActive] = React.useState(false);
    const [btnHandActive, setBtnHandActive] = React.useState(false);

    const cbOpenBtnClick = function() {
        openFile()
    }

    const cbEditBtnClick = function() {
        if(isEdit) {
            setContraints([...constraints, {points: constraintPoints}])
            setConstraintPoints([]);
            setEventPoints([]);

            setBtnZoomInEnable(true);
            setBtnZoomOutEnable(true);
            setBtnHandEnable(true);

            setBtnEditActive(false);
        }
        else {
            setBtnZoomInEnable(false);
            setBtnZoomOutEnable(false);
            setBtnHandEnable(false);

            setBtnEditActive(true);
        }

        setIsEdit(!isEdit);

        setBtnHandActive(false);
    }

    const cbZoomInBtnClick = function() {
        zoom('in')

        setBtnEditActive(false);
        setBtnHandActive(false);
    }

    const cbZoomOutBtnClick = function() {
        zoom('out')

        setBtnEditActive(false);
        setBtnHandActive(false);
    }

    const cbHandBtnClick = function() {
        
        setBtnEditActive(false);
        setBtnHandActive(true);
    }

    const cbResetBtnClick = function() {

        if(svgUpload == null) {
            return;
        }
    
        if(svgDraw == null) {
            return;
        }
    
        svgUpload.setAttribute(
            'viewBox',
            parseInt(svgRectViewInitial.x) + ' ' + 
            parseInt(svgRectViewInitial.y) + ' ' + 
            svgRectViewInitial.width + ' ' + 
            svgRectViewInitial.height
        );
    
        svgDraw.setAttribute(
            'viewBox',
            parseInt(svgRectViewInitial.x) + ' ' + 
            parseInt(svgRectViewInitial.y) + ' ' + 
            svgRectViewInitial.width + ' ' + 
            svgRectViewInitial.height
        );

        setBtnEditActive(false);
        setBtnHandActive(false);
    }
    

    const [optimizeParamDlgVisible, setOptimizeParamDlgVisible] = React.useState(false);

    return (
        <Row>
            <Col sm="12" md="6" lg="6">
                <Card>
                    <CardTitle className="border-bottom p-3 mb-0">
                        <div className="d-flex align-items-center justify-content-between">
                            <span>Canvas</span>
                            <div className="">
                                <WorkToolBarButton enable={true} onClick={() => cbOpenBtnClick()}><i className="fas fa-folder-open"></i></WorkToolBarButton>
                                <WorkToolBarButton enable={btnEditEnable} active={btnEditActive} onClick={() => cbEditBtnClick()}><i className={isEdit ? "fas fa-check" : "fas fa-cog"}></i></WorkToolBarButton>
                                <WorkToolBarButton enable={btnZoomInEnable} onClick={() => cbZoomInBtnClick()}><i className="fas fa-search-plus"></i></WorkToolBarButton>
                                <WorkToolBarButton enable={btnZoomOutEnable} onClick={() => cbZoomOutBtnClick()}><i className="fas fa-search-minus"></i></WorkToolBarButton>
                                <WorkToolBarButton enable={btnHandEnable} active={btnHandActive} onClick={() => cbHandBtnClick()}><i className="fas fa-hand-paper"></i></WorkToolBarButton>
                                <WorkToolBarButton enable={btnResetEnable} onClick={() => cbResetBtnClick()}><i className="fas fa-undo"></i></WorkToolBarButton>
                            </div>
                            <Nav className="">
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle
                                        nav
                                        className="pro-pic d-flex align-items-center"
                                    >
                                        <i className="icon-options-vertical"></i>
                                    </DropdownToggle>
                                    <DropdownMenu right className="user-dd">
                                        <DropdownItem>
                                            Optimize
                                        </DropdownItem>
                                        <DropdownItem>
                                        Clear
                                        </DropdownItem>


                                        <DropdownItem>
                                            Download
                                        </DropdownItem>
                                        <DropdownItem>
                                            Download JPEG
                                        </DropdownItem>
                                        <DropdownItem>
                                            Print
                                        </DropdownItem>
                                        <DropdownItem>
                                            Show Optimized Blank
                                        </DropdownItem>
                                        <DropdownItem>
                                            Show All
                                        </DropdownItem>


                                        <DropdownItem>
                                            Hide Constraints
                                        </DropdownItem>
                                        <DropdownItem>
                                            Show Constraints
                                        </DropdownItem>
                                        <DropdownItem>
                                            Remove Constraints
                                        </DropdownItem>
                                        <DropdownItem>
                                            Copy Constraints
                                        </DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Nav>
                            
                        </div>
                    </CardTitle>
                    <CardBody>
                        <div className="stageContainer">
                            <div className="stageWrap" id="stageWrap">
                                <div 
                                    className="stageWrapContent" 
                                    id="stageWrapContent" 
                                    style={{cursor: btnHandActive ? 'move' : 'initial'}}
                                    draggable={btnHandActive}
                                    onClick={(e) => stageClick(e)} 
                                    onDrag={(e) => stageDrag(e)} 
                                    onDragStart={(e) => stageDragStart(e)}
                                    onDragEnd={(e) => stageDragEnd(e)}
                                >
                                    { UploadSvg(svgFile) }
                                    { DrawSvg(constraints, constraintPoints, eventPoints) }
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}

export default WorkStage;