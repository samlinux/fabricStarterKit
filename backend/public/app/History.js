class History extends React.Component {
    constructor(props) {
        super(props);
        // look for asset-key in route-params
        let key = '';
        if (this.props.match.params) {
            if (this.props.match.params.key) {
                key = this.props.match.params.key;
            }
        }
        // init state
        this.state = {
            error: null,
            isLoaded: false,
            historyKey: (key !== '') ? key : false,
            items: [],
            txId: null,
            txData: {}
        };
    }

    fetchListData() {
        const _this = this;
        if (!this.state.historyKey) return;
        // Fetch asset-list data
        fetch(apiUrl + "getHistory/" + this.state.historyKey)
            .then(res => res.json())
            .then(
                (result) => {
                    let txValues = [],
                        txId = null,
                        txData = {};
                    if (result.value) {
                        if (result.value.length > 0) {
                            txValues = result.value;
                        }
                    }
                    if (txValues.length > 0) {
                        txId = txValues[0].txId;
                        txData = txValues[0];
                    }
                    this.setState({
                        isLoaded: true,
                        items: result.value,
                        txId: txId,
                        txData: txData
                    });
                },
                (error) => {
                    _this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    historyDetailClicked(entry) {
        if (entry.txId && entry.txId !== this.state.txId) {
            this.state.txId = entry.txId;
            this.state.txData = entry;
            this.setState(this.state);
        }
    }

    backClicked() {
        this.props.history.push("/");
    }

    componentDidMount() {
        this.fetchListData();
    }

    render() {
        const { error, isLoaded, historyKey, items, txId, txData } = this.state;
        if (!historyKey || historyKey === '') {
            return <div>No asset-key given...</div>;
        } else if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div class="history-list">
                    <h2>
                        Asset history - Key: {historyKey}
                        <button type="button" class="btn btn-secondary btn-back-to-list" onClick={this.backClicked.bind(this)}>Back to list</button>
                    </h2>
                    <div class="row">
                        <div class="col-sm-6">
                            <table class="table list-table-history">
                                <thead class="thead-dark">
                                    <tr>
                                        <th scope="col">TxID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map(item => (
                                        <tr key={item.txId} className={`history-transaction ${(txId === item.txId) ? "active" : ""}`}
                                            onClick={this.historyDetailClicked.bind(this, item)}>
                                            <td scope="row">{item.txId}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div class="col-sm-6">
                            <div className={`transaction-detail ${!txId ? "hide-element" : ""}`}>
                                <div class="card">
                                    <div class="card-header">
                                        <b>TxID:</b> {txId}
                                    </div>
                                    <div class="card-body">
                                        <table class="tx-detail-table">
                                            <tr>
                                                <td>Description:</td>
                                                <td>{txData.desc}</td>
                                            </tr>
                                            <tr>
                                                <td>Amount:</td>
                                                <td>{txData.amount}</td>
                                            </tr>
                                            <tr>
                                                <td>Price:</td>
                                                <td>{txData.price}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            );
        }
    }
}