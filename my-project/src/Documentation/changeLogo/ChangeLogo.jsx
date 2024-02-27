import 'assets/css/bootstrap.min.css';
import 'assets/css/icons.min.css';
import 'assets/css/app.min.css';

import React from "react";

const ChangelogPage = () => {
  return (
    <>
      <meta charSet="utf-8" />
      <title>Changelog | Chatvia - Responsive TailwindCSS Chat App</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta content="Chatvia Premium Multipurpose Admin & Dashboard Template documentation of HTML" name="description" />
      <meta content="Themesbrand" name="author" />
      <meta name="keywords" content="Chatvia HTML documentation" />
      {/* App favicon */}
      <link rel="shortcut icon" href="assets/images/favicon.ico" />
      {/* TailwindCSS Css */}
      {/* <link href="assets/css/bootstrap.min.css" id="bootstrap-style" rel="stylesheet" type="text/css" /> */}
      {/* Icons Css */}
      {/* <link href="assets/css/icons.min.css" rel="stylesheet" type="text/css" /> */}
      {/* App Css*/}
      {/* <link href="assets/css/app.min.css" id="app-style" rel="stylesheet" type="text/css" /> */}
      {/* Begin page */}
      <div id="layout-wrapper">
        <header id="page-topbar">
          <div className="navbar-header">
            <div className="d-flex">
              {/* LOGO */}
              <div className="navbar-brand-box">
                <a href="index.html" className="logo logo-light">
                  <span className="logo-sm">
                    <img src="assets/images/logo.svg" alt="" height={25} />
                  </span>
                  <span className="logo-lg">
                    <img src="assets/images/logo-light.png" alt="" height={22} />{" "}
                    <span className="ml-2 badge badge-soft-success">HTML</span>
                  </span>
                </a>
              </div>
              <button type="button" className="px-3 btn btn-sm font-size-24 header-item waves-effect d-lg-none" id="vertical-menu-btn" >
                <i className="mdi mdi-menu" />
              </button>
            </div>
            <div className="d-flex">
              <div className="d-inline-block">
                <a href="https://themeforest.net/item/chavia-html5-chat-template/27926898/support" target="_blank" className="header-item">
                  Support
                </a>
              </div>
              <div className="d-none d-md-inline-block">
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSfiP9bDHzIQdQoMXFrYvJx00wyFzSu_cqBWP0N0uUHpqjrbzQ/viewform" target="_blank" className="header-item">
                  Need Customization?
                </a>
              </div>
              <div className="d-inline-block">
                <a href="https://1.envato.market/chavia" target="_blank" className="header-item">
                  Buy Now
                </a>
              </div>
              <div className="d-inline-block">
                <h5 className="m-0 header-item">
                  <span className="badge badge-danger">v1.0.0</span>
                </h5>
              </div>
            </div>
          </div>
        </header>
        {/* ========== Left Sidebar Start ========== */}
        <div className="vertical-menu">
          <div data-simplebar="" className="h-100">
            {/*- Sidemenu */}
            <div id="sidebar-menu">
              {/* Left Menu Start */}
              <ul className="metismenu list-unstyled" id="side-menu">
                <li className="menu-title">Docs</li>
                <li>
                  <a href="index.html" className="waves-effect">
                    <i className="mdi mdi-text-box-outline" />
                    <span>Introduction</span>
                  </a>
                </li>
                <li>
                  <a href="setup.html" className=" waves-effect">
                    <i className="mdi mdi-cog-outline" />
                    <span>Setup</span>
                  </a>
                </li>
                <li className="menu-title">Themes</li>
                <li>
                  <a href="light.html" className=" waves-effect">
                    <i className="mdi mdi-white-balance-sunny" />
                    <span>Light Version</span>
                  </a>
                </li>
                <li>
                  <a href="dark.html" className=" waves-effect">
                    <i className="mdi mdi-weather-night" />
                    <span>Dark Version</span>
                  </a>
                </li>
                <li>
                  <a href="rtl.html" className=" waves-effect">
                    <i className="mdi mdi-web" />
                    <span>RTL Version</span>
                  </a>
                </li>
                <li>
                  <a href="colors.html" className=" waves-effect">
                    <i className="mdi mdi-palette" />
                    <span>Color Version</span>
                  </a>
                </li>
                <li className="menu-title">Other</li>
                <li>
                  <a href="changelog.html" className=" waves-effect">
                    <i className="mdi mdi-format-list-bulleted" />
                    <span>Changelog</span>
                  </a>
                </li>
              </ul>
            </div>
            {/* Sidebar */}
          </div>
        </div>
        {/* Left Sidebar End */}
        {/* ============================================================== */}
        {/* Start right Content here */}
        {/* ============================================================== */}
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="p-lg-1">
                        <div className="d-xl-flex">
                          <div className="w-100">
                            <div>
                              <div>
                                <div id="v-1-0" className="mb-4">
                                  <h4 className="mb-3">
                                    <span className="text-primary">v1.0.0</span>
                                    <small className="text-muted font-size-14"> {" "} - 29 August 2023{" "} </small>
                                  </h4>
                                  <ul>
                                    <li>Initial released</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Start right-side-nav */}
                          <div className="d-none d-xl-block">
                            <div className="right-side-nav">
                              <ul className="nav nav-pills flex-column">
                                <li className="nav-item">
                                  <a href="#v-1-0" className="nav-link">
                                    v1.0.0
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                          {/* End right-side-nav */}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end card */}
                </div>
              </div>
              {/* end row */}
            </div>{" "}
            {/* container-fluid */}
          </div>
          {/* End Page-content */}
          <footer className="footer">
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-6">© Themesbrand.</div>
                <div className="col-sm-6">
                  <div className="text-sm-right d-none d-sm-block">
                    Crafted with <i className="mdi mdi-heart text-danger" /> by{" "}
                    <a href="https://themesbrand.com/" target="_blank" className="text-muted">
                      Themesbrand
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
        {/* end main content*/}
      </div>
      {/* END layout-wrapper */}
      {/* JAVASCRIPT */}
    </>
  );
};

export default ChangelogPage;
