import 'assets/css/bootstrap.min.css';
import 'assets/css/icons.min.css';
import 'assets/css/app.min.css';

export default function Setup() {
  return (
    <>
      <meta charSet="utf-8" />
      <title>Setup | Chatvia - Responsive TailwindCSS Chat App</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta content="Chatvia Premium Multipurpose Admin & Dashboard Template documentation of HTML" name="description"/>
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
              <button type="button" className="px-3 btn btn-sm font-size-24 header-item waves-effect d-lg-none" id="vertical-menu-btn">
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
                  <div className="card ">
                    <div className="card-body">
                      <div className="p-lg-1">
                        <div className="d-xl-flex">
                          <div className="w-100">
                            <h4 className="mt-0 mb-4">Setup HTML</h4>
                            <div id="desc" className="mb-5">
                              <h5 className="mt-4">Introduction</h5>
                              <p>
                                We are using
                                <a href="https://vitejs.dev/" target="_blank"> Vite </a>{" "}
                                which allows having complete automation for
                                build flow. In case if you don't know Vite then
                                it's easy to use it. At the very basic level,
                                developing using Vite is not that much different
                                from using a static file server. However, Vite
                                provides many enhancements over native ESM
                                imports to support various features that are
                                typically seen in bundler-based setups.
                                <a href="https://vitejs.dev/" target="_blank"> here </a>
                                . Please follow below steps to install and setup
                                all prerequisites:
                              </p>
                            </div>
                            <div id="prerequisites" className="mb-5">
                              <h5 className="mt-4">Prerequisites</h5>
                              <p>
                                Please follow below steps to install and setup
                                all prerequisites:
                              </p>
                              <ul>
                                <li>
                                  <strong>Yarn</strong>
                                  <p>
                                    Make sure to have the{" "}
                                    <a href="https://classic.yarnpkg.com/en/" target="_blank"> Yarn </a>{" "}
                                    installed &amp; running in your computer. If
                                    you already have installed Yarn on your
                                    computer, you can skip this step. We suggest
                                    you to use Yarn instead of NPM.
                                  </p>
                                </li>
                                <li>
                                  <strong>Nodejs</strong>
                                  <p>
                                    Make sure to have the{" "}
                                    <a href="https://nodejs.org/" target="_blank"> Node.js </a>{" "}
                                    installed &amp; running in your computer. If
                                    you already have installed Node on your
                                    computer, you can skip this step if your
                                    existing node version is greater than 18. We
                                    suggest you to use LTS version of Node.js.{" "}
                                  </p>
                                </li>
                                <li>
                                  <strong>Git</strong>
                                  <p>
                                    Make sure to have the{" "}
                                    <a href="https://git-scm.com/" target="_blank"> Git </a>{" "}
                                    installed globally &amp; running on your
                                    computer. If you already have installed git
                                    on your computer, you can skip this step.
                                  </p>
                                </li>
                              </ul>
                            </div>
                            <div id="installation">
                              <h5 className="mt-4">Installation</h5>
                              <p>
                                To setup the admin theme, follow below-mentioned
                                steps:
                              </p>
                              <ul>
                                <li>
                                  <strong>Install Prerequisites</strong>
                                  <p>
                                    Make sure to have all above prerequisites
                                    installed &amp; running on your computer
                                  </p>
                                </li>
                              </ul>
                              <p className="mt-4">
                                After you finished with the above steps, you can
                                run the following commands into the terminal /
                                command prompt from the root directory of the
                                project to run the project locally or build for
                                production use:
                              </p>
                              <table className="table m-0 table-bordered">
                                <thead>
                                  <tr>
                                    <th style={{ width: "20%" }}>
                                      <i className="ti-file" /> Command
                                    </th>
                                    <th>Description</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <code>yarn install</code>
                                    </td>
                                    <td>
                                      This would install all the required
                                      dependencies in the{" "}
                                      <code>node_modules</code> folder.
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <code>npm run build</code>
                                    </td>
                                    <td>
                                      Generates a <code>/dist</code> directory
                                      with all the production files.
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <code>npm run start</code>
                                    </td>
                                    <td>
                                      Runs the project locally, starts the
                                      development server and watches for any
                                      changes in your code, including your HTML,
                                      javascript, sass, etc. The development
                                      server is accessible at{" "}
                                      <a href="http://localhost:8080"> http://localhost:8080 </a>
                                      .
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div id="tips">
                              <h5 className="mt-4">Tips</h5>
                              <p>
                                css: We suggest you to do not change any css
                                files from the assets/css/custom folders because
                                to get new updates will might be break your CSS
                                changes if any you have made. We strongly
                                suggest you to create new custom.css file and
                                use that instead of overwrite any theme's custom
                                css files.
                              </p>
                            </div>
                          </div>
                          {/* Start right-side-nav */}
                          <div className="d-none d-xl-block">
                            <div className="right-side-nav">
                              <ul className="nav nav-pills flex-column">
                                <li className="nav-item">
                                  <a href="#desc" className="nav-link"> Description </a>
                                </li>
                                <li className="nav-item">
                                  <a href="#prerequisites" className="nav-link"> Prerequisites </a>
                                </li>
                                <li className="nav-item">
                                  <a href="#installation" className="nav-link"> Installation </a>
                                </li>
                                <li className="nav-item">
                                  <a href="#tips" className="nav-link"> Tips </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                          {/* End right-side-nav */}
                        </div>
                      </div>{" "}
                      {/* end padding*/}
                    </div>{" "}
                    {/* end card-body*/}
                  </div>{" "}
                  {/* end card*/}
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
}
