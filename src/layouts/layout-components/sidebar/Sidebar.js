import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Nav, Collapse } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useSelector, useDispatch } from "react-redux";

import {
  lmenuClickOptimize,
  lmenuClickClear,
  lmenuClickDownload,
  lmenuClickDownloadJPEG,
  lmenuClickPrint,
  lmenuClickShowOptimizedBlank,
  lmenuClickShowAll,
  lmenuClickHideConstraints,
  lmenuClickShowConstraints,
  lmenuClickRemoveConstraints
} from "../../../redux/bot/Action";
const Sidebar = (props) => {
  const dispatch = useDispatch();

  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "selected" : "";
  };
  const [state, setState] = useState({
    authentication: activeRoute("/authentication") !== "" ? true : false,
    uicomponents: activeRoute("/ui-components") !== "" ? true : false,
    samplepages: activeRoute("/sample-pages") !== "" ? true : false,
    dashboardpages: activeRoute("/dashboards") !== "" ? true : false,
    iconsPages: activeRoute("/icons") !== "" ? true : false,
    formlayoutPages: activeRoute("/form-layouts") !== "" ? true : false,
    formpickerPages: activeRoute("/form-pickers") !== "" ? true : false,
  });
  const [cstate, csetState] = useState({
    extrapages: activeRoute("/sample-pages/extra-pages") !== "" ? true : false,
  });
  const settings = useSelector((state) => state.settings);
  const botSettings = useSelector((state) => state.bot);

  /*--------------------------------------------------------------------------------*/
  /*To Expand SITE_LOGO With Sidebar-Menu on Hover                                  */
  /*--------------------------------------------------------------------------------*/
  const expandLogo = () => {
    document.getElementById("logobg").classList.toggle("expand-logo");
  };
  /*--------------------------------------------------------------------------------*/
  /*Verifies if routeName is the one active (in browser input)                      */
  /*--------------------------------------------------------------------------------*/

  /*--------------------------------------------------------------------------------*/
  /*Its for scroll to to                    */
  /*--------------------------------------------------------------------------------*/

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showMobilemenu = () => {
    if (window.innerWidth < 800) {
      document.getElementById("main-wrapper").classList.toggle("show-sidebar");
    }
  };

  return (
    <aside
      className="left-sidebar"
      id="sidebarbg"
      data-sidebarbg={settings.activeSidebarBg}
      onMouseEnter={expandLogo.bind(null)}
      onMouseLeave={expandLogo.bind(null)}
    >
      <div className="scroll-sidebar">
        <PerfectScrollbar className="sidebar-nav">
          {/*--------------------------------------------------------------------------------*/}
          {/* Sidebar Menus will go here                                                */}
          {/*--------------------------------------------------------------------------------*/}
          <Nav id="sidebarnav">
            <li className={"sidebar-item" + (botSettings.lmenuItemStateOptimize ? "" : " disabled")}>
              <span className="sidebar-link" onClick={() => botSettings.lmenuItemStateOptimize ? dispatch(lmenuClickOptimize()) : null}>
                <i className="mdi mdi-note" />
                <span className="hide-menu">Optimize</span>
              </span>
            </li>
            <li className={"sidebar-item" + (botSettings.lmenuItemStateClear ? "" : " disabled")}>
              <span className="sidebar-link" onClick={() => botSettings.lmenuItemStateClear ? dispatch(lmenuClickClear()) : null}>
                <i className="mdi mdi-note" />
                <span className="hide-menu">Clear</span>
              </span>
            </li>
            <li className={"sidebar-item" + (botSettings.lmenuItemStateDownload ? "" : " disabled")}>
              <span className="sidebar-link" onClick={() => botSettings.lmenuItemStateDownload ? dispatch(lmenuClickDownload()) : null}>
                <i className="mdi mdi-note" />
                <span className="hide-menu">Download</span>
              </span>
            </li>
            <li className={"sidebar-item" + (botSettings.lmenuItemStateDownloadJPEG ? "" : " disabled")}>
              <span className="sidebar-link" onClick={() => botSettings.lmenuItemStateDownloadJPEG ? dispatch(lmenuClickDownloadJPEG()) : null}>
                <i className="mdi mdi-note" />
                <span className="hide-menu">DownloadJPEG</span>
              </span>
            </li>
            <li className={"sidebar-item" + (botSettings.lmenuItemStatePrint ? "" : " disabled")}>
              <span className="sidebar-link" onClick={() => botSettings.lmenuItemStatePrint ? dispatch(lmenuClickPrint()) : null}>
                <i className="mdi mdi-note" />
                <span className="hide-menu">Print</span>
              </span>
            </li>
            <li className={"sidebar-item" + (botSettings.lmenuItemStateShowOptimizedBlank ? "" : " disabled")}>
              <span className="sidebar-link" onClick={() => botSettings.lmenuItemStateShowOptimizedBlank ? dispatch(lmenuClickShowOptimizedBlank()) : null}>
                <i className="mdi mdi-note" />
                <span className="hide-menu">Show Optimized Blank</span>
              </span>
            </li>
            <li className={"sidebar-item" + (botSettings.lmenuItemStateShowAll ? "" : " disabled")}>
              <span className="sidebar-link" onClick={() => botSettings.lmenuItemStateShowAll ? dispatch(lmenuClickShowAll()) : null}>
                <i className="mdi mdi-note" />
                <span className="hide-menu">Show All</span>
              </span>
            </li>
            <li className={"sidebar-item" + (botSettings.lmenuItemStateHideConstraints ? "" : " disabled")}>
              <span className="sidebar-link" onClick={() => botSettings.lmenuItemStateHideConstraints ? dispatch(lmenuClickHideConstraints()) : null}>
                <i className="mdi mdi-note" />
                <span className="hide-menu">Hide Constraints</span>
              </span>
            </li>
            <li className={"sidebar-item" + (botSettings.lmenuItemStateShowConstraints ? "" : " disabled")}>
              <span className="sidebar-link" onClick={() => botSettings.lmenuItemStateShowConstraints ? dispatch(lmenuClickShowConstraints()) : null}>
                <i className="mdi mdi-note" />
                <span className="hide-menu">Show Constraints</span>
              </span>
            </li>
            <li className={"sidebar-item" + (botSettings.lmenuItemStateRemoveConstraints ? "" : " disabled")}>
              <span className="sidebar-link" onClick={() => botSettings.lmenuItemStateRemoveConstraints ? dispatch(lmenuClickRemoveConstraints()) : null}>
                <i className="mdi mdi-note" />
                <span className="hide-menu">Remove Constraints</span>
              </span>
            </li>

            {props.routes.map((prop, key) => {
              if (prop.redirect) {
                return null;
              } else if (prop.navlabel) {
                return (
                  <li className="nav-small-cap" key={key}>
                    <i className={prop.icon}></i>
                    <span className="hide-menu">{prop.name}</span>
                  </li>
                );
                /*--------------------------------------------------------------------------------*/
                /* Child Menus wiil be goes here                                                    */
                /*--------------------------------------------------------------------------------*/
              } else if (prop.collapse) {
                let firstdd = {};
                firstdd[prop.state] = !state[prop.state];

                return (
                  <li
                    className={activeRoute(prop.path) + " sidebar-item"}
                    key={key}
                  >
                    <span
                      data-toggle="collapse"
                      className="sidebar-link has-arrow"
                      aria-expanded={state[prop.state]}
                      onClick={() => setState(firstdd)}
                    >
                      {/* <FeatherIcon icon={prop.icon} /> */}
                      <i className={prop.icon} />
                      <span className="hide-menu">{prop.name}</span>
                    </span>
                    <Collapse isOpen={state[prop.state]}>
                      <ul className="first-level">
                        {prop.child.map((prop, key) => {
                          if (prop.redirect) return null;

                          /*--------------------------------------------------------------------------------*/
                          /* Child Sub-Menus wiil be goes here                                                    */
                          /*--------------------------------------------------------------------------------*/

                          if (prop.collapse) {
                            let seconddd = {};
                            seconddd[prop["cstate"]] = !cstate[prop.cstate];
                            return (
                              <li
                                className={
                                  activeRoute(prop.path) + " sidebar-item"
                                }
                                key={key}
                              >
                                <span
                                  data-toggle="collapse"
                                  className="sidebar-link has-arrow"
                                  aria-expanded={cstate[prop.cstate]}
                                  onClick={() => csetState(seconddd)}
                                >
                                  <i className={prop.icon} />
                                  <span className="hide-menu">{prop.name}</span>
                                </span>
                                <Collapse isOpen={cstate[prop.cstate]}>
                                  <ul className="second-level">
                                    {prop.subchild.map((prop, key) => {
                                      if (prop.redirect) return null;
                                      return (
                                        <li
                                          className={
                                            activeRoute(prop.path) +
                                            " sidebar-item"
                                          }
                                          key={key}
                                        >
                                          <NavLink
                                            to={prop.path}
                                            activeClassName="active"
                                            className="sidebar-link"
                                          >
                                            <i className={prop.icon} />
                                            <span className="hide-menu">
                                              {prop.name}
                                            </span>
                                          </NavLink>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </Collapse>
                              </li>
                            );
                          } else {
                            return (
                              <li
                                onClick={scrollTop}
                                className={
                                  activeRoute(prop.path) +
                                  (prop.pro ? " active active-pro" : "") +
                                  " sidebar-item"
                                }
                                key={key}
                              >
                                <NavLink
                                  to={prop.path}
                                  className="sidebar-link"
                                  activeClassName="active"
                                  onClick={showMobilemenu}
                                >
                                  <i className={prop.icon} />
                                  <span className="hide-menu">{prop.name}</span>
                                </NavLink>
                              </li>
                            );
                          }
                        })}
                      </ul>
                    </Collapse>
                  </li>
                );
              } else {
                return (
                  /*--------------------------------------------------------------------------------*/
                  /* Adding Sidebar Item                                                            */
                  /*--------------------------------------------------------------------------------*/
                  <li
                    onClick={scrollTop}
                    className={
                      activeRoute(prop.path) +
                      (prop.pro ? " active active-pro" : "") +
                      " sidebar-item"
                    }
                    key={key}
                  >
                    <NavLink
                      to={prop.path}
                      onClick={showMobilemenu}
                      className="sidebar-link"
                      activeClassName="active"
                    >
                      {/* <FeatherIcon icon={prop.icon} /> */}
                      <i className={prop.icon} />
                      <span className="hide-menu">{prop.name}</span>
                    </NavLink>
                  </li>
                );
              }
            })}
          </Nav>
        </PerfectScrollbar>
      </div>
    </aside>
  );
};

export default Sidebar;
