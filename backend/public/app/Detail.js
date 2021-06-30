class Detail extends React.Component {
    constructor(props) {
        super(props);
        // look for asset-key in route-params
        let key = '';
        if (this.props.match.params) {
            if (this.props.match.params.key && this.props.match.params.key !== 'create') {
                key = this.props.match.params.key;
            }
        }
        // init state
        this.state = {
            error: null,
            isLoaded: false,
            storeKey: (key !== '') ? key : false,
            storeInProgress: false,
            data: {
                key: '',
                desc: '',
                amount: 0,
                price: 0
            }
        };
    }

    fetchDetailData() {
        // Fetch asset-detail data (if asset-key was given)
        fetch(apiUrl + "getData/" + this.state.storeKey)
            .then(res => res.json())
            .then(
                (result) => {
                    let fetchData = {},
                        errorMsg = null;
                    if (result.value) {
                        try {
                            fetchData = JSON.parse(result.value);
                        } catch (e) {
                            errorMsg = e.toString();
                        }
                    }
                    if (errorMsg) {
                        this.setState({
                            isLoaded: true,
                            error: {
                                message: errorMsg
                            }
                        });
                    } else {
                        fetchData.key = this.state.storeKey;
                        this.setState({
                            isLoaded: true,
                            data: fetchData
                        });
                    }
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    storeDetailData() {
        const _this = this;
        // cancel storeDetailData if a transaction is still ongoing
        if (this.state.storeInProgress) return;
        // lock buttons & show spinner
        this.state.storeInProgress = true;
        this.setState(this.state);
        // generate request data
        let requestData = {
            desc: this.state.data.desc,
            amount: this.state.data.amount.toString(),
            price: this.state.data.price.toString()
        };
        if (this.state.storeKey) {
            // Update asset with the given key
            requestData.no = this.state.storeKey;
        } else {
            requestData.no = this.state.data.key;
        }
        // Store asset (send post-request)
        fetch((apiUrl + "setData"), {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        }).then(function (response) {
            if (!_this.state.storeKey) {
                _this.state.storeKey = requestData.no;
            }
            _this.state.storeInProgress = false;
            _this.setState(_this.state);
        });
    }

    handleSubmit(event) {
        // prevent reload
        event.preventDefault();
        this.storeDetailData();
    }

    backClicked() {
        this.props.history.push("/");
    }

    formValueChanged(name, e) {
        let stateData = this.state;
        stateData.data[name] = e.target.value;
        this.setState(stateData);
    }

    componentDidMount() {
        if (this.state.storeKey) {
            // get asset data
            this.fetchDetailData();
        } else {
            // new/empty asset data
            this.setState({
                isLoaded: true
            });
        }
    }

    render() {
        const { error, isLoaded, storeInProgress, storeKey } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className={`asset-detail ${storeInProgress ? "asset-detail-no-overflow" : ""}`}>
                    <h2>Asset detail</h2>
                    <form onSubmit={(e) => this.handleSubmit(e)}>
                        <div class="form-group">
                            <label for="formGroupKey">Key</label>
                            <input type="text" class="form-control" id="formGroupKey" placeholder="Key" disabled={storeKey ? "disabled" : ""}
                                value={this.state.data.key} onChange={(e) => this.formValueChanged("key", e)} required />
                        </div>
                        <div class="form-group">
                            <label for="formGroupDescription">Description</label>
                            <input type="text" class="form-control" id="formGroupDescription" placeholder="Description"
                                value={this.state.data.desc} onChange={(e) => this.formValueChanged("desc", e)} required />
                        </div>
                        <div class="form-group">
                            <label for="formGroupAmount">Amount</label>
                            <input type="number" step="1" class="form-control" id="formGroupAmount" placeholder="Amount"
                                value={this.state.data.amount} onChange={(e) => this.formValueChanged("amount", e)} min="0" required />
                        </div>
                        <div class="form-group">
                            <label for="formGroupPrice">Price</label>
                            <input type="number" step="1" class="form-control" id="formGroupPrice" placeholder="Price"
                                value={this.state.data.price} onChange={(e) => this.formValueChanged("price", e)} min="0" required />
                        </div>
                        <div class="detail-buttons">
                            <button type="submit" class="btn btn-primary btn-submit" disabled={storeInProgress ? "disabled" : ""}>
                                Store asset
                                <span className={`btn-submit-spinner ${!storeInProgress ? "hide-element" : ""}`}>
                                    <div class="loader submit-btn-loader">Loading...</div>
                                </span>
                            </button>
                            <button type="button" class="btn btn-secondary" disabled={storeInProgress ? "disabled" : ""}
                                onClick={this.backClicked.bind(this)}>Back to list</button>
                        </div>
                    </form>
                </div>
            );
        }
    }
}