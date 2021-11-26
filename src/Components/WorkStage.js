import React from 'react'
import ReactDOM from 'react-dom';
import { CRow, CCol, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider, CCard, CCardHeader, CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs, faSearchPlus, faSearchMinus, faHandPaper, faUndo, faFolderOpen, faCheck } from '@fortawesome/free-solid-svg-icons'
import HtmlToReact from 'html-to-react';

const HtmlToReactParser = new HtmlToReact.Parser();

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
    return (
        <div className="UploadSvg">
            { HtmlToReactParser.parseWithInstructions(svgText, isValidNode, processingInstructions, preprocessingInstructions) }
        </div>
    )
}

function DrawSvg(constraints, constraintPoints, eventPoints) {
    console.log('DrawSvg >>', eventPoints);
    return (
        <div className="DrawSvg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="243 70 2707 4313">
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
    const className = props.active ? "btn btn-sm btn-active mx-1 rounded" : "btn btn-sm btn-secondary mx-1 rounded disabled";
    return (
        <span className={className} onClick={props.onClick}>
            {props.children}
        </span>
    )
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
            setBtnEditActive(true);
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
        console.log('event:', event);
        const stageWrapContent = document.getElementById('stageWrapContent');
        const svg = document.getElementsByClassName('svgUpload')[0];
        
        if(typeof svg == 'undefined' || svg == null) {    
            alert('No SVG Uploaded!');
            return;
        }

        if(!isEdit) {
            alert('Please Click Constraint Icon');
            return;
        }

        if(typeof svg.firstElementChild.tagName == 'g') {

        }
        else {
            const pt = svg.createSVGPoint();    
                
            // pass event coordinates
            pt.x = event.clientX;
            pt.y = event.clientY;
        
            // transform to SVG coordinates
            const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

            setConstraintPoints([...constraintPoints, [svgP.x, svgP.y]]);

            setEventPoints([...eventPoints, {x: event.pageX - stageWrapContent.getBoundingClientRect().left, y: event.pageY - stageWrapContent.getBoundingClientRect().top}]);
        }
    }

    const cbEditBtnClick = function() {
        if(isEdit) {
            setContraints([...constraints, {points: constraintPoints}])
            setConstraintPoints([]);
            setEventPoints([]);
        }
        setIsEdit(!isEdit);
    }

    const [btnOpenActive, setBtnOpenActive] = React.useState(true);
    const [btnEditActive, setBtnEditActive] = React.useState(false);
    const [btnZoomInActive, setBtnZoomInActive] = React.useState(false);
    const [btnZoomOutActive, setBtnZoomOutActive] = React.useState(false);
    const [btnHandActive, setBtnHandActive] = React.useState(false);
    const [btnResetActive, setBtnResetActive] = React.useState(false);

    return (
        <CRow>
            <CCol xs={6}>
                <CCard className="my-4">
                    <CCardHeader>
                        <div className="d-flex align-items-center justify-content-between">
                            <span>Canvas</span>
                            <div className="">
                                <WorkToolBarButton active={btnOpenActive} onClick={() => openFile()}><FontAwesomeIcon icon={faFolderOpen} /></WorkToolBarButton>
                                <WorkToolBarButton active={btnEditActive} onClick={() => cbEditBtnClick()}><FontAwesomeIcon icon={isEdit ? faCheck : faCogs} /></WorkToolBarButton>
                                <WorkToolBarButton active={btnZoomInActive} ><FontAwesomeIcon icon={faSearchPlus} /></WorkToolBarButton>
                                <WorkToolBarButton active={btnZoomOutActive} ><FontAwesomeIcon icon={faSearchMinus} /></WorkToolBarButton>
                                <WorkToolBarButton active={btnHandActive} ><FontAwesomeIcon icon={faHandPaper} /></WorkToolBarButton>
                                <WorkToolBarButton active={btnResetActive} ><FontAwesomeIcon icon={faUndo} /></WorkToolBarButton>
                            </div>
                            <CDropdown>
                                <CDropdownToggle className="no-direction" color="" size="sm"><CIcon icon={icon.cilOptions} /></CDropdownToggle>
                                <CDropdownMenu>
                                    <CDropdownItem href="#">Optimize</CDropdownItem>
                                    <CDropdownItem href="#">Clear</CDropdownItem>
                                    <CDropdownDivider/>

                                    <CDropdownItem href="#">Download</CDropdownItem>
                                    <CDropdownItem href="#">Download JPEG</CDropdownItem>
                                    <CDropdownItem href="#">Print</CDropdownItem>
                                    <CDropdownItem href="#">Show Optimized Blank</CDropdownItem>
                                    <CDropdownItem href="#">Show All</CDropdownItem>
                                    <CDropdownDivider/>
                                    
                                    <CDropdownItem href="#">Hide Constraints</CDropdownItem>
                                    <CDropdownItem href="#">Show Constraints</CDropdownItem>
                                    <CDropdownItem href="#">Remove Constraint</CDropdownItem>
                                    <CDropdownItem href="#">Copy Constraint</CDropdownItem>
                                </CDropdownMenu>
                            </CDropdown>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        <div className="stageContainer">
                            <div className="stageWrap" id="stageWrap">
                                <div className="stageWrapContent" id="stageWrapContent" onClick={(e) => stageClick(e)}>
                                    { UploadSvg(svgFile) }
                                    { DrawSvg(constraints, constraintPoints, eventPoints) }
                                </div>
                            </div>
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default WorkStage;