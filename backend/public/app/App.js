class App extends React.Component {

  /**
   * App Constructor
   * @param {*} props 
   */
  constructor(props) {
    super(props);
    // set state for the copyright-year in the footer
    this.state = {
      year: new Date().getFullYear()
    };
  }

  /**
   * App Renderer
   * @returns HTML template holding the defined route-components
   */
  render() {
    return (
      <ReactRouterDOM.HashRouter>
        <nav class="navbar navbar-light">
          <a class="navbar-brand" href="#">
            FabricStarterKit - Demo
          </a>
          <a class="navbar-sdg-logo" title="SDG - samlinux development group" href="https://samlinux.at/" target="_blank">
            <img src="../images/sdg_logo.png" />
          </a>
        </nav>
        <div class="app-container">
          <Route path="/" exact component={List} />
          <Route path="/detail/:key" component={Detail} />
          <Route path="/history/:key" component={History} />
        </div>
        <div class="footer">
          &copy; {this.state.year} SDG - samlinux development group
        </div>
      </ReactRouterDOM.HashRouter>
    );
  }
}
ReactDOM.render(<App />, document.querySelector('#root'));