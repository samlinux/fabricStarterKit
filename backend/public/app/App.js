class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  render() {
    return (
      <ReactRouterDOM.HashRouter>
        <nav class="navbar navbar-dark bg-dark">
          <a class="navbar-brand" href="#">
            FabricStarterKit - Demo
          </a>
        </nav>
        <div class="app-container">
          <Route path="/" exact component={List} />
          <Route path="/detail/:key" component={Detail} />
          <Route path="/history/:key" component={History} />
        </div>
      </ReactRouterDOM.HashRouter>
    );
  }
}
ReactDOM.render(<App />, document.querySelector('#root'));