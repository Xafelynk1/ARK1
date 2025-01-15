import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminUsers from './components/AdminUsers';
import OtherComponent from './components/OtherComponent'; // Example of other components

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/admin/users" component={AdminUsers} />
                {/* Other routes */}
                <Route path="/other" component={OtherComponent} />
            </Switch>
        </Router>
    );
};

export default App;
