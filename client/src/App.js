import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard/dashboard';
import Login from './pages/LoginPage/login';
import { connecWithWebSocketServer } from './utils/wssConnection/wssConnection';

function App() {

  useEffect(() => {
    
    connecWithWebSocketServer()
  }, []);
  

  return (
    <div>
      <Router>
        
          <Switch>
            <Route exact path="/login">
              <Login/>
            </Route>

            <Route exact path="/dashboard">
              <Dashboard/>
            </Route>

          </Switch>
        
      </Router>
      
      
    </div>
  );
}

export default App;
