
import React from 'react'
import { CRow, CCol, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider, CCard, CCardHeader, CCardBody } from '@coreui/react'
import CIcon from '@coreui/icons-react';
import * as icon from '@coreui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs, faSearchPlus, faSearchMinus, faHandPaper, faUndo, faFolderOpen, faCheck } from '@fortawesome/free-solid-svg-icons'
import HtmlToReact from 'html-to-react';

const HtmlToReactParser = new HtmlToReact.Parser();

function WorkStage() {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('accept', '.svg');
    const [svgRender, setSVGRender] = React.useState('');
    const readFile = function(evt) {
        var reader  = new FileReader();
        reader.readAsText(fileSelector.files[0]);
        reader.onloadend = function () {
                    
            console.log('file read>>>>', reader.result);
            setSVGRender(reader.result);
        }
    }

    fileSelector.addEventListener('change', readFile, false);
    const openFile = function() {
        fileSelector.click();
    }

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
        // {
        //     shouldProcessNode: function (node) {
        //         return node.attribs && node.attribs.id === 'preprocessed-second';
        //     },
        //     processNode: function (node, children, index) {
        //         return React.createElement('h2', {key: index, id: node.attribs.id,}, 'Second');
        //     },
        // },
        {
            shouldProcessNode: function (node) {
                return node.tagName === 'svg';
            },
            processNode: function (node, children, index) {
                node.attribs.className = 'svgUpload';
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

    let constraints = [];
    let constraint_points = [];
    const [changes, setChanges] = React.useState(false);
    
    const stageClick = function(event) {

        // if(!isEdit) {
        //     return;
        // }

        const svg = document.getElementsByClassName('svgUpload')[0];

        if(typeof svg == 'undefined' || svg == null) {
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
            // polyline1.push(svgP.x);
            // polyline1.push(svgP.y);
            let polygon;
            if(constraint_points.length == 0) {
                polygon = document.createElement('polygon');
                polygon.className="polyline polyline_";
                polygon.setAttribute('opacity', 0.3);
                polygon.setAttribute('fill', 'blue');
                svg.appendChild(polygon);
            }
            else {
                polygon = svg.getElementsByTagName('polygon')[0];
            }

            if(typeof polygon == 'undefined') {
                return;
            }

            constraint_points.push(svgP.x);
            constraint_points.push(svgP.y);
            polygon.setAttribute('points', constraint_points.toString());
            
            // $('.polyline1_' + count_contraints_poly_1).attr('points', polyline1.toString());

            // coordinates_svg1.push([
            //     svgP.x,
            //     svgP.y
            // ]);
            if(constraint_points.length > 6) {
                setChanges(!changes);
            }
            
        }
    }

    const [isEdit, setIsEdit] = React.useState(false);
    const [svgLoaded, setSvgLoaded] = React.useState(false);

    const cbEditBtnClick = function() {
        setIsEdit(!isEdit);
    }

    return (
        <CRow>
            <CCol xs={6}>
                <CCard className="my-4">
                    <CCardHeader>
                        <div className="d-flex align-items-center justify-content-between">
                            <span>Canvas</span>
                            <div className="">
                                <span className="btn btn-sm btn-secondary mx-1 rounded" onClick={() => openFile()}><FontAwesomeIcon icon={faFolderOpen} /></span>
                                <span className="btn btn-sm btn-secondary mx-1 rounded" onClick={() => cbEditBtnClick()}><FontAwesomeIcon icon={isEdit ? faCheck : faCogs} /></span>
                                <span className="btn btn-sm btn-secondary mx-1 rounded"><FontAwesomeIcon icon={faSearchPlus} /></span>
                                <span className="btn btn-sm btn-secondary mx-1 rounded"><FontAwesomeIcon icon={faSearchMinus} /></span>
                                <span className="btn btn-sm btn-secondary mx-1 rounded"><FontAwesomeIcon icon={faHandPaper} /></span>
                                <span className="btn btn-sm btn-secondary mx-1 rounded"><FontAwesomeIcon icon={faUndo} /></span>
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
                            {changes ? "Change" : "NoChange"}
                            <div className="stageWrap" onClick={(e) => stageClick(e)}>
                                { HtmlToReactParser.parseWithInstructions(svgRender, isValidNode, processingInstructions, preprocessingInstructions) }
                            </div>
                        </div>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
}

export default WorkStage;