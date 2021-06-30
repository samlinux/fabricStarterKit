/**
 * Asset list component (shows all assets)
 */
class List extends React.Component {

    /**
     * List Constructor
     * @param {*} props
     */
    constructor(props) {
        super(props);
        // init state
        this.state = {
            error: null,
            isLoaded: false,
            deleteInProgress: false,
            items: []
        };
    }

    /**
     * Fetch asset list data
     */
    fetchListData() {
        const _this = this;
        fetch(apiUrl + "getAllAssets")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        deleteInProgress: false,
                        isLoaded: true,
                        items: result.value
                    });
                },
                (error) => {
                    _this.setState({
                        deleteInProgress: false,
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    /**
     * View template function to format price-values to always show 2 decimal places
     * @param {*} price 
     * @returns
     */
    priceRenderTemplate(price) {
        let priceStr = '0.00';
        if (price) {
            priceStr = (Math.round(price * 100) / 100).toFixed(2);
        }
        return priceStr;
    }

    /**
     * Create-Button: Click handler
     * Go to detail-view (without key-param)
     */
    createClicked() {
        this.props.history.push("/detail/create");
    }

    /**
     * Edit-Button: Click handler
     * Go to detail-view (including key-param of the asset)
     */
    editClicked(assetKey) {
        this.props.history.push("/detail/" + assetKey);
    }

    /**
     * History-Button: Click handler
     * Go to history-view (including key-param of the asset)
     */
    historyClicked(assetKey) {
        this.props.history.push("/history/" + assetKey);
    }

    /**
     * send delete-asset API-request to delete the asset with the key
     * @param {*} assetKey 
     */
    deleteClicked(assetKey) {
        const _this = this;
        // delete in progress
        this.state.deleteInProgress = true;
        this.setState(this.state);
        // delete API-request
        fetch(apiUrl + "delAsset/" + assetKey)
            .then(res => res.json())
            .then(
                (result) => {
                    // delete finished
                    _this.fetchListData();
                }
            );
    }

    /**
     * After Component initial rendering
     * - get asset list data
     */
    componentDidMount() {
        this.fetchListData();
    }

    /**
     * List Renderer
     * @returns HTML template of the asset list view
     */
    render() {
        const { error, isLoaded, deleteInProgress, items } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className={`asset-list ${deleteInProgress ? "asset-list-no-overflow" : ""}`}>
                    <h2>List of assets</h2>
                    <table class="table list-table">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col">Key</th>
                                <th scope="col">Description</th>
                                <th scope="col" class="col-numeric-value">Amount</th>
                                <th scope="col" class="col-numeric-value">Price</th>
                                <th scope="col" class="list-table-edit-col">
                                    <button type="button" class="btn btn-success list-button" onClick={this.createClicked.bind(this)}>Create asset</button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.Key}>
                                    <th scope="row">{item.Key}</th>
                                    <td>{item.Record.desc}</td>
                                    <td class="col-numeric-value">{item.Record.amount}</td>
                                    <td class="col-numeric-value">{this.priceRenderTemplate(item.Record.price)}</td>
                                    <td>
                                        <button type="button" class="btn btn-primary list-button" onClick={this.editClicked.bind(this, item.Key)}>Edit</button>
                                        <button type="button" class="btn btn-secondary list-button" onClick={this.historyClicked.bind(this, item.Key)}>History</button>
                                        <button type="button" class="btn btn-danger list-button" onClick={this.deleteClicked.bind(this, item.Key)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className={`list-table-disabled ${!deleteInProgress ? "hide-element" : ""}`}>
                        <div class="delete-spinner">
                            <div class="loader delete-loader">Loading...</div>
                        </div>
                    </div>
                </div >
            );
        }
    }
}